export default interface IUpdateItemDTO {
  item_id: string;
  name: string;
  rating?: number;
  cost: number;
  restaurant_id: string;
  avatar: string;
  geolocation: string;
}
