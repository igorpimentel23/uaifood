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
    let query = '';

    if (name) {
      query += `items.name LIKE '%${name}%' `;
    }

    if (rating) {
      if (query) {
        query += 'AND ';
      }

      query += `items.rating = ${rating} `;
    }

    if (cost) {
      if (query) {
        query += 'AND ';
      }

      query += `items.cost = ${cost} `;
    }

    if (greater_than) {
      if (query) {
        query += 'AND ';
      }

      query += `items.cost <= ${greater_than} `;
    }

    if (less_than) {
      if (query) {
        query += 'AND ';
      }

      query += `items.cost >= ${less_than} `;
    }

    if (radius && lat && lng) {
      if (query) {
        query += 'AND ';
      }

      query += `ST_Distance(items.geolocation, ST_MakePoint(${lng}, ${lat})) < ${
        radius * 1000
      }`;
    }

    if (query) {
      query += 'AND ';
    }

    const queryBuilder = await this.ormRepository.query(
      `SELECT * FROM items INNER JOIN restaurants ON (${query}items.restaurant_id = restaurants.id)`,
    );

    return queryBuilder;
  }

  public async findById(id: string): Promise<Item | undefined> {
    const findItem = await this.ormRepository.findOne({
      where: { id },
      relations: ['restaurant'],
    });
    return findItem;
  }

  public async findSameItem(
    name: string,
    restaurant_id: string,
    item_id?: string,
  ): Promise<Item | undefined> {
    let query = {};

    if (item_id) {
      query = { id: Not(item_id) };
    }

    const findItem = await this.ormRepository.findOne({
      where: [{ ...query, name, restaurant_id }],
      relations: ['restaurant'],
    });
    return findItem;
  }

  public async update({
    item_id,
    name,
    rating = 0,
    cost,
    restaurant_id,
    geolocation,
  }: IUpdateItemDTO): Promise<Item> {
    const item = await this.ormRepository.save({
      id: item_id,
      name,
      rating,
      cost,
      restaurant_id,
      geolocation,
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
      relations: ['restaurant'],
    });
    return findItem;
  }

  public async create({
    name,
    cost,
    restaurant_id,
    geolocation,
    avatar,
  }: ICreateItemDTO): Promise<Item> {
    const item = this.ormRepository.create({
      name,
      cost,
      restaurant_id,
      geolocation,
      avatar,
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
    radius = null,
    lat = null,
    lng = null,
  }: IListItemDTO): Promise<Item[]> {
    let query = {};

    const queryBuilder = this.ormRepository
      .createQueryBuilder('items')
      .leftJoinAndSelect('items.restaurant', 'restaurant');

    if (name) {
      query = { ...query, name: Like(`%${name}%`) };
    }

    if (rating) {
      query = { ...query, rating };
    }

    if (cost) {
      query = { ...query, cost };
    }

    if (greater_than) {
      query = { ...query, cost: MoreThanOrEqual(greater_than) };
    }

    if (less_than) {
      query = { ...query, cost: MoreThanOrEqual(less_than) };
    }

    if (restaurant_id) {
      query = { ...query, restaurant_id };
    }

    if (radius && lat && lng) {
      queryBuilder.where(
        'ST_Distance(items.geolocation, ST_MakePoint(:lng, :lat)) < :radius',
        { lng, lat, radius: radius * 1000 },
      );
    }

    if (Object.keys(query).length) {
      queryBuilder.where(query);
    }

    const items = await queryBuilder.getMany();

    return items;
  }
}

export default ItemsRepository;
