import { injectable, inject } from 'tsyringe';
import IItemsRepository from '@modules/items/repositories/IItemsRepository';
import Item from '@modules/items/infra/typeorm/entities/Item';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { classToClass } from 'class-transformer';

interface IRequest {
  name?: string | null;
  rating?: number | null;
  cost?: number | null;
  greater_than?: number | null;
  less_than?: number | null;
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
    name = null,
    rating = null,
    cost = null,
    greater_than = null,
    less_than = null,
    restaurant_id = null,
  }: IRequest): Promise<Item[]> {
    const cacheKey = `items:${name ? `name:${name}:` : ''}${
      cost ? `cost:${cost}:` : ''
    }${greater_than ? `greater_than:${greater_than}:` : ''}${
      less_than ? `less_than:${less_than}:` : ''
    }${rating ? `rating:${rating}:` : ''}${
      restaurant_id ? `restaurant_id:${restaurant_id}:` : ''
    }`;

    let findItems = await this.cacheProvider.recover<Item[] | undefined>(
      cacheKey,
    );

    if (!findItems) {
      findItems = await this.itemsRepository.index({
        name,
        rating,
        cost,
        greater_than,
        less_than,
        restaurant_id,
      });

      await this.cacheProvider.save(cacheKey, classToClass(findItems));
    }

    return findItems;
  }
}

export default ShowItemService;
