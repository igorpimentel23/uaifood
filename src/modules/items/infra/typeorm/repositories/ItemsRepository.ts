import { getRepository, Repository, Not, MoreThanOrEqual, Like } from 'typeorm';
import IItemsRepository from '@modules/items/repositories/IItemsRepository';
import ICreateItemDTO from '@modules/items/dtos/ICreateItemDTO';
import IUpdateItemDTO from '@modules/items/dtos/IUpdateItemDTO';
import IListItemDTO from '@modules/items/dtos/IListItemDTO';
import Item from '@modules/items/infra/typeorm/entities/Item';

class ItemsRepository implements IItemsRepository {
  private ormRepository: Repository<Item>;

  constructor() {
    this.ormRepository = getRepository(Item);
  }

  public async findById(id: string): Promise<Item | undefined> {
    const findItem = await this.ormRepository.findOne({
      where: { id },
      relations: ['restaurant', 'restaurant.user'],
    });
    return findItem;
  }

  public async findSameItem(
    name: string,
    restaurant_id: string,
  ): Promise<Item | undefined> {
    const findItem = await this.ormRepository.findOne({
      where: [{ name, restaurant_id }],
      relations: ['restaurant', 'restaurant.user'],
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
    const item = await this.ormRepository.save({
      id: item_id,
      name,
      rating,
      cost,
      restaurant_id,
    });

    return item;
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete({
      id,
    });
  }

  public async show(id: string): Promise<Item | undefined> {
    const findItem = await this.ormRepository.findOne({
      where: { id },
      relations: ['restaurant', 'restaurant.user'],
    });
    return findItem;
  }

  public async create({
    name,
    cost,
    restaurant_id,
  }: ICreateItemDTO): Promise<Item> {
    const item = this.ormRepository.create({
      name,
      cost,
      restaurant_id,
    });

    await this.ormRepository.save(item);

    return item;
  }

  public async index({
    name = null,
    rating = null,
    cost = null,
    greater_than = null,
    less_than = null,
    restaurant_id = null,
  }: IListItemDTO): Promise<Item[]> {
    let query = {};

    if (name) {
      query = { ...query, name: Like(`%${name}`) };
    }

    if (rating) {
      query = { ...query, rating };
    }

    if (cost) {
      query = { ...query, cost };
    } else {
      if (greater_than) {
        query = { ...query, cost: MoreThanOrEqual(greater_than) };
      }
      if (less_than) {
        query = { ...query, cost: MoreThanOrEqual(less_than) };
      }
    }

    if (restaurant_id) {
      query = { ...query, restaurant_id };
    }

    const items = await this.ormRepository.find({
      where: [query],
    });

    return items;
  }
}

export default ItemsRepository;
