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
  rating?: number;
  avatar: string;
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
    rating = 0,
    avatar,
  }: IRequest): Promise<Item> {
    const findRestaurant = await this.restaurantsRepository.show(restaurant_id);

    if (!findRestaurant) {
      throw new AppError('This restaurant does not exist');
    }

    const findItem = await this.itemsRepository.findSameItem(
      name,
      restaurant_id,
    );

    if (findItem) {
      throw new AppError('This item already exists');
    }

    const { geolocation } = findRestaurant;

    const item = await this.itemsRepository.create({
      name,
      cost,
      restaurant_id,
      rating,
      avatar,
      geolocation,
    });

    await this.cacheProvider.invalidatePrefix('items');

    await this.cacheProvider.invalidate(`restaurant-items:${restaurant_id}`);

    await this.cacheProvider.invalidate(`single-item:${item.id}`);

    await this.cacheProvider.invalidatePrefix('restaurants');

    await this.cacheProvider.invalidate(`single-restaurant:${restaurant_id}`);

    return item;
  }
}

export default CreateItemService;
