import { injectable, inject } from 'tsyringe';
import { getDistance } from 'geolib';

import IRestaurantsRepository from '@modules/restaurants/repositories/IRestaurantsRepository';
import Restaurant from '@modules/restaurants/infra/typeorm/entities/Restaurant';

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
    name,
    street,
    street_number,
    city,
    state,
    cost,
    rating,
    type,
    user_id,
    radius,
    lat,
    lng,
  }: IRequest): Promise<Restaurant[]> {
    let findRestaurants = await this.restaurantsRepository.index({
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

    if (radius && lat && lng) {
      findRestaurants = findRestaurants.filter(restaurant => {
        const dist = getDistance(
          { latitude: restaurant.lat, longitude: restaurant.lng },
          { latitude: lat, longitude: lng },
        );
        return dist / 1000 <= radius;
      });
    }

    return findRestaurants;
  }
}

export default ShowRestaurantService;
