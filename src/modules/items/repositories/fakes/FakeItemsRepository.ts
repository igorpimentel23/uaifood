import { uuid } from 'uuidv4';

import IItemsRepository from '@modules/items/repositories/IItemsRepository';
import ICreateItemDTO from '@modules/items/dtos/ICreateItemDTO';
import IUpdateItemDTO from '@modules/items/dtos/IUpdateItemDTO';
import IListItemDTO from '@modules/items/dtos/IListItemDTO';
import Item from '@modules/items/infra/typeorm/entities/Item';

class ItemsRepository implements IItemsRepository {
  private items: Item[] = [];

  public async findRestaurants({
    name = null,
    rating = null,
    cost = null,
    greater_than = null,
    less_than = null,
    radius = null,
    lat = null,
    lng = null,
  }: IListItemDTO): Promise<Item[] | undefined> {
    const findItems = this.items.filter(
      item =>
        (name ? item.name.includes(name) : true) &&
        (rating ? item.rating === rating : true) &&
        (cost ? item.cost === cost : true) &&
        (greater_than ? item.cost <= greater_than : true) &&
        (less_than ? item.cost >= less_than : true) &&
        (radius && lat && lng
          ? this.getDistanceFromLatLonInKm(
              item.restaurant.lat,
              item.restaurant.lng,
              lat,
              lng,
            ) <= radius
          : true),
    );

    const itemsRestaurants = findItems.map(item => {
      let objItem = {} as Item;
      objItem = { ...objItem, restaurant: item.restaurant };
      return objItem;
    });

    return itemsRestaurants;
  }

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
    avatar,
  }: IUpdateItemDTO): Promise<Item> {
    const item = new Item();

    Object.assign(item, {
      id: item_id,
      name,
      rating,
      cost,
      avatar,
      restaurant_id,
      restaurant: {
        id: restaurant_id,
      },
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
    avatar,
    geolocation = '',
  }: ICreateItemDTO): Promise<Item> {
    const item = new Item();

    const [lat, lng] = geolocation.split(':');

    Object.assign(item, {
      id: uuid(),
      name,
      cost,
      restaurant_id,
      rating,
      avatar,
      restaurant: {
        id: restaurant_id,
        lat,
        lng,
      },
    });

    this.items.push(item);

    return item;
  }

  public async index({
    name = null,
    rating = null,
    cost = null,
    restaurant_id = null,
    radius = null,
    lat = null,
    lng = null,
  }: IListItemDTO): Promise<Item[]> {
    const findItems = this.items.filter(
      item =>
        (name ? item.name.includes(name) : true) &&
        (rating ? item.rating === rating : true) &&
        (cost ? item.cost === cost : true) &&
        (restaurant_id ? item.restaurant_id === restaurant_id : true) &&
        (radius && lat && lng
          ? this.getDistanceFromLatLonInKm(
              item.restaurant.lat,
              item.restaurant.lng,
              lat,
              lng,
            ) <= radius
          : true),
    );

    return findItems;
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

export default ItemsRepository;
