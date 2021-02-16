import { injectable, inject } from 'tsyringe';

import Item from '@modules/items/infra/typeorm/entities/Item';
import IItemsRepository from '@modules/items/repositories/IItemsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { classToClass } from 'class-transformer';

@injectable()
class ListUserItemsService {
  constructor(
    @inject('ItemsRepository')
    private itemsRepository: IItemsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute(restaurant_id: string): Promise<Item[]> {
    const cacheKey = `restaurant-items:${restaurant_id}`;

    let items = await this.cacheProvider.recover<Item[]>(cacheKey);

    if (!items) {
      items = await this.itemsRepository.index({ restaurant_id });

      await this.cacheProvider.save(cacheKey, classToClass(items));
    }

    return items;
  }
}

export default ListUserItemsService;
