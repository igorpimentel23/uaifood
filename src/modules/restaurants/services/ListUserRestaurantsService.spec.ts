/* import AppError from '@shared/errors/AppError';

import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeRestaurantsRepository from '../repositories/fakes/FakeRestaurantsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import DeleteRestaurantService from './DeleteRestaurantService';

let fakeRestaurantsRepository: FakeRestaurantsRepository;
let deleteRestaurant: DeleteRestaurantService;
let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeCacheProvider: FakeCacheProvider;

describe('DeleteRestaurant', () => {
  beforeEach(() => {
    fakeRestaurantsRepository = new FakeRestaurantsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeCacheProvider = new FakeCacheProvider();

    deleteRestaurant = new DeleteRestaurantService(
      fakeRestaurantsRepository,
      fakeNotificationsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to delete a Restaurant', async () => {
    const restaurant = await fakeRestaurantsRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(),
    });

    await deleteRestaurant.execute({
      user_id: 'user',
      restaurant_id: restaurant.id,
    });
  });

  it('Should not be able to delete an unexisting restaurant', async () => {
    await fakeRestaurantsRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(),
    });

    await expect(
      await deleteRestaurant.execute({
        user_id: 'user',
        restaurant_id: 'restaurant.id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to delete an restaurant if it is not the owner or the provider of the restaurant', async () => {
    await fakeRestaurantsRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(),
    });

    await expect(
      await deleteRestaurant.execute({
        user_id: 'user2',
        restaurant_id: 'restaurant.id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
 */
