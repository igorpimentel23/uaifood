import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateItemService from '@modules/items/services/CreateItemService';
import DeleteItemService from '@modules/items/services/DeleteItemService';
import UpdateItemService from '@modules/items/services/UpdateItemService';
import ShowItemService from '@modules/items/services/ShowItemService';
import ListItemsService from '@modules/items/services/ListItemsService';
import { classToClass } from 'class-transformer';

export default class ItemController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { name, rating, cost, restaurant_id } = request.body;

    const listItems = container.resolve(ListItemsService);

    const items = await listItems.execute({
      name,
      rating,
      cost,
      restaurant_id,
    });

    return response.json(classToClass(items));
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { name, cost, restaurant_id } = request.body;

    const createItem = container.resolve(CreateItemService);

    const item = await createItem.execute({
      name,
      cost,
      restaurant_id,
      user_id,
    });

    return response.json(item);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { item_id } = request.query;

    const showItem = container.resolve(ShowItemService);

    const item = await showItem.execute(String(item_id));

    return response.json(classToClass(item));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { item_id, name, cost, rating, restaurant_id } = request.body;

    const updateItem = container.resolve(UpdateItemService);

    const item = await updateItem.execute({
      item_id,
      name,
      cost,
      rating,
      restaurant_id,
      user_id,
    });

    return response.json(item);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { item_id } = request.query;

    const deleteItem = container.resolve(DeleteItemService);

    await deleteItem.execute({
      user_id,
      item_id: String(item_id),
    });

    return response.json('Item deleted');
  }
}
