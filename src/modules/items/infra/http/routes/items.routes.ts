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
    [Segments.QUERY]: {
      name: Joi.string(),
      rating: Joi.number().integer().min(0).max(5),
      cost: Joi.number().min(0),
      less_than: Joi.number(),
      greater_than: Joi.number(),
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
      cost: Joi.number().min(0).required(),
      restaurant_id: Joi.string().uuid(),
    },
  }),
  itemsController.create,
);

itemsRouter.get(
  '/:item_id',
  celebrate({
    [Segments.PARAMS]: {
      item_id: Joi.string().uuid().required(),
    },
  }),
  itemsController.show,
);

itemsRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      item_id: Joi.string().uuid().required(),
      name: Joi.string().required(),
      cost: Joi.number().min(0).required(),
      rating: Joi.number().integer().min(0).max(5),
      restaurant_id: Joi.string().uuid(),
    },
  }),
  itemsController.update,
);

itemsRouter.delete(
  '/:item_id',
  celebrate({
    [Segments.PARAMS]: {
      item_id: Joi.string().uuid().required(),
    },
  }),
  itemsController.delete,
);

itemsRouter.get(
  '/:restaurant_id/me',
  celebrate({
    [Segments.PARAMS]: {
      restaurant_id: Joi.string().uuid().required(),
    },
  }),
  restaurantItemsController.index,
);

export default itemsRouter;
