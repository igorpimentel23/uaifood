import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IItemsRepository from '@modules/items/repositories/IItemsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface IRequest {
  user_id: string;
  item_id: string;
}

@injectable()
class DeleteItemService {
  constructor(
    @inject('ItemsRepository')
    private itemsRepository: IItemsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ user_id, item_id }: IRequest): Promise<void> {
    const findItem = await this.itemsRepository.findById(item_id);

    if (!findItem) {
      throw new AppError('This item does not exist');
    }

    if (user_id !== findItem.restaurant.user.id) {
      throw new AppError('You can not delete this item');
    }

    await this.itemsRepository.delete(item_id);

    await this.cacheProvider.invalidatePrefix('items');

    await this.cacheProvider.invalidate(
      `restaurant-items:${findItem.restaurant.id}`,
    );

    await this.cacheProvider.invalidate(`single-item:${item_id}`);
  }
}

export default DeleteItemService;
