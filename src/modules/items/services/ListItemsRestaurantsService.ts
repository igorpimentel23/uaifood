import { injectable, inject } from 'tsyringe';
import IItemsRepository from '@modules/items/repositories/IItemsRepository';
import Item from '@modules/items/infra/typeorm/entities/Item';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface IRequest {
  name?: string | null;
  rating?: number | null;
  cost?: number | null;
  greater_than?: number | null;
  less_than?: number | null;
  restaurant_id?: string | null;
  radius?: number | null;
  lat?: number | null;
  lng?: number | null;
}

@injectable()
class ListItemsRestaurantsService {
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
    radius = null,
    lat = null,
    lng = null,
  }: IRequest): Promise<Item[] | undefined> {
    const findItems = await this.itemsRepository.findRestaurants({
      name,
      rating,
      cost,
      greater_than,
      less_than,
      restaurant_id,
      radius,
      lat,
      lng,
    });

    return findItems;
  }
}

export default ListItemsRestaurantsService;
