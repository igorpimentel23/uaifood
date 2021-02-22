import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakePositionProvider from '@shared/container/providers/PositionProvider/fakes/FakePositionProvider';
import FakeRestaurantsRepository from '../repositories/fakes/FakeRestaurantsRepository';
import CreateRestaurantService from './CreateRestaurantService';
import ListRestaurantsTypesService from './ListRestaurantsTypesService';

let fakeRestaurantsRepository: FakeRestaurantsRepository;
let createRestaurant: CreateRestaurantService;
let fakeCacheProvider: FakeCacheProvider;
let fakePositionProvider: FakePositionProvider;
let listRestaurantsTypes: ListRestaurantsTypesService;

describe('ListRestaurantsTypes', () => {
  beforeEach(() => {
    fakeRestaurantsRepository = new FakeRestaurantsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    fakePositionProvider = new FakePositionProvider();

    createRestaurant = new CreateRestaurantService(
      fakeRestaurantsRepository,
      fakePositionProvider,
      fakeCacheProvider,
    );

    listRestaurantsTypes = new ListRestaurantsTypesService(
      fakeRestaurantsRepository,
    );
  });

  it('should be able to list all the restaurants types', async () => {
    const restaurant = await createRestaurant.execute({
      name: 'Restaurant',
      street: 'Street',
      street_number: 10,
      city: 'city',
      state: 'state',
      cost: 20,
      type: 'Italian',
    });

    const restaurant2 = await createRestaurant.execute({
      name: 'Restaurant2',
      street: 'Street',
      street_number: 10,
      city: 'city',
      state: 'state',
      cost: 20,
      type: 'Japanese',
    });

    const restaurant3 = await createRestaurant.execute({
      name: 'Restaurant3',
      street: 'Street',
      street_number: 10,
      city: 'city',
      state: 'state',
      cost: 20,
      type: 'Brazilian',
    });

    const list = await listRestaurantsTypes.execute();

    expect(list).toEqual([
      { type: restaurant.type },
      { type: restaurant2.type },
      { type: restaurant3.type },
    ]);
  });
});
