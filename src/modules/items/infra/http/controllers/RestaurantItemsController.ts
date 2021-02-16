import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListRestaurantItemsService from '@modules/items/services/ListRestaurantItemsService';
import { classToClass } from 'class-transformer';

export default class UserItemsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { restaurant_id } = request.query;

    const listRestaurantItems = container.resolve(ListRestaurantItemsService);

    const items = await listRestaurantItems.execute(String(restaurant_id));

    return response.json(classToClass(items));
  }
}
