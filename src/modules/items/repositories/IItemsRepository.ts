import Item from '@modules/items/infra/typeorm/entities/Item';

import ICreateItemDTO from '@modules/items/dtos/ICreateItemDTO';
import IUpdateItemDTO from '@modules/items/dtos/IUpdateItemDTO';
import IListItemDTO from '@modules/items/dtos/IListItemDTO';

export default interface IItemsRepository {
  index(data: IListItemDTO): Promise<Item[]>;
  create(data: ICreateItemDTO): Promise<Item>;
  show(id: string): Promise<Item | undefined>;
  delete(id: string): Promise<void>;
  update(data: IUpdateItemDTO): Promise<Item>;
  findSameItem(
    name: string,
    restaurant_id: string,
    item_id?: string,
  ): Promise<Item | undefined>;
  findById(id: string): Promise<Item | undefined>;
  findRestaurants(data: IListItemDTO): Promise<Item[] | undefined>;
}
