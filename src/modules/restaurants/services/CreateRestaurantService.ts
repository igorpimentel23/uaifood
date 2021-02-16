import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';
import Restaurant from '@modules/restaurants/infra/typeorm/entities/Restaurant';
import AppError from '@shared/errors/AppError';
import IRestaurantsRepository from '@modules/restaurants/repositories/IRestaurantsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface IRequest {
  name: string;
  address: string;
  cost: number;
  type: string;
  user_id: string;
  lat: number;
  lng: number;
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
    name,
    address,
    cost,
    type,
    user_id,
    lat,
    lng,
  }: IRequest): Promise<Restaurant> {
    const findRestaurant = await this.restaurantsRepository.findSameRestaurant(
      name,
      type,
    );

    if (findRestaurant) {
      throw new AppError('This restaurant already exists');
    }

    const restaurant = await this.restaurantsRepository.create({
      name,
      address,
      cost,
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

export default CreateRestaurantService;
