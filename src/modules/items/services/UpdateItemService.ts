import { injectable, inject } from 'tsyringe';
import Item from '@modules/items/infra/typeorm/entities/Item';
import AppError from '@shared/errors/AppError';
import IItemsRepository from '@modules/items/repositories/IItemsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface IRequest {
  item_id: string;
  name: string;
  rating?: number;
  cost: number;
  restaurant_id: string;
  user_id: string;
}

@injectable()
class CreateItemService {
  constructor(
    @inject('ItemsRepository')
    private itemsRepository: IItemsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    item_id,
    name,
    cost,
    rating = 0,
    restaurant_id,
    user_id,
  }: IRequest): Promise<Item> {
    const findItemId = await this.itemsRepository.findById(item_id);

    if (!findItemId) {
      throw new AppError('This item does not exist');
    }

    if (user_id !== findItemId.restaurant.user.id) {
      throw new AppError('You can not edit this item');
    }

    const findItem = await this.itemsRepository.findSameItem(
      name,
      restaurant_id,
    );

    if (findItem) {
      throw new AppError('This item already exists');
    }

    const item = await this.itemsRepository.update({
      item_id,
      name,
      cost,
      rating,
      restaurant_id,
    });

    await this.cacheProvider.invalidatePrefix('items');

    await this.cacheProvider.invalidate(`restaurant-items:${restaurant_id}`);

    await this.cacheProvider.invalidate(`single-item:${item.id}`);

    return item;
  }
}

export default CreateItemService;
