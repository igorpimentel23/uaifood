import Restaurant from '@modules/restaurants/infra/typeorm/entities/Restaurant';

import ICreateRestaurantDTO from '@modules/restaurants/dtos/ICreateRestaurantDTO';
import IUpdateRestaurantDTO from '@modules/restaurants/dtos/IUpdateRestaurantDTO';
import IListRestaurantDTO from '@modules/restaurants/dtos/IListRestaurantDTO';

export default interface IRestaurantsRepository {
  index(data: IListRestaurantDTO): Promise<Restaurant[]>;
  create(data: ICreateRestaurantDTO): Promise<Restaurant>;
  show(id: string): Promise<Restaurant | undefined>;
  delete(id: string): Promise<void>;
  update(data: IUpdateRestaurantDTO): Promise<Restaurant>;
  findSameRestaurant(
    name: string,
    type: string,
    restaurant_id?: string,
  ): Promise<Restaurant | undefined>;
  findById(id: string): Promise<Restaurant | undefined>;
  findCategories(): Promise<Restaurant[] | undefined>;
}
