import { container } from 'tsyringe';

import '@modules/users/providers';
import './providers';

import IRestaurantRepository from '@modules/restaurants/repositories/IRestaurantsRepository';
import RestaurantsRepository from '@modules/restaurants/infra/typeorm/repositories/RestaurantsRepository';

import IItemRepository from '@modules/items/repositories/IItemsRepository';
import ItemsRepository from '@modules/items/infra/typeorm/repositories/ItemsRepository';

import IUserRepository from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import UserTokensRepository from '@modules/users/infra/typeorm/repositories/UserTokensRepository';

container.registerSingleton<IRestaurantRepository>(
  'RestaurantsRepository',
  RestaurantsRepository,
);

container.registerSingleton<IItemRepository>(
  'ItemsRepository',
  ItemsRepository,
);

container.registerSingleton<IUserRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<IUserTokensRepository>(
  'UserTokensRepository',
  UserTokensRepository,
);
