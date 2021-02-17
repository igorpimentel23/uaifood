import nodeGeocoder from 'node-geocoder';
import positionConfig from '@config/position';
import IPositionProvider from '../models/IPositionProvider';

interface AddressProps {
  street: string;
  street_number: number;
  city: string;
  state: string;
}

export default class PositionProvider implements IPositionProvider {
  public async getCoord({
    street,
    street_number,
    city,
    state,
  }: AddressProps): Promise<number[] | null> {
    let coord = null;

    const address = `${street}, ${street_number}, ${city}, ${state}`;
    const geoCoder = nodeGeocoder(positionConfig);

    const response = await geoCoder.geocode(address);

    if (response[0].latitude && response[0].longitude) {
      coord = [response[0].latitude, response[0].longitude];
    }

    return coord;
  }
}
