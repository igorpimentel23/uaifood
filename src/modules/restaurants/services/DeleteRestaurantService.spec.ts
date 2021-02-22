import AppError from '@shared/errors/AppError';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakePositionProvider from '@shared/container/providers/PositionProvider/fakes/FakePositionProvider';
import FakeRestaurantsRepository from '../repositories/fakes/FakeRestaurantsRepository';
import CreateRestaurantService from './CreateRestaurantService';
import DeleteRestaurantService from './DeleteRestaurantService';

let fakeRestaurantsRepository: FakeRestaurantsRepository;
let createRestaurant: CreateRestaurantService;
let fakeCacheProvider: FakeCacheProvider;
let fakePositionProvider: FakePositionProvider;
let deleteRestaurant: DeleteRestaurantService;

describe('DeleteRestaurant', () => {
  beforeEach(() => {
    fakeRestaurantsRepository = new FakeRestaurantsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    fakePositionProvider = new FakePositionProvider();

    createRestaurant = new CreateRestaurantService(
      fakeRestaurantsRepository,
      fakePositionProvider,
      fakeCacheProvider,
    );

    deleteRestaurant = new DeleteRestaurantService(
      fakeRestaurantsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to delete a Restaurant', async () => {
    const restaurant = await createRestaurant.execute({
      name: 'Restaurant',
      street: 'Street',
      street_number: 10,
      city: 'city',
      state: 'state',
      cost: 20,
      type: 'Italian',
    });

    await deleteRestaurant.execute({
      restaurant_id: restaurant.id,
    });
  });

  it('should not be able to delete a restaurant if the Restaurant does not exist', async () => {
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
      deleteRestaurant.execute({
        restaurant_id: 'other_restaurant_id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
