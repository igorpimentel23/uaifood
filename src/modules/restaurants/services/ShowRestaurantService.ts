import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IRestaurantsRepository from '@modules/restaurants/repositories/IRestaurantsRepository';
import Restaurant from '@modules/restaurants/infra/typeorm/entities/Restaurant';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { classToClass } from 'class-transformer';

interface IRequest {
  user_id: string;
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

  public async execute({
    user_id,
    restaurant_id,
  }: IRequest): Promise<Restaurant> {
    const cacheKey = `single-restaurant:${restaurant_id}`;

    let findRestaurant = await this.cacheProvider.recover<
      Restaurant | undefined
    >(cacheKey);

    if (!findRestaurant) {
      findRestaurant = await this.restaurantsRepository.show(restaurant_id);

      if (!findRestaurant) {
        throw new AppError('This restaurant does not exist');
      }

      if ( user_id !== findRestaurant.user_id ) {
        throw new AppError('You can not see this restaurant');
      }

      await this.cacheProvider.save(cacheKey, classToClass(findRestaurant));
    }

    return findRestaurant;
  }
}

export default ShowRestaurantService;
