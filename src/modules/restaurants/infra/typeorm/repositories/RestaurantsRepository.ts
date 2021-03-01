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
import IListItemDTO from '@modules/items/dtos/IListItemDTO';
import Restaurant from '@modules/restaurants/infra/typeorm/entities/Restaurant';
import RestaurantCostQueryHelper from 'helpers';

class RestaurantsRepository implements IRestaurantsRepository {
  private ormRepository: Repository<Restaurant>;

  constructor() {
    this.ormRepository = getRepository(Restaurant);
  }

  public async findRestaurants({
    name = null,
    rating = null,
    cost = null,
    radius = null,
    lat = null,
    lng = null,
  }: IListItemDTO): Promise<Restaurant[] | undefined> {
    let query = '';

    if (name) {
      query += `items.name LIKE '%${name}%' `;
    }

    if (rating) {
      if (query) {
        query += 'AND ';
      }

      query += `items.rating = ${rating} `;
    }

    if (cost) {
      if (query) {
        query += 'AND ';
      }

      query += `items.cost = ${cost} `;
    }

    if (radius && lat && lng) {
      if (query) {
        query += 'AND ';
      }

      query += `ST_Distance(items.geolocation, ST_MakePoint(${lng}, ${lat})) < ${
        radius * 1000
      }`;
    }

    if (query) {
      query += 'AND ';
    }

    const queryBuilder = await this.ormRepository.query(
      `SELECT items.id as item_id, items.name as item_name, items.rating as item_rating, items.cost as item_cost, items.avatar as item_avatar, restaurants.id as restaurant_id, restaurants.name as restaurant_name, street, street_number, city, state, restaurants.cost as restaurant_cost, restaurants.rating as restaurant_rating, type, lat, lng, restaurants.geolocation FROM items INNER JOIN restaurants ON (${query}items.restaurant_id = restaurants.id)`,
    );

    return queryBuilder;
  }

  public async findCategories(): Promise<Restaurant[] | undefined> {
    const queryBuilder = await this.ormRepository
      .createQueryBuilder('restaurants')
      .select('type')
      .distinct(true)
      .execute();

    return queryBuilder;
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
    rating,
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
      rating,
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
      queryBuilder.andWhere(`(${RestaurantCostQueryHelper(cost)})`);
    }

    if (type) {
      queryBuilder.andWhere('restaurants.type in (:...type)', {
        type,
      });
    }

    if (rating) {
      queryBuilder.andWhere('restaurants.rating in (:...rating)', {
        rating,
      });
    }

    if (radius && lat && lng) {
      queryBuilder.andWhere(
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
