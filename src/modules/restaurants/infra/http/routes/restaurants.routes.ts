import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import RestaurantsController from '@modules/restaurants/infra/http/controllers/RestaurantsController';
import UserRestaurantsController from '@modules/restaurants/infra/http/controllers/UserRestaurantsController';

const restaurantsRouter = Router();
const restaurantsController = new RestaurantsController();
const userRestaurantsController = new UserRestaurantsController();

restaurantsRouter.use(ensureAuthenticated);

restaurantsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      address: Joi.string().required(),
      cost: Joi.number().required(),
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
      address: Joi.string().required(),
      cost: Joi.number().required(),
      rating: Joi.number(),
      type: Joi.string().required(),
    },
  }),
  restaurantsController.update,
);
restaurantsRouter.get(
  '/all',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string(),
      address: Joi.string(),
      cost: Joi.number(),
      rating: Joi.number(),
      type: Joi.string(),
      user_id: Joi.string(),
    },
  }),
  restaurantsController.index,
);
restaurantsRouter.get('/', restaurantsController.show);
restaurantsRouter.delete('/', restaurantsController.delete);
restaurantsRouter.get('/me', userRestaurantsController.index);

export default restaurantsRouter;
