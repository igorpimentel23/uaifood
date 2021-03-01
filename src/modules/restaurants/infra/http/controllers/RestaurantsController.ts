import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { ParsedQs } from 'qs';

import CreateRestaurantService from '@modules/restaurants/services/CreateRestaurantService';
import DeleteRestaurantService from '@modules/restaurants/services/DeleteRestaurantService';
import UpdateRestaurantService from '@modules/restaurants/services/UpdateRestaurantService';
import ShowRestaurantService from '@modules/restaurants/services/ShowRestaurantService';
import ListRestaurantsService from '@modules/restaurants/services/ListRestaurantsService';
import ListRestaurantsTypesService from '@modules/restaurants/services/ListRestaurantsTypesService';
import ListItemsRestaurantsService from '@modules/restaurants/services/ListItemsRestaurantsService';

export default class RestaurantController {
  public async index(request: Request, response: Response): Promise<Response> {
    const {
      name,
      street,
      street_number,
      city,
      state,
      cost,
      rating,
      type,
      radius,
      lat,
      lng,
      city_for_geo,
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

    if (cost && Array.isArray(cost) && cost.length !== 0) {
      cost.forEach((r: string | ParsedQs) => Number(r));
      query = { ...query, cost };
    }

    if (rating && Array.isArray(rating) && rating.length !== 0) {
      rating.forEach((r: string | ParsedQs) => Number(r));
      query = { ...query, rating };
    }

    if (type && Array.isArray(type) && type.length !== 0) {
      type.forEach((r: string | ParsedQs) => String(r));
      query = { ...query, type };
    }

    if (lat) {
      query = { ...query, lat: Number(lat) };
    }

    if (lng) {
      query = { ...query, lng: Number(lng) };
    }

    if (city_for_geo) {
      query = { ...query, city_for_geo, radius: 30 };
    } else if (radius) {
      query = { ...query, radius: Number(radius) };
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

  public async types(request: Request, response: Response): Promise<Response> {
    const getTypes = container.resolve(ListRestaurantsTypesService);

    const types = await getTypes.execute();

    return response.json(types);
  }

  public async findRestaurant(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const {
      name,
      rating,
      cost,
      greater_than,
      less_than,
      restaurant_id,
      radius,
      lat,
      lng,
    } = request.query;

    let query = {};

    if (name) {
      query = { ...query, name: String(name) };
    }

    if (rating && Array.isArray(rating)) {
      rating.forEach((r: string | ParsedQs) => Number(r));
      query = { ...query, rating };
    }

    if (cost) {
      query = { ...query, cost: String(cost) };
    }

    if (greater_than) {
      query = { ...query, greater_than: String(greater_than) };
    }

    if (less_than) {
      query = { ...query, less_than: String(less_than) };
    }

    if (restaurant_id) {
      query = { ...query, restaurant_id: String(restaurant_id) };
    }

    if (radius) {
      query = { ...query, radius: String(radius) };
    }

    if (lat) {
      query = { ...query, lat: String(lat) };
    }

    if (lng) {
      query = { ...query, lng: String(lng) };
    }

    const listItemsRestaurants = container.resolve(ListItemsRestaurantsService);

    const restaurants = await listItemsRestaurants.execute(query);

    return response.json(restaurants);
  }
}
