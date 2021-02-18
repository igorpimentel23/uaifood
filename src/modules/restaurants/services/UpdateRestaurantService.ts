import { injectable, inject } from 'tsyringe';
import Restaurant from '@modules/restaurants/infra/typeorm/entities/Restaurant';
import AppError from '@shared/errors/AppError';
import IRestaurantsRepository from '@modules/restaurants/repositories/IRestaurantsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IPositionProvider from '@shared/container/providers/PositionProvider/models/IPositionProvider';

interface IRequest {
  restaurant_id: string;
  name: string;
  street: string;
  street_number: number;
  city: string;
  state: string;
  cost: number;
  rating?: number;
  type: string;
  user_id: string;
}

@injectable()
class UpdateRestaurantService {
  constructor(
    @inject('RestaurantsRepository')
    private restaurantsRepository: IRestaurantsRepository,

    @inject('PositionProvider')
    private positionProvider: IPositionProvider,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    restaurant_id,
    name,
    street,
    street_number,
    city,
    state,
    cost,
    rating = 0,
    type,
    user_id,
  }: IRequest): Promise<Restaurant> {
    const findRestaurantId = await this.restaurantsRepository.findById(
      restaurant_id,
    );

    if (!findRestaurantId) {
      throw new AppError('This restaurant does not exist');
    }

    if (user_id !== findRestaurantId.user_id) {
      throw new AppError('You can not edit this restaurant');
    }

    const findRestaurant = await this.restaurantsRepository.findSameRestaurant(
      name,
      type,
    );

    if (findRestaurant) {
      throw new AppError('This restaurant already exists');
    }

    let { lat, lng } = findRestaurantId;

    if (
      street !== findRestaurantId.street ||
      street_number !== findRestaurantId.street_number ||
      city !== findRestaurantId.city ||
      state !== findRestaurantId.state
    ) {
      const coord = await this.positionProvider.getCoord({
        street,
        street_number,
        city,
        state,
      });

      if (!coord) {
        throw new AppError('Could not find address');
      }

      [lat, lng] = coord;
    }

    const restaurant = await this.restaurantsRepository.update({
      restaurant_id,
      name,
      street,
      street_number,
      city,
      state,
      cost,
      rating,
      type,
      user_id,
      lat,
      lng,
    });

    await this.cacheProvider.invalidatePrefix('restaurants');

    await this.cacheProvider.invalidate(`user-restaurants:${user_id}`);

    await this.cacheProvider.invalidate(`single-restaurant:${restaurant.id}`);

    return restaurant;
  }
}

export default UpdateRestaurantService;
