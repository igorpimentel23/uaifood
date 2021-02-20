import { Router } from 'express';
import restaurantsRouter from '@modules/restaurants/infra/http/routes/restaurants.routes';
import itemsRouter from '@modules/items/infra/http/routes/items.routes';

const routes = Router();

routes.use('/restaurants', restaurantsRouter);
routes.use('/items', itemsRouter);

export default routes;
