import { uuid } from 'uuidv4';

import IRestaurantsRepository from '@modules/restaurants/repositories/IRestaurantsRepository';
import ICreateRestaurantDTO from '@modules/restaurants/dtos/ICreateRestaurantDTO';
import IUpdateRestaurantDTO from '@modules/restaurants/dtos/IUpdateRestaurantDTO';
import IListRestaurantDTO from '@modules/restaurants/dtos/IListRestaurantDTO';
import Restaurant from '@modules/restaurants/infra/typeorm/entities/Restaurant';

class RestaurantsRepository implements IRestaurantsRepository {
  private restaurants: Restaurant[] = [];

  public async findById(id: string): Promise<Restaurant | undefined> {
    const findRestaurant = this.restaurants.find(
      restaurant => restaurant.id === id,
    );

    return findRestaurant;
  }

  public async findSameRestaurant(
    name: string,
    type: string,
  ): Promise<Restaurant | undefined> {
    const findRestaurant = this.restaurants.find(
      restaurant => restaurant.name === name && restaurant.type === type,
    );

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
    rating,
    type,
    lat,
    lng,
  }: IUpdateRestaurantDTO): Promise<Restaurant> {
    const restaurant = new Restaurant();

    Object.assign(restaurant, {
      id: restaurant_id,
      name,
      street,
      street_number,
      city,
      state,
      cost,
      rating,
      type,
      lat,
      lng,
    });

    this.restaurants.push(restaurant);
    return restaurant;
  }

  public async delete(id: string): Promise<void> {
    const index = this.restaurants.findIndex(
      restaurant => restaurant.id === id,
    );

    this.restaurants.splice(index, 1);
  }

  public async show(id: string): Promise<Restaurant | undefined> {
    const findRestaurant = this.restaurants.find(
      restaurant => restaurant.id === id,
    );

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
    const restaurant = new Restaurant();

    Object.assign(restaurant, {
      id: uuid(),
      name,
      street,
      street_number,
      city,
      state,
      cost,
      type,
      lat,
      lng,
    });

    this.restaurants.push(restaurant);
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
  }: IListRestaurantDTO): Promise<Restaurant[]> {
    const findRestaurants = this.restaurants.filter(
      restaurant =>
        (name ? restaurant.name === name : true) &&
        (street ? restaurant.street === street : true) &&
        (street_number ? restaurant.street_number === street_number : true) &&
        (city ? restaurant.city === city : true) &&
        (state ? restaurant.state === state : true) &&
        (cost ? restaurant.cost === cost : true) &&
        (rating ? restaurant.rating === rating : true) &&
        (type ? restaurant.type === type : true),
    );

    return findRestaurants;
  }
}

export default RestaurantsRepository;
