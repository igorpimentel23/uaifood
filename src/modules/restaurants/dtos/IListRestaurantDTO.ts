export default interface IListRestaurantDTO {
  name?: string | null;
  street?: string | null;
  street_number?: number | null;
  city?: string | null;
  state?: string | null;
  cost?: number | null;
  less_than?: number | null;
  greater_than?: number | null;
  rating?: number | null;
  type?: string | null;
  radius?: number | null;
  lat?: number | null;
  lng?: number | null;
}
