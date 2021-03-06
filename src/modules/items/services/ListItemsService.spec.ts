import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeRestaurantsRepository from '@modules/restaurants/repositories/fakes/FakeRestaurantsRepository';
import CreateRestaurantService from '@modules/restaurants/services/CreateRestaurantService';
import FakePositionProvider from '@shared/container/providers/PositionProvider/fakes/FakePositionProvider';
import FakeItemsRepository from '../repositories/fakes/FakeItemsRepository';
import CreateItemService from './CreateItemService';
import ListItemsService from './ListItemsService';

let fakeItemsRepository: FakeItemsRepository;
let createItem: CreateItemService;
let createRestaurant: CreateRestaurantService;
let fakeCacheProvider: FakeCacheProvider;
let fakeRestaurantsRepository: FakeRestaurantsRepository;
let listItems: ListItemsService;
let fakePositionProvider: FakePositionProvider;

describe('ListItems', () => {
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

    listItems = new ListItemsService(fakeItemsRepository, fakeCacheProvider);
  });

  it('should be able to list Items by one attribute', async () => {
    const restaurant = await createRestaurant.execute({
      name: 'Restaurant',
      street: 'Street',
      street_number: 10,
      city: 'city',
      state: 'state',
      cost: 20,
      type: 'Italian',
    });

    const item1 = await createItem.execute({
      name: 'Arroz',
      cost: 14.5,
      rating: 4,
      restaurant_id: restaurant.id,
      avatar: 'avatar',
    });

    const item2 = await createItem.execute({
      name: 'Macarrão',
      cost: 10.5,
      rating: 3,
      restaurant_id: restaurant.id,
      avatar: 'avatar',
    });

    const item3 = await createItem.execute({
      name: 'Feijão',
      cost: 10.5,
      rating: 4,
      restaurant_id: restaurant.id,
      avatar: 'avatar',
    });

    await listItems.execute({ name: 'Macarrão' });
    await listItems.execute({ name: 'Macarrão' });
    await listItems.execute({ name: 'Macarrão', restaurant_id: restaurant.id });
    await listItems.execute({ rating: 3 });

    const list = await listItems.execute({ cost: 10.5 });

    expect(list).toEqual([item2, item3]);
  });

  it('should be able to list Items by two attributes', async () => {
    const restaurant = await createRestaurant.execute({
      name: 'Restaurant',
      street: 'Street',
      street_number: 10,
      city: 'city',
      state: 'state',
      cost: 20,
      type: 'Italian',
    });

    const item1 = await createItem.execute({
      name: 'Arroz',
      cost: 14.5,
      rating: 4,
      restaurant_id: restaurant.id,
      avatar: 'avatar',
    });

    const item2 = await createItem.execute({
      name: 'Macarrão',
      cost: 10.5,
      rating: 3,
      restaurant_id: restaurant.id,
      avatar: 'avatar',
    });

    const item3 = await createItem.execute({
      name: 'Feijão',
      cost: 10.5,
      rating: 4,
      restaurant_id: restaurant.id,
      avatar: 'avatar',
    });

    await listItems.execute({ less_than: 12, rating: 3 });
    const list = await listItems.execute({ greater_than: 10, rating: 3 });

    expect(list).toEqual([item2]);
  });

  it('should be able to list Items within a given radius', async () => {
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
      name: 'Restaurant3',
      street: 'Street',
      street_number: 10,
      city: 'city',
      state: 'far',
      cost: 20,
      type: 'Japanese',
    });

    const item1 = await createItem.execute({
      name: 'Arroz',
      cost: 14.5,
      rating: 4,
      restaurant_id: restaurant.id,
      avatar: 'avatar',
    });

    const item2 = await createItem.execute({
      name: 'Macarrão',
      cost: 10.5,
      rating: 3,
      restaurant_id: restaurant.id,
      avatar: 'avatar',
    });

    const item3 = await createItem.execute({
      name: 'Feijão',
      cost: 10.5,
      rating: 4,
      restaurant_id: restaurant2.id,
      avatar: 'avatar',
    });

    const list = await listItems.execute({
      radius: 2,
      lat: -25.101944,
      lng: -50.159222,
    });

    expect(list).toEqual([item1, item2]);
  });
});
