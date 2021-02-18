import {
  getRepository,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';

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

  public async findSameRestaurant(
    name: string,
    type: string,
  ): Promise<Restaurant | undefined> {
    const findRestaurant = await this.ormRepository.findOne({
      where: [{ name, type }],
    });
    return findRestaurant;
  }

  public async update({
    restaurant_id,
    name,
    street,
    street_number,
    city,
    state,
    cost,
    type,
    user_id,
  }: IUpdateRestaurantDTO): Promise<Restaurant> {
    const restaurant = await this.ormRepository.save({
      id: restaurant_id,
      name,
      street,
      street_number,
      city,
      state,
      cost,
      type,
      user_id,
    });

    return restaurant;
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete({
      id,
    });
  }

  public async show(id: string): Promise<Restaurant | undefined> {
    const findRestaurant = await this.ormRepository.findOne({
      where: { id },
      relations: ['user', 'items'],
    });
    return findRestaurant;
  }

  public async create({
    name,
    street,
    street_number,
    city,
    state,
    cost,
    type,
    user_id,
    lat,
    lng,
  }: ICreateRestaurantDTO): Promise<Restaurant> {
    const restaurant = this.ormRepository.create({
      name,
      street,
      street_number,
      city,
      state,
      cost,
      type,
      user_id,
      lat,
      lng,
    });

    await this.ormRepository.save(restaurant);

    return restaurant;
  }

  public async index({
    name = null,
    street = null,
    street_number = null,
    city = null,
    state = null,
    cost = null,
    less_than = null,
    greater_than = null,
    rating = null,
    type = null,
    user_id = null,
  }: IListRestaurantDTO): Promise<Restaurant[]> {
    let query = {};

    if (name) {
      query = { ...query, name };
    }

    if (street) {
      query = { ...query, street };
    }

    if (street_number) {
      query = { ...query, street_number };
    }

    if (city) {
      query = { ...query, city };
    }

    if (state) {
      query = { ...query, state };
    }

    if (cost) {
      query = { ...query, cost };
    } else {
      if (greater_than) {
        query = { ...query, cost: MoreThanOrEqual(greater_than) };
      }
      if (less_than) {
        query = { ...query, cost: LessThanOrEqual(less_than) };
      }
    }

    if (rating) {
      query = { ...query, rating };
    }

    if (type) {
      query = { ...query, type };
    }

    if (user_id) {
      query = { ...query, user_id };
    }

    const restaurants = await this.ormRepository.find({
      where: [query],
      relations: ['items'],
    });

    return restaurants;
  }
}

export default RestaurantsRepository;
