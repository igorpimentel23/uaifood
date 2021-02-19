import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import RestaurantsController from '@modules/restaurants/infra/http/controllers/RestaurantsController';
import UserRestaurantsController from '@modules/restaurants/infra/http/controllers/UserRestaurantsController';

const restaurantsRouter = Router();
const restaurantsController = new RestaurantsController();
const userRestaurantsController = new UserRestaurantsController();

restaurantsRouter.use(ensureAuthenticated);

restaurantsRouter.get('/me', userRestaurantsController.index);

restaurantsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      street: Joi.string().required(),
      street_number: Joi.number().integer().min(0).required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      cost: Joi.number().min(0).required(),
      type: Joi.string().required(),
    },
  }),
  restaurantsController.create,
);

restaurantsRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      restaurant_id: Joi.string().uuid().required(),
      name: Joi.string().required(),
      street: Joi.string().required(),
      street_number: Joi.number().integer().min(0).required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      cost: Joi.number().min(0).required(),
      rating: Joi.number().integer().min(0).max(5),
      type: Joi.string().required(),
    },
  }),
  restaurantsController.update,
);

restaurantsRouter.get(
  '/all',
  celebrate({
    [Segments.QUERY]: {
      name: Joi.string(),
      street: Joi.string(),
      street_number: Joi.number().integer().min(0),
      city: Joi.string(),
      state: Joi.string(),
      cost: Joi.number().min(0),
      rating: Joi.number().integer().min(0).max(5),
      type: Joi.string(),
      user_id: Joi.string(),
      radius: Joi.number(),
      lat: Joi.number(),
      lng: Joi.number(),
    },
  }),
  restaurantsController.index,
);

restaurantsRouter.get(
  '/:restaurant_id',
  celebrate({
    [Segments.PARAMS]: {
      restaurant_id: Joi.string().uuid().required(),
    },
  }),
  restaurantsController.show,
);

restaurantsRouter.delete(
  '/:restaurant_id',
  celebrate({
    [Segments.PARAMS]: {
      restaurant_id: Joi.string().uuid().required(),
    },
  }),
  restaurantsController.delete,
);

export default restaurantsRouter;
