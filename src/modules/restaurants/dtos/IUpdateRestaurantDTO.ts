export default interface IUpdateRestaurantDTO {
  restaurant_id: string;
  name: string;
  street: string;
  street_number: number;
  city: string;
  state: string;
  cost: number;
  rating?: number;
  type: string;
  lat: number;
  lng: number;
}
