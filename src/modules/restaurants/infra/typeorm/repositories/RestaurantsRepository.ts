import { getRepository, Repository, Raw, MoreThan, Not, Any } from 'typeorm';
import IRestaurantsRepository from '@modules/restaurants/repositories/IRestaurantsRepository';
import ICreateRestaurantDTO from '@modules/restaurants/dtos/ICreateRestaurantDTO';
import IUpdateRestaurantDTO from '@modules/restaurants/dtos/IUpdateRestaurantDTO';
import IListRestaurantDTO from '@modules/restaurants/dtos/IListRestaurantDTO';
import Restaurant from '@modules/restaurants/infra/typeorm/entities/Restaurant';

class RestaurantsRepository implements IRestaurantsRepository {
  private ormRepository: Repository<Restaurant>;

  constructor() {
    this.ormRepository = getRepository(Restaurant);
  }

  public async findById(id: string): Promise<Restaurant | undefined> {
    const findRestaurant = await this.ormRepository.findOne({
      where: { id },
    });
    return findRestaurant;
  }

  public async findSameRestaurant(name: string, type: string, restaurant_id?: string): Promise<Restaurant | undefined> {

    const id = restaurant_id ? restaurant_id : null;

    const findRestaurant = await this.ormRepository.findOne({
      where: [{ name, type, id: Not(id) }],
    });
    return findRestaurant;
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete({
      id,
    });
  }

  public async update({
    restaurant_id,
    name,
    address,
    cost,
    type,
    user_id,
  }: IUpdateRestaurantDTO): Promise<Restaurant> {
    const restaurant = await this.ormRepository.save({
      id: restaurant_id,
      name,
      address,
      cost,
      type,
      user_id,
    });

    return restaurant;
  }

  public async show(id: string): Promise<Restaurant | undefined> {
    const findRestaurant = await this.ormRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    return findRestaurant;
  }

  public async create({
    name,
    address,
    cost,
    type,
    user_id,
  }: ICreateRestaurantDTO): Promise<Restaurant> {
    const restaurant = this.ormRepository.create({
      name,
      address,
      cost,
      type,
      user_id,
    });

    await this.ormRepository.save(restaurant);

    return restaurant;
  }

  public async index({
    name = null,
    address = null,
    cost = -1,
    rating = -1,
    type = null,
    user_id = null,
  }: IListRestaurantDTO): Promise<Restaurant[]> {

    const restaurants = await this.ormRepository.find({
      where: [
        { name },
        { address },
        { cost },
        { rating },
        { type },
        { user_id }
      ]
    });

    return restaurants;
  }
}

export default RestaurantsRepository;
