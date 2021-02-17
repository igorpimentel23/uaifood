import IPositionProvider from '../models/IPositionProvider';

interface AddressProps {
  street: string;
  street_number: number;
  city: string;
  state: string;
}

export default class FakePositionProvider implements IPositionProvider {
  public async getCoord({
    street,
    street_number,
    city,
    state,
  }: AddressProps): Promise<number[] | null> {
    if (street || street_number || city || state) {
      if (state === 'far') {
        return [-26.101944, -51.159222];
      }
      return [-25.101944, -50.159222];
    }
    return null;
  }
}
