export default interface IListRestaurantDTO {
  name?: string | null;
  street?: string | null;
  street_number?: number | null;
  city?: string | null;
  state?: string | null;
  cost?: number | null;
  rating?: number | null;
  type?: string | null;
  user_id?: string | null;
}
