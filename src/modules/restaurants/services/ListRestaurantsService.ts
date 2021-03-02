import { injectable, inject } from 'tsyringe';

import IRestaurantsRepository from '@modules/restaurants/repositories/IRestaurantsRepository';
import IPositionProvider from '@shared/container/providers/PositionProvider/models/IPositionProvider';
import Restaurant from '@modules/restaurants/infra/typeorm/entities/Restaurant';

interface IRequest {
  name?: string | null;
  street?: string | null;
  street_number?: number | null;
  city?: string | null;
  state?: string | null;
  cost?: number[] | null;
  rating?: number[] | null;
  type?: string[] | null;
  radius?: number | null;
  lat?: number | null;
  lng?: number | null;
  city_for_geo?: string | null;
}

@injectable()
class ListRestaurantsService {
  constructor(
    @inject('RestaurantsRepository')
    private restaurantsRepository: IRestaurantsRepository,

    @inject('PositionProvider')
    private positionProvider: IPositionProvider,
  ) {}

  public async execute({
    name = null,
    street = null,
    street_number = null,
    city = null,
    state = null,
    cost = null,
    rating = null,
    type = null,
    radius = null,
    lat = null,
    lng = null,
    city_for_geo = null,
  }: IRequest): Promise<Restaurant[]> {
    let latitude = lat;
    let longitude = lng;

    if (city_for_geo) {
      const coord = await this.positionProvider.getCoord({
        city: city_for_geo,
      });
      if (coord) {
        [latitude, longitude] = coord;
      }
    }

    const findRestaurants = await this.restaurantsRepository.index({
      name,
      street,
      street_number,
      city,
      state,
      cost,
      rating,
      type,
      radius,
      lat: latitude,
      lng: longitude,
    });

    return findRestaurants;
  }
}

export default ListRestaurantsService;
