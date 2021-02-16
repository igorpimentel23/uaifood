/* import AppError from '@shared/errors/AppError';

import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeRestaurantsRepository from '../repositories/fakes/FakeRestaurantsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import CreateRestaurantService from './CreateRestaurantService';

let fakeRestaurantsRepository: FakeRestaurantsRepository;
let createRestaurant: CreateRestaurantService;
let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeCacheProvider: FakeCacheProvider;

describe('CreateRestaurant', () => {
  beforeEach(() => {
    fakeRestaurantsRepository = new FakeRestaurantsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeCacheProvider = new FakeCacheProvider();

    createRestaurant = new CreateRestaurantService(
      fakeRestaurantsRepository,
      fakeNotificationsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to create a new Restaurant', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const restaurant = await createRestaurant.execute({
      date: new Date(2020, 4, 10, 13),
      user_id: '789',
      provider_id: '123',
    });

    expect(restaurant).toHaveProperty('id');
    expect(restaurant.provider_id).toBe('123');
  });

  it('should not be able to create two restaurants on the same time', async () => {
    const restaurantDate = new Date(2020, 4, 10, 11);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 9, 12).getTime();
    });

    await createRestaurant.execute({
      date: restaurantDate,
      user_id: '789',
      provider_id: '123',
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 9, 12).getTime();
    });

    await expect(
      createRestaurant.execute({
        date: restaurantDate,
        user_id: '789',
        provider_id: '123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an restaurant on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createRestaurant.execute({
        date: new Date(2020, 4, 10, 10),
        user_id: '789',
        provider_id: '123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an restaurant with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createRestaurant.execute({
        date: new Date(2020, 4, 10, 13),
        user_id: '123',
        provider_id: '123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an restaurant after 8:00 and before 18:00', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createRestaurant.execute({
        date: new Date(2020, 4, 11, 7),
        user_id: '123',
        provider_id: '789',
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createRestaurant.execute({
        date: new Date(2020, 4, 11, 18),
        user_id: '123',
        provider_id: '789',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
 */
