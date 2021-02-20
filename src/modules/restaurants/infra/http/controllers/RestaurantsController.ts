import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateRestaurantService from '@modules/restaurants/services/CreateRestaurantService';
import DeleteRestaurantService from '@modules/restaurants/services/DeleteRestaurantService';
import UpdateRestaurantService from '@modules/restaurants/services/UpdateRestaurantService';
import ShowRestaurantService from '@modules/restaurants/services/ShowRestaurantService';
import ListRestaurantsService from '@modules/restaurants/services/ListRestaurantsService';

export default class RestaurantController {
  public async index(request: Request, response: Response): Promise<Response> {
    const {
      name,
      street,
      street_number,
      city,
      state,
      cost,
      greater_than,
      less_than,
      rating,
      type,
      radius,
      lat,
      lng,
    } = request.query;

    let query = {};

    if (name) {
      query = { ...query, name: String(name) };
    }

    if (street) {
      query = { ...query, street: String(street) };
    }

    if (street_number) {
      query = { ...query, street_number: Number(street_number) };
    }

    if (city) {
      query = { ...query, city: String(city) };
    }

    if (state) {
      query = { ...query, state: String(state) };
    }

    if (cost) {
      query = { ...query, cost: Number(cost) };
    }

    if (greater_than) {
      query = { ...query, greater_than: Number(greater_than) };
    }

    if (less_than) {
      query = { ...query, less_than: Number(less_than) };
    }

    if (rating) {
      query = { ...query, rating: Number(rating) };
    }

    if (type) {
      query = { ...query, type: String(type) };
    }

    if (radius) {
      query = { ...query, radius: Number(radius) };
    }

    if (lat) {
      query = { ...query, lat: Number(lat) };
    }

    if (lng) {
      query = { ...query, lng: Number(lng) };
    }

    const listRestaurants = container.resolve(ListRestaurantsService);

    const restaurants = await listRestaurants.execute(query);

    return response.json(restaurants);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const {
      name,
      street,
      street_number,
      city,
      state,
      cost,
      type,
    } = request.body;

    const createRestaurant = container.resolve(CreateRestaurantService);

    const restaurant = await createRestaurant.execute({
      name,
      street,
      street_number,
      city,
      state,
      cost,
      type,
    });

    return response.json(restaurant);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { restaurant_id } = request.params;

    const showRestaurant = container.resolve(ShowRestaurantService);

    const restaurant = await showRestaurant.execute({
      restaurant_id,
    });

    return response.json(restaurant);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const {
      restaurant_id,
      name,
      street,
      street_number,
      city,
      state,
      cost,
      rating,
      type,
    } = request.body;

    const updateRestaurant = container.resolve(UpdateRestaurantService);

    const restaurant = await updateRestaurant.execute({
      restaurant_id,
      name,
      street,
      street_number,
      city,
      state,
      cost,
      rating,
      type,
    });

    return response.json(restaurant);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { restaurant_id } = request.params;

    const deleteRestaurant = container.resolve(DeleteRestaurantService);

    await deleteRestaurant.execute({
      restaurant_id,
    });

    return response.json('Restaurant deleted');
  }
}
