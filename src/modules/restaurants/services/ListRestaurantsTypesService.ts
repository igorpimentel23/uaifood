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
  cost?: number | null;
  greater_than?: number | null;
  less_than?: number | null;
  rating?: number | null;
  type?: string | null;
  radius?: number | null;
  lat?: number | null;
  lng?: number | null;
  city_for_geo?: string | null;
}

@injectable()
class ShowRestaurantService {
  constructor(
    @inject('RestaurantsRepository')
    private restaurantsRepository: IRestaurantsRepository,

    @inject('PositionProvider')
    private positionProvider: IPositionProvider,
  ) {}

  public async execute(): Promise<Restaurant[] | undefined> {
    const categories = await this.restaurantsRepository.findCategories();

    return categories;
  }
}

export default ShowRestaurantService;
