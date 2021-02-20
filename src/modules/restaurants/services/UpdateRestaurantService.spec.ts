import AppError from '@shared/errors/AppError';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakePositionProvider from '@shared/container/providers/PositionProvider/fakes/FakePositionProvider';
import FakeRestaurantsRepository from '../repositories/fakes/FakeRestaurantsRepository';
import CreateRestaurantService from './CreateRestaurantService';
import UpdateRestaurantService from './UpdateRestaurantService';

let fakeRestaurantsRepository: FakeRestaurantsRepository;
let createRestaurant: CreateRestaurantService;
let fakeCacheProvider: FakeCacheProvider;
let fakePositionProvider: FakePositionProvider;
let updateRestaurant: UpdateRestaurantService;

describe('UpdateRestaurant', () => {
  beforeEach(() => {
    fakeRestaurantsRepository = new FakeRestaurantsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    fakePositionProvider = new FakePositionProvider();

    createRestaurant = new CreateRestaurantService(
      fakeRestaurantsRepository,
      fakePositionProvider,
      fakeCacheProvider,
    );

    updateRestaurant = new UpdateRestaurantService(
      fakeRestaurantsRepository,
      fakePositionProvider,
      fakeCacheProvider,
    );
  });

  it('should be able to update a Restaurant', async () => {
    const restaurant = await createRestaurant.execute({
      name: 'Restaurant old',
      street: 'Street old',
      street_number: 11,
      city: 'city old',
      state: 'state old',
      cost: 25,
      type: 'Italian old',
    });

    const updatedRestaurant = await updateRestaurant.execute({
      restaurant_id: restaurant.id,
      name: 'Restaurant',
      street: 'Street',
      street_number: 10,
      city: 'city',
      state: 'state',
      cost: 20,
      rating: 5,
      type: 'Italian',
    });

    expect(updatedRestaurant.id).toBe(restaurant.id);
    expect(updatedRestaurant.street).toBe('Street');
    expect(updatedRestaurant.street_number).toBe(10);
    expect(updatedRestaurant.city).toBe('city');
    expect(updatedRestaurant.state).toBe('state');
    expect(updatedRestaurant.cost).toBe(20);
    expect(updatedRestaurant.rating).toBe(5);
    expect(updatedRestaurant.type).toBe('Italian');
  });

  it('should not be able to update a restaurant if there is another one with the same name and type', async () => {
    const restaurant = await createRestaurant.execute({
      name: 'Restaurant',
      street: 'Street',
      street_number: 10,
      city: 'city',
      state: 'state',
      cost: 20,
      type: 'Italian',
    });

    await expect(
      updateRestaurant.execute({
        restaurant_id: restaurant.id,
        name: 'Restaurant',
        street: 'Street1',
        street_number: 10,
        city: 'city',
        state: 'state',
        rating: 5,
        cost: 20,
        type: 'Italian',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update a restaurant if the Restaurant does not exist', async () => {
    await createRestaurant.execute({
      name: 'Restaurant old',
      street: 'Street old',
      street_number: 11,
      city: 'city old',
      state: 'state old',
      cost: 25,
      type: 'Italian old',
    });

    await expect(
      updateRestaurant.execute({
        restaurant_id: 'other_restaurant.id',
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

  it('should not be able to update a restaurant if the address does not exist', async () => {
    const restaurant = await createRestaurant.execute({
      name: 'Restaurant old',
      street: 'Street old',
      street_number: 11,
      city: 'city old',
      state: 'state old',
      cost: 25,
      type: 'Italian old',
    });

    await updateRestaurant.execute({
      restaurant_id: restaurant.id,
      name: 'Restaurant old1',
      street: 'Street old',
      street_number: 11,
      city: 'city old',
      state: 'state old',
      cost: 25,
      type: 'Italian old',
    });

    await updateRestaurant.execute({
      restaurant_id: restaurant.id,
      name: 'Restaurant old2',
      street: 'Street old',
      street_number: 11,
      city: 'city old',
      state: 'state old2',
      cost: 25,
      type: 'Italian old',
    });

    await updateRestaurant.execute({
      restaurant_id: restaurant.id,
      name: 'Restaurant old3',
      street: 'Street old',
      street_number: 11,
      city: 'city old',
      state: 'state old2',
      cost: 25,
      type: 'Italian old',
    });

    await updateRestaurant.execute({
      restaurant_id: restaurant.id,
      name: 'Restaurant old4',
      street: 'Street old',
      street_number: 11,
      city: 'city old',
      state: 'state old2',
      cost: 25,
      type: 'Italian old',
    });

    await expect(
      updateRestaurant.execute({
        restaurant_id: restaurant.id,
        name: 'Restaurant old7',
        street: '',
        street_number: 0,
        city: '',
        state: '',
        cost: 25,
        type: 'Italian old',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
