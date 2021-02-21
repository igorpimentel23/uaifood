import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeRestaurantsRepository from '@modules/restaurants/repositories/fakes/FakeRestaurantsRepository';
import CreateRestaurantService from '@modules/restaurants/services/CreateRestaurantService';
import FakePositionProvider from '@shared/container/providers/PositionProvider/fakes/FakePositionProvider';
import FakeItemsRepository from '../repositories/fakes/FakeItemsRepository';
import CreateItemService from './CreateItemService';
import ListItemsRestaurantsService from './ListItemsRestaurantsService';

let fakeItemsRepository: FakeItemsRepository;
let createItem: CreateItemService;
let createRestaurant: CreateRestaurantService;
let fakeCacheProvider: FakeCacheProvider;
let fakeRestaurantsRepository: FakeRestaurantsRepository;
let listItemsRestaurants: ListItemsRestaurantsService;
let fakePositionProvider: FakePositionProvider;

describe('ListItemsRestaurant', () => {
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

    listItemsRestaurants = new ListItemsRestaurantsService(
      fakeItemsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to list the restaurants with the items that attends the query attributes', async () => {
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
      type: 'Italian',
    });

    const restaurant3 = await createRestaurant.execute({
      name: 'Restaurant3',
      street: 'Street',
      street_number: 10,
      city: 'city',
      state: 'state',
      cost: 20,
      type: 'Italian',
    });

    const item1 = await createItem.execute({
      name: 'Arroz com feijão',
      cost: 14.5,
      rating: 4,
      restaurant_id: restaurant.id,
      avatar: 'avatar',
    });

    const item2 = await createItem.execute({
      name: 'Arroz com farofa',
      cost: 10.5,
      rating: 3,
      restaurant_id: restaurant.id,
      avatar: 'avatar',
    });

    const item3 = await createItem.execute({
      name: 'Arroz com strogonoff',
      cost: 10.5,
      rating: 4,
      restaurant_id: restaurant2.id,
      avatar: 'avatar',
    });

    const item4 = await createItem.execute({
      name: 'Macarrão',
      cost: 10.5,
      rating: 4,
      restaurant_id: restaurant2.id,
      avatar: 'avatar',
    });
    await listItemsRestaurants.execute({
      rating: 5,
      cost: 10,
      greater_than: 5,
      less_than: 5,
      restaurant_id: 'restaurant',
      radius: 10,
      lat: 10,
      lng: 10,
    });
    const list = await listItemsRestaurants.execute({ name: 'Arroz' });

    expect(list).toEqual([
      {
        restaurant: {
          id: restaurant.id,
          lat: String(restaurant.lat),
          lng: String(restaurant.lng),
        },
      },
      {
        restaurant: {
          id: restaurant.id,
          lat: String(restaurant.lat),
          lng: String(restaurant.lng),
        },
      },
      {
        restaurant: {
          id: restaurant2.id,
          lat: String(restaurant2.lat),
          lng: String(restaurant2.lng),
        },
      },
    ]);
  });
});
