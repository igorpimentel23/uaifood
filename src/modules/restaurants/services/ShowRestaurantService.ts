import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IRestaurantsRepository from '@modules/restaurants/repositories/IRestaurantsRepository';
import Restaurant from '@modules/restaurants/infra/typeorm/entities/Restaurant';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface IRequest {
  restaurant_id: string;
}

@injectable()
class ShowRestaurantService {
  constructor(
    @inject('RestaurantsRepository')
    private restaurantsRepository: IRestaurantsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ restaurant_id }: IRequest): Promise<Restaurant> {
    const cacheKey = `single-restaurant:${restaurant_id}`;

    let findRestaurant = await this.cacheProvider.recover<
      Restaurant | undefined
    >(cacheKey);

    if (!findRestaurant) {
      findRestaurant = await this.restaurantsRepository.show(restaurant_id);

      if (!findRestaurant) {
        throw new AppError('This restaurant does not exist');
      }

      await this.cacheProvider.save(cacheKey, findRestaurant);
    }

    return findRestaurant;
  }
}

export default ShowRestaurantService;
