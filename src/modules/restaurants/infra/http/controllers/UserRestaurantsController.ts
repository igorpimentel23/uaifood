import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListUserRestaurantsService from '@modules/restaurants/services/ListUserRestaurantsService';
import { classToClass } from 'class-transformer';

export default class UserRestaurantsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const listUserRestaurants = container.resolve(ListUserRestaurantsService);

    const restaurants = await listUserRestaurants.execute(user_id);

    return response.json(classToClass(restaurants));
  }
}
