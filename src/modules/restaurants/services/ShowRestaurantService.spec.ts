import AppError from '@shared/errors/AppError';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakePositionProvider from '@shared/container/providers/PositionProvider/fakes/FakePositionProvider';
import FakeRestaurantsRepository from '../repositories/fakes/FakeRestaurantsRepository';
import CreateRestaurantService from './CreateRestaurantService';
import ShowRestaurantService from './ShowRestaurantService';

let fakeRestaurantsRepository: FakeRestaurantsRepository;
let createRestaurant: CreateRestaurantService;
let fakeCacheProvider: FakeCacheProvider;
let fakePositionProvider: FakePositionProvider;
let showRestaurant: ShowRestaurantService;

describe('ShowRestaurant', () => {
  beforeEach(() => {
    fakeRestaurantsRepository = new FakeRestaurantsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    fakePositionProvider = new FakePositionProvider();

    createRestaurant = new CreateRestaurantService(
      fakeRestaurantsRepository,
      fakePositionProvider,
      fakeCacheProvider,
    );

    showRestaurant = new ShowRestaurantService(
      fakeRestaurantsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to show a Restaurant', async () => {
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

    await showRestaurant.execute({
      user_id: 'user_id',
      restaurant_id: restaurant.id,
    });

    await showRestaurant.execute({
      user_id: 'user_id',
      restaurant_id: restaurant.id,
    });
  });

  it('should not be able to show a restaurant if it does not exist', async () => {
    await createRestaurant.execute({
      name: 'Restaurant',
      street: 'Street',
      street_number: 10,
      city: 'city',
      state: 'state',
      cost: 20,
      type: 'Italian',
      user_id: 'user_id',
    });

    await expect(
      showRestaurant.execute({
        user_id: 'user_id',
        restaurant_id: 'restaurant.id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to show a restaurant if the user does not own it', async () => {
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

    await expect(
      showRestaurant.execute({
        user_id: 'other_user_id',
        restaurant_id: restaurant.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
