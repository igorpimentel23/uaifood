import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IRestaurantsRepository from '@modules/restaurants/repositories/IRestaurantsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface IRequest {
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

  public async execute({ restaurant_id }: IRequest): Promise<void> {
    const findRestaurant = await this.restaurantsRepository.findById(
      restaurant_id,
    );

    if (!findRestaurant) {
      throw new AppError('This restaurant does not exist');
    }

    await this.restaurantsRepository.delete(restaurant_id);

    await this.cacheProvider.invalidatePrefix('restaurants');

    await this.cacheProvider.invalidate(`single-restaurant:${restaurant_id}`);

    await this.cacheProvider.invalidatePrefix('items');

    await this.cacheProvider.invalidate(`restaurant-items:${restaurant_id}`);

    await this.cacheProvider.invalidatePrefix(`single-item`);
  }
}

export default DeleteRestaurantService;
