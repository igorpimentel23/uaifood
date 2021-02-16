import { uuid } from 'uuidv4';
import { isEqual, isAfter, getMonth, getYear, getDate } from 'date-fns';

import IRestaurantsRepository from '@modules/restaurants/repositories/IRestaurantsRepository';
import ICreateRestaurantDTO from '@modules/restaurants/dtos/ICreateRestaurantDTO';
import IUpdateRestaurantDTO from '@modules/restaurants/dtos/IUpdateRestaurantDTO';
import Restaurant from '@modules/restaurants/infra/typeorm/entities/Restaurant';

class RestaurantsRepository implements IRestaurantsRepository {
  private restaurants: Restaurant[] = [];

  public async findAllFromUser(user_id: string): Promise<Restaurant[]> {
    const today = new Date();
    const findRestaurant = this.restaurants.filter(
      restaurant =>
        restaurant.user_id === user_id && isAfter(restaurant.date, today),
    );

    return findRestaurant;
  }

  public async findByDate(
    date: Date,
    provider_id: string,
  ): Promise<Restaurant | undefined> {
    const findRestaurant = this.restaurants.find(
      restaurant =>
        isEqual(restaurant.date, date) &&
        restaurant.provider_id === provider_id,
    );

    return findRestaurant;
  }

  public async findById(id: string): Promise<Restaurant | undefined> {
    const findRestaurant = this.restaurants.find(
      restaurant => restaurant.id === id,
    );

    return findRestaurant;
  }

  public async show(id: string): Promise<Restaurant | undefined> {
    const findRestaurant = this.restaurants.find(
      restaurant => restaurant.id === id,
    );

    return findRestaurant;
  }

  public async delete(id: string): Promise<void> {
    //console.log(this.restaurants);
    //this.restaurants.splice(restaurant);
  }

  public async update({
    restaurant_id,
    provider_id,
    user_id,
    date,
  }: IUpdateRestaurantDTO): Promise<Restaurant> {
    const restaurant = new Restaurant();

    Object.assign(restaurant, { id: uuid(), date, provider_id, user_id });

    this.restaurants.push(restaurant);
    return restaurant;
  }

  public async create({
    provider_id,
    user_id,
    date,
  }: ICreateRestaurantDTO): Promise<Restaurant> {
    const restaurant = new Restaurant();

    Object.assign(restaurant, { id: uuid(), date, provider_id, user_id });

    this.restaurants.push(restaurant);
    return restaurant;
  }
}

export default RestaurantsRepository;
