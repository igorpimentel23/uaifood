import { container } from 'tsyringe';

import './providers';

import IRestaurantRepository from '@modules/restaurants/repositories/IRestaurantsRepository';
import RestaurantsRepository from '@modules/restaurants/infra/typeorm/repositories/RestaurantsRepository';

import IItemRepository from '@modules/items/repositories/IItemsRepository';
import ItemsRepository from '@modules/items/infra/typeorm/repositories/ItemsRepository';

container.registerSingleton<IRestaurantRepository>(
  'RestaurantsRepository',
  RestaurantsRepository,
);

container.registerSingleton<IItemRepository>(
  'ItemsRepository',
  ItemsRepository,
);
