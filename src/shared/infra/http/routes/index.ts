import { Router } from 'express';
import restaurantsRouter from '@modules/restaurants/infra/http/routes/restaurants.routes';
import itemsRouter from '@modules/items/infra/http/routes/items.routes';
import BlankController from '@shared/infra/http/middlewares/BlankController';

const routes = Router();

const blankController = new BlankController();

routes.use('/api/v1/restaurants', restaurantsRouter);
routes.use('/api/v1/items', itemsRouter);
routes.use('/', blankController.index);

export default routes;
