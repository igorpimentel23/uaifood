import { uuid } from 'uuidv4';
import { isEqual, isAfter, getMonth, getYear, getDate } from 'date-fns';

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
    restaurant_id?: string,
  ): Promise<Restaurant | undefined> {
    const findRestaurant = this.restaurants.find(
      restaurant =>
        restaurant.name === name &&
        restaurant.type === type &&
        restaurant.id === restaurant_id,
    );

    return findRestaurant;
  }

  public async update({
    restaurant_id,
    name,
    address,
    cost,
    type,
    user_id,
  }: IUpdateRestaurantDTO): Promise<Restaurant> {
    const restaurant = new Restaurant();

    Object.assign(restaurant, {
      id: restaurant_id,
      name,
      address,
      cost,
      type,
      user_id,
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
    address,
    cost,
    type,
    user_id,
  }: ICreateRestaurantDTO): Promise<Restaurant> {
    const restaurant = new Restaurant();

    Object.assign(restaurant, {
      id: uuid(),
      name,
      address,
      cost,
      type,
      user_id,
      user: {
        id: user_id,
      },
    });

    this.restaurants.push(restaurant);
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
    const findRestaurants = this.restaurants.filter(
      restaurant =>
        restaurant.name === name &&
        restaurant.address === address &&
        restaurant.cost === cost &&
        restaurant.rating === rating &&
        restaurant.type === type &&
        restaurant.user_id === user_id,
    );

    return findRestaurants;
  }
}

export default RestaurantsRepository;
