export default interface ICreateRestaurantDTO {
  name: string;
  address: string;
  cost: number;
  rating?: number;
  type: string;
  user_id: string;
  lat: number;
  lng: number;
}
