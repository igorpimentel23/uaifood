import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IRestaurantsRepository from '@modules/restaurants/repositories/IRestaurantsRepository';
import Restaurant from '@modules/restaurants/infra/typeorm/entities/Restaurant';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { classToClass } from 'class-transformer';

interface IRequest {
  name?: string | null;
  street?: string | null;
  street_number?: number | null;
  city?: string | null;
  state?: string | null;
  cost?: number | null;
  rating?: number | null;
  type?: string | null;
  user_id?: string | null;
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
    name,
    street,
    street_number,
    city,
    state,
    cost,
    rating,
    type,
    user_id,
  }: IRequest): Promise<Restaurant[]> {
    const cacheKey = `restaurants:${name ? `name:${name}:` : ''}${
      street ? `street:${street}:` : ''
    }${street_number ? `street_number:${street_number}:` : ''}${
      city ? `city:${city}:` : ''
    }${state ? `state:${state}:` : ''}${cost ? `cost:${cost}:` : ''}${
      rating ? `rating:${rating}:` : ''
    }${type ? `type:${type}:` : ''}${user_id ? `user_id:${user_id}:` : ''}`;

    let findRestaurants = await this.cacheProvider.recover<
      Restaurant[] | undefined
    >(cacheKey);

    if (!findRestaurants) {
      findRestaurants = await this.restaurantsRepository.index({
        name,
        street,
        street_number,
        city,
        state,
        cost,
        rating,
        type,
        user_id,
      });

      if (!findRestaurants) {
        throw new AppError('This restaurant does not exist');
      }

      await this.cacheProvider.save(cacheKey, classToClass(findRestaurants));
    }

    return findRestaurants;
  }
}

export default ShowRestaurantService;
