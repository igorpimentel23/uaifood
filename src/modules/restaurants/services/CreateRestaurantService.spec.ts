import AppError from '@shared/errors/AppError';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakePositionProvider from '@shared/container/providers/PositionProvider/fakes/FakePositionProvider';
import FakeRestaurantsRepository from '../repositories/fakes/FakeRestaurantsRepository';
import CreateRestaurantService from './CreateRestaurantService';

let fakeRestaurantsRepository: FakeRestaurantsRepository;
let createRestaurant: CreateRestaurantService;
let fakeCacheProvider: FakeCacheProvider;
let fakePositionProvider: FakePositionProvider;

describe('CreateRestaurant', () => {
  beforeEach(() => {
    fakeRestaurantsRepository = new FakeRestaurantsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    fakePositionProvider = new FakePositionProvider();

    createRestaurant = new CreateRestaurantService(
      fakeRestaurantsRepository,
      fakePositionProvider,
      fakeCacheProvider,
    );
  });

  it('should be able to create a new Restaurant', async () => {
    const restaurant = await createRestaurant.execute({
      name: 'Restaurant',
      street: 'Street',
      street_number: 10,
      city: 'city',
      state: 'state',
      cost: 20,
      type: 'Italian',
    });

    expect(restaurant).toHaveProperty('id');
    expect(restaurant.street).toBe('Street');
    expect(restaurant.street_number).toBe(10);
    expect(restaurant.city).toBe('city');
    expect(restaurant.state).toBe('state');
    expect(restaurant.cost).toBe(20);
    expect(restaurant.type).toBe('Italian');
  });

  it('should not be able to create a restaurant if there is another one with the same name and type', async () => {
    await createRestaurant.execute({
      name: 'Restaurant',
      street: 'Street',
      street_number: 10,
      city: 'city',
      state: 'state',
      cost: 20,
      type: 'Italian',
    });

    await expect(
      createRestaurant.execute({
        name: 'Restaurant',
        street: 'Street',
        street_number: 10,
        city: 'city',
        state: 'state',
        cost: 20,
        type: 'Italian',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a restaurant if the address is incorrect', async () => {
    await expect(
      createRestaurant.execute({
        name: 'Restaurant',
        street: '',
        street_number: 0,
        city: '',
        state: '',
        cost: 20,
        type: 'Italian',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
