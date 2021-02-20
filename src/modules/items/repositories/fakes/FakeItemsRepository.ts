import { uuid } from 'uuidv4';

import IItemsRepository from '@modules/items/repositories/IItemsRepository';
import ICreateItemDTO from '@modules/items/dtos/ICreateItemDTO';
import IUpdateItemDTO from '@modules/items/dtos/IUpdateItemDTO';
import IListItemDTO from '@modules/items/dtos/IListItemDTO';
import Item from '@modules/items/infra/typeorm/entities/Item';

class ItemsRepository implements IItemsRepository {
  private items: Item[] = [];

  public async findById(id: string): Promise<Item | undefined> {
    const findItem = this.items.find(item => item.id === id);

    return findItem;
  }

  public async findSameItem(
    name: string,
    restaurant_id: string,
  ): Promise<Item | undefined> {
    const findItem = this.items.find(item => {
      return item.name === name && item.restaurant_id === restaurant_id;
    });

    return findItem;
  }

  public async update({
    item_id,
    name,
    rating = 0,
    cost,
    restaurant_id,
  }: IUpdateItemDTO): Promise<Item> {
    const item = new Item();

    Object.assign(item, {
      id: item_id,
      name,
      rating,
      cost,
      restaurant_id,
    });

    this.items.push(item);
    return item;
  }

  public async delete(id: string): Promise<void> {
    const index = this.items.findIndex(item => item.id === id);

    this.items.splice(index, 1);
  }

  public async show(id: string): Promise<Item | undefined> {
    const findItem = this.items.find(item => item.id === id);

    return findItem;
  }

  public async create({
    name,
    cost,
    restaurant_id,
    rating,
  }: ICreateItemDTO): Promise<Item> {
    const item = new Item();

    Object.assign(item, {
      id: uuid(),
      name,
      cost,
      restaurant_id,
      rating,
    });

    this.items.push(item);

    return item;
  }

  public async index({
    name = null,
    rating = null,
    cost = null,
    restaurant_id = null,
  }: IListItemDTO): Promise<Item[]> {
    const findItems = this.items.filter(
      item =>
        (name ? item.name === name : true) &&
        (rating ? item.rating === rating : true) &&
        (cost ? item.cost === cost : true) &&
        (restaurant_id ? item.restaurant_id === restaurant_id : true),
    );

    return findItems;
  }
}

export default ItemsRepository;
