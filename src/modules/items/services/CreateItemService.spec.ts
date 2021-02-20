import AppError from '@shared/errors/AppError';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeRestaurantsRepository from '@modules/restaurants/repositories/fakes/FakeRestaurantsRepository';
import CreateRestaurantService from '@modules/restaurants/services/CreateRestaurantService';
import FakePositionProvider from '@shared/container/providers/PositionProvider/fakes/FakePositionProvider';
import FakeItemsRepository from '../repositories/fakes/FakeItemsRepository';
import CreateItemService from './CreateItemService';

let fakeItemsRepository: FakeItemsRepository;
let createItem: CreateItemService;
let createRestaurant: CreateRestaurantService;
let fakeCacheProvider: FakeCacheProvider;
let fakeRestaurantsRepository: FakeRestaurantsRepository;
let fakePositionProvider: FakePositionProvider;

describe('CreateItem', () => {
  beforeEach(() => {
    fakeItemsRepository = new FakeItemsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    fakeRestaurantsRepository = new FakeRestaurantsRepository();
    fakePositionProvider = new FakePositionProvider();

    createItem = new CreateItemService(
      fakeItemsRepository,
      fakeRestaurantsRepository,
      fakeCacheProvider,
    );

    createRestaurant = new CreateRestaurantService(
      fakeRestaurantsRepository,
      fakePositionProvider,
      fakeCacheProvider,
    );
  });

  it('should be able to create a new Item', async () => {
    const restaurant = await createRestaurant.execute({
      name: 'Restaurant',
      street: 'Street',
      street_number: 10,
      city: 'city',
      state: 'state',
      cost: 20,
      type: 'Italian',
    });

    const item = await createItem.execute({
      name: 'Arroz',
      cost: 10.5,
      restaurant_id: restaurant.id,
      avatar: 'avatar',
    });

    expect(item).toHaveProperty('id');
    expect(item.name).toBe('Arroz');
    expect(item.cost).toBe(10.5);
    expect(item.restaurant_id).toBe(restaurant.id);
  });

  it('should not be able to create a new Item if the restaurant does not exist', async () => {
    await expect(
      createItem.execute({
        name: 'Arroz',
        cost: 10.5,
        restaurant_id: 'restaurant_id',
        avatar: 'avatar',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new Item if the item already exists', async () => {
    const restaurant = await createRestaurant.execute({
      name: 'Restaurant',
      street: 'Street',
      street_number: 10,
      city: 'city',
      state: 'state',
      cost: 20,
      type: 'Italian',
    });

    await createItem.execute({
      name: 'Arroz',
      cost: 10.5,
      restaurant_id: restaurant.id,
      avatar: 'avatar',
    });

    await expect(
      createItem.execute({
        name: 'Arroz',
        cost: 10.5,
        restaurant_id: restaurant.id,
        avatar: 'avatar',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
