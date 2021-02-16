import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ItemsController from '@modules/items/infra/http/controllers/ItemsController';
import RestaurantItemsController from '@modules/items/infra/http/controllers/RestaurantItemsController';

const itemsRouter = Router();
const itemsController = new ItemsController();
const restaurantItemsController = new RestaurantItemsController();

itemsRouter.use(ensureAuthenticated);

itemsRouter.get(
  '/all',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string(),
      rating: Joi.number(),
      cost: Joi.number(),
      restaurant_id: Joi.string().uuid(),
    },
  }),
  itemsController.index,
);
itemsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      cost: Joi.number().required(),
      restaurant_id: Joi.string().uuid(),
    },
  }),
  itemsController.create,
);
itemsRouter.get('/', itemsController.show);
itemsRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      item_id: Joi.string().uuid().required(),
      name: Joi.string().required(),
      cost: Joi.number().required(),
      rating: Joi.number(),
      restaurant_id: Joi.string().uuid(),
    },
  }),
  itemsController.update,
);
itemsRouter.delete('/', itemsController.delete);
itemsRouter.get('/me', restaurantItemsController.index);

export default itemsRouter;
