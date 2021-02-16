import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IRestaurantsRepository from '@modules/restaurants/repositories/IRestaurantsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface IRequest {
  user_id: string;
  restaurant_id: string;
}

@injectable()
class DeleteRestaurantService {
  constructor(
    @inject('RestaurantsRepository')
    private restaurantsRepository: IRestaurantsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ user_id, restaurant_id }: IRequest): Promise<void> {
    const findRestaurant = await this.restaurantsRepository.findById(
      restaurant_id,
    );

    if (!findRestaurant) {
      throw new AppError('This restaurant does not exist');
    }

    if ( user_id !== findRestaurant.user_id ) {
      throw new AppError('You can not delete this restaurant');
    }

    await this.restaurantsRepository.delete(restaurant_id);

    await this.cacheProvider.invalidatePrefix('restaurants');

    await this.cacheProvider.invalidate(`user-restaurants:${user_id}`);

    await this.cacheProvider.invalidate(`single-restaurant:${restaurant_id}`);
  }
}

export default DeleteRestaurantService;
