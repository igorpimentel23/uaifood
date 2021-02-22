import { injectable, inject } from 'tsyringe';
import Item from '@modules/items/infra/typeorm/entities/Item';
import AppError from '@shared/errors/AppError';
import IItemsRepository from '@modules/items/repositories/IItemsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IRestaurantsRepository from '@modules/restaurants/repositories/IRestaurantsRepository';

interface IRequest {
  item_id: string;
  name: string;
  rating?: number;
  cost: number;
  restaurant_id: string;
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
    item_id,
    name,
    cost,
    rating = 0,
    restaurant_id,
    avatar,
  }: IRequest): Promise<Item> {
    const findRestaurant = await this.restaurantsRepository.show(restaurant_id);

    if (!findRestaurant) {
      throw new AppError('This restaurant does not exist');
    }

    const findItemId = await this.itemsRepository.findById(item_id);

    if (!findItemId) {
      throw new AppError('This item does not exist');
    }

    const findItem = await this.itemsRepository.findSameItem(
      name,
      restaurant_id,
      item_id,
    );

    if (findItem) {
      throw new AppError('This item already exists');
    }

    const { geolocation } = findRestaurant;

    const item = await this.itemsRepository.update({
      item_id,
      name,
      cost,
      rating,
      restaurant_id,
      avatar,
      geolocation,
    });

    await this.cacheProvider.invalidatePrefix('items');

    await this.cacheProvider.invalidate(`restaurant-items:${restaurant_id}`);

    await this.cacheProvider.invalidate(`single-restaurant:${restaurant_id}`);

    if (restaurant_id !== item.restaurant_id) {
      await this.cacheProvider.invalidate(
        `restaurant-items:${item.restaurant_id}`,
      );

      await this.cacheProvider.invalidate(
        `single-restaurant:${item.restaurant_id}`,
      );
    }

    await this.cacheProvider.invalidate(`single-item:${item.id}`);

    await this.cacheProvider.invalidatePrefix('restaurants');

    return item;
  }
}

export default CreateItemService;
