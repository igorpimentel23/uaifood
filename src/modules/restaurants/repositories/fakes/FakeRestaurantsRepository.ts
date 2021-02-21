import { uuid } from 'uuidv4';

import IRestaurantsRepository from '@modules/restaurants/repositories/IRestaurantsRepository';
import ICreateRestaurantDTO from '@modules/restaurants/dtos/ICreateRestaurantDTO';
import IUpdateRestaurantDTO from '@modules/restaurants/dtos/IUpdateRestaurantDTO';
import IListRestaurantDTO from '@modules/restaurants/dtos/IListRestaurantDTO';
import Restaurant from '@modules/restaurants/infra/typeorm/entities/Restaurant';

class RestaurantsRepository implements IRestaurantsRepository {
  private restaurants: Restaurant[] = [];

  public async findCategories(): Promise<Restaurant[] | undefined> {
    const categories = this.restaurants.map(restaurant => {
      let objRestaurant = {} as Restaurant;
      objRestaurant = { ...objRestaurant, type: restaurant.type };
      return objRestaurant;
    });

    return categories;
  }

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
      geolocation: `${lat}:${lng}`,
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
    radius = null,
    lat = null,
    lng = null,
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
        (type ? restaurant.type === type : true) &&
        (radius && lat && lng
          ? this.getDistanceFromLatLonInKm(
              restaurant.lat,
              restaurant.lng,
              lat,
              lng,
            ) <= radius
          : true),
    );

    return findRestaurants;
  }

  private getDistanceFromLatLonInKm(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ) {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1); // deg2rad below
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  }

  private deg2rad(deg: number) {
    return deg * (Math.PI / 180);
  }
}

export default RestaurantsRepository;
