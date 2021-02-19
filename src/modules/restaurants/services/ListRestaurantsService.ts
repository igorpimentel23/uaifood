import { injectable, inject } from 'tsyringe';

import IRestaurantsRepository from '@modules/restaurants/repositories/IRestaurantsRepository';
import Restaurant from '@modules/restaurants/infra/typeorm/entities/Restaurant';

interface IRequest {
  name?: string | null;
  street?: string | null;
  street_number?: number | null;
  city?: string | null;
  state?: string | null;
  cost?: number | null;
  greater_than?: number | null;
  less_than?: number | null;
  rating?: number | null;
  type?: string | null;
  user_id?: string | null;
  radius?: number | null;
  lat?: number | null;
  lng?: number | null;
}

@injectable()
class ShowRestaurantService {
  constructor(
    @inject('RestaurantsRepository')
    private restaurantsRepository: IRestaurantsRepository,
  ) {}

  public async execute({
    name = null,
    street = null,
    street_number = null,
    city = null,
    state = null,
    cost = null,
    greater_than = null,
    less_than = null,
    rating = null,
    type = null,
    user_id = null,
    radius = null,
    lat = null,
    lng = null,
  }: IRequest): Promise<Restaurant[]> {
    const findRestaurants = await this.restaurantsRepository.index({
      name,
      street,
      street_number,
      city,
      state,
      cost,
      greater_than,
      less_than,
      rating,
      type,
      user_id,
      radius,
      lat,
      lng,
    });

    return findRestaurants;
  }
}

export default ShowRestaurantService;
