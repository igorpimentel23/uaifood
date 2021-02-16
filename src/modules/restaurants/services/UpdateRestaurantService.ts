import { injectable, inject } from 'tsyringe';
import Restaurant from '@modules/restaurants/infra/typeorm/entities/Restaurant';
import AppError from '@shared/errors/AppError';
import IRestaurantsRepository from '@modules/restaurants/repositories/IRestaurantsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface IRequest {
  restaurant_id: string;
  name: string;
  address: string;
  cost: number;
  rating: number;
  type: string;
  user_id: string;
}

@injectable()
class CreateRestaurantService {
  constructor(
    @inject('RestaurantsRepository')
    private restaurantsRepository: IRestaurantsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    restaurant_id,
    name,
    address,
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
      restaurant_id,
    );

    if (findRestaurant) {
      throw new AppError('This restaurant already exists');
    }

    const restaurant = await this.restaurantsRepository.update({
      restaurant_id,
      name,
      address,
      cost,
      rating,
      type,
      user_id,
    });

    await this.cacheProvider.invalidatePrefix('restaurants');

    await this.cacheProvider.invalidate(`user-restaurants:${user_id}`);

    await this.cacheProvider.invalidate(`single-restaurant:${restaurant.id}`);

    return restaurant;
  }
}

export default CreateRestaurantService;
