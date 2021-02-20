import {
  getRepository,
  LessThanOrEqual,
  Like,
  MoreThanOrEqual,
  Not,
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
    restaurant_id?: string,
  ): Promise<Restaurant | undefined> {
    let query = {};

    if (restaurant_id) {
      query = { id: Not(restaurant_id) };
    }

    const findRestaurant = await this.ormRepository.findOne({
      where: [{ ...query, name, type }],
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
      relations: ['items'],
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
    lat,
    lng,
  }: ICreateRestaurantDTO): Promise<Restaurant> {
    const geolocation = `POINT(${lng} ${lat})`;

    const restaurant = this.ormRepository.create({
      name,
      street,
      street_number,
      city,
      state,
      cost,
      type,
      lat,
      lng,
      geolocation,
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
    radius = 0,
    lat = null,
    lng = null,
  }: IListRestaurantDTO): Promise<Restaurant[]> {
    let query = {};

    const queryBuilder = this.ormRepository.createQueryBuilder('restaurants');

    if (name) {
      query = { ...query, name: Like(`%${name}%`) };
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

    if (radius && lat && lng) {
      queryBuilder.where(
        'ST_Distance(restaurants.geolocation, ST_MakePoint(:lng, :lat)) < :radius',
        { lng, lat, radius: radius * 1000 },
      );
    }

    if (Object.keys(query).length) {
      queryBuilder.where(query);
    }

    const restaurants = await queryBuilder.getMany();

    return restaurants;
  }
}

export default RestaurantsRepository;
