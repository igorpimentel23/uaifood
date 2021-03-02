export default interface IListItemDTO {
  name?: string | null;
  rating?: number[] | null;
  cost?: number[] | null;
  restaurant_id?: string | null;
  radius?: number | null;
  lat?: number | null;
  lng?: number | null;
}
