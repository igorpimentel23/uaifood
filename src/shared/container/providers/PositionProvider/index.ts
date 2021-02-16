import { container } from 'tsyringe';

import IPositionProvider from '@shared/container/providers/PositionProvider/models/IPositionProvider';
import PositionProvider from '@shared/container/providers/PositionProvider/implementations/GeocoderProvider';

const providers = {
  position: PositionProvider,
};

container.registerSingleton<IPositionProvider>(
  'PositionProvider',
  providers.position,
);
