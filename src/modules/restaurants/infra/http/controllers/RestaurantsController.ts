import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateRestaurantService from '@modules/restaurants/services/CreateRestaurantService';
import DeleteRestaurantService from '@modules/restaurants/services/DeleteRestaurantService';
import UpdateRestaurantService from '@modules/restaurants/services/UpdateRestaurantService';
import ShowRestaurantService from '@modules/restaurants/services/ShowRestaurantService';
import ListRestaurantsService from '@modules/restaurants/services/ListRestaurantsService';
import { classToClass } from 'class-transformer';

export default class RestaurantController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { name, address, cost, rating, type, user_id } = request.body;

    const listRestaurants = container.resolve(ListRestaurantsService);

    const restaurants = await listRestaurants.execute({
      name,
      address,
      cost,
      rating,
      type,
      user_id,
    });

    return response.json(classToClass(restaurants));
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { name, address, cost, type } = request.body;

    const createRestaurant = container.resolve(CreateRestaurantService);

    const restaurant = await createRestaurant.execute({
      name,
      address,
      cost,
      type,
      user_id,
    });

    return response.json(restaurant);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { restaurant_id } = request.query;

    const showRestaurant = container.resolve(ShowRestaurantService);

    const restaurant = await showRestaurant.execute({
      restaurant_id: String(restaurant_id),
      user_id,
    });

    return response.json(classToClass(restaurant));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { restaurant_id, name, address, cost, rating, type } = request.body;

    const updateRestaurant = container.resolve(UpdateRestaurantService);

    const restaurant = await updateRestaurant.execute({
      restaurant_id,
      name,
      address,
      cost,
      rating,
      type,
      user_id,
    });

    return response.json(restaurant);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { restaurant_id } = request.query;

    const deleteRestaurant = container.resolve(DeleteRestaurantService);

    await deleteRestaurant.execute({
      user_id,
      restaurant_id: String(restaurant_id),
    });

    return response.json('Restaurant deleted');
  }
}
