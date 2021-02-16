export default interface ICreateItemDTO {
  name: string;
  cost: number;
  restaurant_id: string;
  user_id?: string;
  rating?: number;
}
