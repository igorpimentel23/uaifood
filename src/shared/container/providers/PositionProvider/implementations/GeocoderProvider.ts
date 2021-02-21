import nodeGeocoder from 'node-geocoder';
import positionConfig from '@config/position';
import IPositionProvider from '../models/IPositionProvider';

interface AddressProps {
  street?: string | null;
  street_number?: number | null;
  city?: string | null;
  state?: string | null;
}

export default class PositionProvider implements IPositionProvider {
  public async getCoord({
    street = null,
    street_number = null,
    city = null,
    state = null,
  }: AddressProps): Promise<number[] | null> {
    let coord = null;
    let address = '';

    if (city && !street && !street_number && !state) {
      address = city;
    } else {
      address = `${street}, ${street_number}, ${city}, ${state}`;
    }
    const geoCoder = nodeGeocoder(positionConfig);

    const response = await geoCoder.geocode(address);

    if (response[0].latitude && response[0].longitude) {
      coord = [response[0].latitude, response[0].longitude];
    }

    return coord;
  }
}
