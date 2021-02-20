import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListRestaurantItemsService from '@modules/items/services/ListRestaurantItemsService';

export default class RestaurantItemsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { restaurant_id } = request.params;

    const listRestaurantItems = container.resolve(ListRestaurantItemsService);

    const items = await listRestaurantItems.execute(restaurant_id);

    return response.json(items);
  }
}
