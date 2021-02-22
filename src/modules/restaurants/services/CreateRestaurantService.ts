import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';
import Restaurant from '@modules/restaurants/infra/typeorm/entities/Restaurant';
import AppError from '@shared/errors/AppError';
import IRestaurantsRepository from '@modules/restaurants/repositories/IRestaurantsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IPositionProvider from '@shared/container/providers/PositionProvider/models/IPositionProvider';

interface IRequest {
  name: string;
  street: string;
  street_number: number;
  city: string;
  state: string;
  cost: number;
  type: string;
}

@injectable()
class CreateRestaurantService {
  constructor(
    @inject('RestaurantsRepository')
    private restaurantsRepository: IRestaurantsRepository,

    @inject('PositionProvider')
    private positionProvider: IPositionProvider,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    name,
    street,
    street_number,
    city,
    state,
    cost,
    type,
  }: IRequest): Promise<Restaurant> {
    const findRestaurant = await this.restaurantsRepository.findSameRestaurant(
      name,
      type,
    );

    if (findRestaurant) {
      throw new AppError('This restaurant already exists');
    }

    const coord = await this.positionProvider.getCoord({
      street,
      street_number,
      city,
      state,
    });

    if (!coord) {
      throw new AppError('Could not find address');
    }

    const [lat, lng] = coord;

    const restaurant = await this.restaurantsRepository.create({
      name,
      street,
      street_number,
      city,
      state,
      cost,
      type,
      lat,
      lng,
    });

    await this.cacheProvider.invalidatePrefix('restaurants');

    await this.cacheProvider.invalidate(`single-restaurant:${restaurant.id}`);

    return restaurant;
  }
}

export default CreateRestaurantService;
