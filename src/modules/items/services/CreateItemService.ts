import { injectable, inject } from 'tsyringe';
import Item from '@modules/items/infra/typeorm/entities/Item';
import AppError from '@shared/errors/AppError';
import IItemsRepository from '@modules/items/repositories/IItemsRepository';
import IRestaurantsRepository from '@modules/restaurants/repositories/IRestaurantsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface IRequest {
  name: string;
  cost: number;
  restaurant_id: string;
  user_id: string;
  rating?: number;
}

@injectable()
class CreateItemService {
  constructor(
    @inject('ItemsRepository')
    private itemsRepository: IItemsRepository,

    @inject('RestaurantsRepository')
    private restaurantsRepository: IRestaurantsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    name,
    cost,
    restaurant_id,
    user_id,
    rating = 0,
  }: IRequest): Promise<Item> {
    const findItem = await this.itemsRepository.findSameItem(
      name,
      restaurant_id,
    );

    const findRestaurant = await this.restaurantsRepository.show(restaurant_id);

    if (!findRestaurant) {
      throw new AppError('This restaurant does not exist');
    }

    if (user_id !== findRestaurant.user.id) {
      throw new AppError(
        'You can not create an item for a restaurant you do not own',
      );
    }

    if (findItem) {
      throw new AppError('This item already exists');
    }

    const item = await this.itemsRepository.create({
      name,
      cost,
      restaurant_id,
      user_id,
      rating,
    });

    await this.cacheProvider.invalidatePrefix('items');

    await this.cacheProvider.invalidate(`restaurant-items:${restaurant_id}`);

    await this.cacheProvider.invalidate(`single-item:${item.id}`);

    return item;
  }
}

export default CreateItemService;
