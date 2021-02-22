export default interface ICreateItemDTO {
  name: string;
  cost: number;
  restaurant_id: string;
  rating?: number;
  avatar: string;
  geolocation: string;
}
