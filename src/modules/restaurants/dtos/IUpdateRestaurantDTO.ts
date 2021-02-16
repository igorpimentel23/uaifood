export default interface IUpdateRestaurantDTO {
  restaurant_id: string;
  name: string;
  address: string;
  cost: number;
  rating?:number;
  type: string;
  user_id: string;
}
