import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IItemsRepository from '@modules/items/repositories/IItemsRepository';
import Item from '@modules/items/infra/typeorm/entities/Item';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

@injectable()
class ShowItemService {
  constructor(
    @inject('ItemsRepository')
    private itemsRepository: IItemsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute(item_id: string): Promise<Item> {
    const cacheKey = `single-item:${item_id}`;

    let findItem = await this.cacheProvider.recover<Item | undefined>(cacheKey);

    if (!findItem) {
      findItem = await this.itemsRepository.show(item_id);

      if (!findItem) {
        throw new AppError('This item does not exist');
      }

      await this.cacheProvider.save(cacheKey, findItem);
    }

    return findItem;
  }
}

export default ShowItemService;
