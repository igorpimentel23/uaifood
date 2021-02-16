import AppError from '@shared/errors/AppError';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeRestaurantsRepository from '@modules/restaurants/repositories/fakes/FakeRestaurantsRepository';
import CreateRestaurantService from '@modules/restaurants/services/CreateRestaurantService';
import FakeItemsRepository from '../repositories/fakes/FakeItemsRepository';
import CreateItemService from './CreateItemService';
import ShowItemService from './ShowItemService';

let fakeItemsRepository: FakeItemsRepository;
let createItem: CreateItemService;
let createRestaurant: CreateRestaurantService;
let fakeCacheProvider: FakeCacheProvider;
let fakeRestaurantsRepository: FakeRestaurantsRepository;
let showItem: ShowItemService;

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

    showItem = new ShowItemService(fakeItemsRepository, fakeCacheProvider);
  });

  it('should be able to show one especific Item', async () => {
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

    const item = await showItem.execute(item1.id);

    expect(item).toEqual(item1);
  });

  it('should not be able to show an unexisting Item', async () => {
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

    await expect(showItem.execute('no_id')).rejects.toBeInstanceOf(AppError);
  });
});
