import { injectable, inject } from 'tsyringe';

import Restaurant from '@modules/restaurants/infra/typeorm/entities/Restaurant';
import IRestaurantsRepository from '@modules/restaurants/repositories/IRestaurantsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { classToClass } from 'class-transformer';

@injectable()
class ListUserRestaurantsService {
  constructor(
    @inject('RestaurantsRepository')
    private restaurantsRepository: IRestaurantsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}
  public async execute(user_id: string): Promise<Restaurant[]> {
    const cacheKey = `user-restaurants:${user_id}`;

    let restaurants = await this.cacheProvider.recover<Restaurant[]>(
      cacheKey,
    );

    if (!restaurants) {
      restaurants = await this.restaurantsRepository.index({ user_id });

      await this.cacheProvider.save(cacheKey, classToClass(restaurants));
    }

    return restaurants;
  }
}

export default ListUserRestaurantsService;
