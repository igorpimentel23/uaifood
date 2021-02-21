import { injectable, inject } from 'tsyringe';

import IRestaurantsRepository from '@modules/restaurants/repositories/IRestaurantsRepository';
import Restaurant from '@modules/restaurants/infra/typeorm/entities/Restaurant';

@injectable()
class ListRestaurantsTypesService {
  constructor(
    @inject('RestaurantsRepository')
    private restaurantsRepository: IRestaurantsRepository,
  ) {}

  public async execute(): Promise<Restaurant[] | undefined> {
    const categories = await this.restaurantsRepository.findCategories();

    return categories;
  }
}

export default ListRestaurantsTypesService;
