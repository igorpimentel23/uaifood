import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakePositionProvider from '@shared/container/providers/PositionProvider/fakes/FakePositionProvider';
import FakeRestaurantsRepository from '../repositories/fakes/FakeRestaurantsRepository';
import CreateRestaurantService from './CreateRestaurantService';
import ListRestaurantsService from './ListRestaurantsService';

let fakeRestaurantsRepository: FakeRestaurantsRepository;
let createRestaurant: CreateRestaurantService;
let fakeCacheProvider: FakeCacheProvider;
let fakePositionProvider: FakePositionProvider;
let listRestaurants: ListRestaurantsService;

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

    listRestaurants = new ListRestaurantsService(fakeRestaurantsRepository);
  });

  it('should be able to list all the restaurants with all the attributes searched in common', async () => {
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
      type: 'Japanese',
      user_id: 'user_id2',
    });

    const list = await listRestaurants.execute({ type: 'Italian', cost: 20 });

    expect(list).toEqual([restaurant, restaurant2]);
  });

  it('should be able to list all the restaurants within a given radius', async () => {
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
      state: 'far',
      cost: 20,
      type: 'Japanese',
      user_id: 'user_id2',
    });

    const list = await listRestaurants.execute({
      radius: 2,
      lat: -25.101944,
      lng: -50.159222,
    });

    expect(list).toEqual([restaurant, restaurant2]);
  });
});
