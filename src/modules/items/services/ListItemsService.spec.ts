import AppError from '@shared/errors/AppError';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeRestaurantsRepository from '@modules/restaurants/repositories/fakes/FakeRestaurantsRepository';
import CreateRestaurantService from '@modules/restaurants/services/CreateRestaurantService';
import FakeItemsRepository from '../repositories/fakes/FakeItemsRepository';
import CreateItemService from './CreateItemService';
import ListItemsService from './ListItemsService';

let fakeItemsRepository: FakeItemsRepository;
let createItem: CreateItemService;
let createRestaurant: CreateRestaurantService;
let fakeCacheProvider: FakeCacheProvider;
let fakeRestaurantsRepository: FakeRestaurantsRepository;
let listItems: ListItemsService;

describe('CreateItem', () => {
  beforeEach(() => {
    fakeItemsRepository = new FakeItemsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    fakeRestaurantsRepository = new FakeRestaurantsRepository();

    createItem = new CreateItemService(
      fakeItemsRepository,
      fakeRestaurantsRepository,
      fakeCacheProvider,
    );

    createRestaurant = new CreateRestaurantService(
      fakeRestaurantsRepository,
      fakeCacheProvider,
    );

    listItems = new ListItemsService(fakeItemsRepository, fakeCacheProvider);
  });

  it('should be able to list Items by one attribute', async () => {
    const restaurant = await createRestaurant.execute({
      name: 'Restaurant',
      address: 'Address',
      cost: 20,
      type: 'Italian',
      user_id: 'user_id',
    });

    const item1 = await createItem.execute({
      name: 'Arroz',
      cost: 14.5,
      rating: 4,
      restaurant_id: restaurant.id,
      user_id: 'user_id',
    });

    const item2 = await createItem.execute({
      name: 'Macarrão',
      cost: 10.5,
      rating: 3,
      restaurant_id: restaurant.id,
      user_id: 'user_id',
    });

    const item3 = await createItem.execute({
      name: 'Feijão',
      cost: 10.5,
      rating: 4,
      restaurant_id: restaurant.id,
      user_id: 'user_id',
    });

    const list = await listItems.execute({ cost: 10.5 });

    expect(list).toEqual([item2, item3]);
  });

  it('should be able to list Items by two attributes', async () => {
    const restaurant = await createRestaurant.execute({
      name: 'Restaurant',
      address: 'Address',
      cost: 20,
      type: 'Italian',
      user_id: 'user_id',
    });

    const item1 = await createItem.execute({
      name: 'Arroz',
      cost: 14.5,
      rating: 4,
      restaurant_id: restaurant.id,
      user_id: 'user_id',
    });

    const item2 = await createItem.execute({
      name: 'Macarrão',
      cost: 10.5,
      rating: 3,
      restaurant_id: restaurant.id,
      user_id: 'user_id',
    });

    const item3 = await createItem.execute({
      name: 'Feijão',
      cost: 10.5,
      rating: 4,
      restaurant_id: restaurant.id,
      user_id: 'user_id',
    });

    const list = await listItems.execute({ cost: 10.5, rating: 3 });

    expect(list).toEqual([item2]);
  });
});