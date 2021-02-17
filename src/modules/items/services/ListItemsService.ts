import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IItemsRepository from '@modules/items/repositories/IItemsRepository';
import Item from '@modules/items/infra/typeorm/entities/Item';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { classToClass } from 'class-transformer';

interface IRequest {
  name?: string | null;
  rating?: number | null;
  cost?: number | null;
  restaurant_id?: string | null;
}

@injectable()
class ShowItemService {
  constructor(
    @inject('ItemsRepository')
    private itemsRepository: IItemsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    name,
    rating,
    cost,
    restaurant_id,
  }: IRequest): Promise<Item[]> {
    const cacheKey = `items:${name ? `name:${name}:` : ''}${
      cost ? `cost:${cost}:` : ''
    }${rating ? `rating:${rating}:` : ''}${
      restaurant_id ? `restaurant_id:${restaurant_id}:` : ''
    }`; // criar funcao generate cachekey

    let findItems = await this.cacheProvider.recover<Item[] | undefined>(
      cacheKey,
    );

    if (!findItems) {
      findItems = await this.itemsRepository.index({
        name,
        rating,
        cost,
        restaurant_id,
      });

      await this.cacheProvider.save(cacheKey, classToClass(findItems));
    }

    return findItems;
  }
}

export default ShowItemService;
