import AppError from '@shared/errors/AppError';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeRestaurantsRepository from '@modules/restaurants/repositories/fakes/FakeRestaurantsRepository';
import CreateRestaurantService from '@modules/restaurants/services/CreateRestaurantService';
import FakePositionProvider from '@shared/container/providers/PositionProvider/fakes/FakePositionProvider';
import FakeItemsRepository from '../repositories/fakes/FakeItemsRepository';
import CreateItemService from './CreateItemService';
import UpdateItemService from './UpdateItemService';

let fakeItemsRepository: FakeItemsRepository;
let createItem: CreateItemService;
let createRestaurant: CreateRestaurantService;
let updateItem: UpdateItemService;
let fakeCacheProvider: FakeCacheProvider;
let fakeRestaurantsRepository: FakeRestaurantsRepository;
let fakePositionProvider: FakePositionProvider;

describe('UpdateItem', () => {
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

    updateItem = new UpdateItemService(fakeItemsRepository, fakeCacheProvider);
  });

  it('should be able to update an Item', async () => {
    const restaurant = await createRestaurant.execute({
      name: 'Restaurant',
      street: 'Street',
      street_number: 10,
      city: 'city',
      state: 'state',
      cost: 20,
      type: 'Italian',
      user_id: 'user_id',
    });

    const item = await createItem.execute({
      name: 'Arroz',
      cost: 10.5,
      restaurant_id: restaurant.id,
      user_id: 'user_id',
    });

    const itemUpdated = await updateItem.execute({
      item_id: item.id,
      name: 'Feijão',
      cost: 20.0,
      rating: 5,
      restaurant_id: item.restaurant_id,
      user_id: item.restaurant.user.id,
    });

    expect(itemUpdated.id).toBe(item.id);
    expect(itemUpdated.name).toBe('Feijão');
    expect(itemUpdated.cost).toBe(20);
    expect(itemUpdated.rating).toBe(5);
  });

  it('should not be able to update the Item if the user do not own the Item', async () => {
    const restaurant = await createRestaurant.execute({
      name: 'Restaurant',
      street: 'Street',
      street_number: 10,
      city: 'city',
      state: 'state',
      cost: 20,
      type: 'Italian',
      user_id: 'user_id',
    });

    const item = await createItem.execute({
      name: 'Arroz',
      cost: 10.5,
      restaurant_id: restaurant.id,
      user_id: 'user_id',
    });

    await expect(
      updateItem.execute({
        item_id: item.id,
        name: 'Feijão',
        cost: 20.0,
        restaurant_id: item.restaurant_id,
        user_id: 'other_user_id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the Item it does not exist', async () => {
    const restaurant = await createRestaurant.execute({
      name: 'Restaurant',
      street: 'Street',
      street_number: 10,
      city: 'city',
      state: 'state',
      cost: 20,
      type: 'Italian',
      user_id: 'user_id',
    });

    const item = await createItem.execute({
      name: 'Arroz',
      cost: 10.5,
      restaurant_id: restaurant.id,
      user_id: 'user_id',
    });

    await expect(
      updateItem.execute({
        item_id: 'other_item_id',
        name: 'Feijão',
        cost: 20.0,
        rating: 5,
        restaurant_id: item.restaurant_id,
        user_id: item.restaurant.user.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the Item if there is an Item with the same attributes', async () => {
    const restaurant = await createRestaurant.execute({
      name: 'Restaurant',
      street: 'Street',
      street_number: 10,
      city: 'city',
      state: 'state',
      cost: 20,
      type: 'Italian',
      user_id: 'user_id',
    });

    await createItem.execute({
      name: 'Feijão',
      cost: 10.5,
      restaurant_id: restaurant.id,
      user_id: 'user_id',
    });

    const item = await createItem.execute({
      name: 'Arroz',
      cost: 10.5,
      restaurant_id: restaurant.id,
      user_id: 'user_id',
    });

    await expect(
      updateItem.execute({
        item_id: item.id,
        name: 'Feijão',
        cost: 20.0,
        rating: 5,
        restaurant_id: item.restaurant_id,
        user_id: item.restaurant.user.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
