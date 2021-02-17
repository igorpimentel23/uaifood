import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakePositionProvider from '@shared/container/providers/PositionProvider/fakes/FakePositionProvider';
import FakeRestaurantsRepository from '../repositories/fakes/FakeRestaurantsRepository';
import CreateRestaurantService from './CreateRestaurantService';
import ListUserRestaurantsService from './ListUserRestaurantsService';

let fakeRestaurantsRepository: FakeRestaurantsRepository;
let createRestaurant: CreateRestaurantService;
let fakeCacheProvider: FakeCacheProvider;
let fakePositionProvider: FakePositionProvider;
let listUserRestaurants: ListUserRestaurantsService;

describe('ListUserRestaurants', () => {
  beforeEach(() => {
    fakeRestaurantsRepository = new FakeRestaurantsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    fakePositionProvider = new FakePositionProvider();

    createRestaurant = new CreateRestaurantService(
      fakeRestaurantsRepository,
      fakePositionProvider,
      fakeCacheProvider,
    );

    listUserRestaurants = new ListUserRestaurantsService(
      fakeRestaurantsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to list all the restaurants of a user', async () => {
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

    const restaurant2 = await createRestaurant.execute({
      name: 'Restaurant2',
      street: 'Street',
      street_number: 10,
      city: 'city',
      state: 'state',
      cost: 20,
      type: 'Italian',
      user_id: 'user_id',
    });

    const restaurant3 = await createRestaurant.execute({
      name: 'Restaurant3',
      street: 'Street',
      street_number: 10,
      city: 'city',
      state: 'state',
      cost: 20,
      type: 'Italian',
      user_id: 'user_id2',
    });

    const list = await listUserRestaurants.execute('user_id');
    await listUserRestaurants.execute('user_id');

    expect(list).toEqual([restaurant, restaurant2]);
  });
});
