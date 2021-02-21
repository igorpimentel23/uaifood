import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateItemService from '@modules/items/services/CreateItemService';
import DeleteItemService from '@modules/items/services/DeleteItemService';
import UpdateItemService from '@modules/items/services/UpdateItemService';
import ShowItemService from '@modules/items/services/ShowItemService';
import ListItemsService from '@modules/items/services/ListItemsService';

export default class ItemController {
  public async index(request: Request, response: Response): Promise<Response> {
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

    if (rating) {
      query = { ...query, rating: String(rating) };
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

    const listItems = container.resolve(ListItemsService);

    const items = await listItems.execute(query);

    return response.json(items);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { name, cost, restaurant_id, avatar } = request.body;

    const createItem = container.resolve(CreateItemService);

    const item = await createItem.execute({
      name,
      cost,
      restaurant_id,
      avatar,
    });

    return response.json(item);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { item_id } = request.params;

    const showItem = container.resolve(ShowItemService);

    const item = await showItem.execute(item_id);

    return response.json(item);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { item_id, name, cost, rating, restaurant_id, avatar } = request.body;

    const updateItem = container.resolve(UpdateItemService);

    const item = await updateItem.execute({
      item_id,
      name,
      cost,
      rating,
      restaurant_id,
      avatar,
    });

    return response.json(item);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { item_id } = request.params;

    const deleteItem = container.resolve(DeleteItemService);

    await deleteItem.execute({
      item_id,
    });

    return response.json('Item deleted');
  }
}
