interface AddressProps {
  street: string;
  street_number: number;
  city: string;
  state: string;
}

export default interface IStorageProvider {
  getCoord({
    street,
    street_number,
    city,
    state,
  }: AddressProps): Promise<number[] | null>;
}
