import { Router } from 'express';
import restaurantsRouter from '@modules/restaurants/infra/http/routes/restaurants.routes';
import itemsRouter from '@modules/items/infra/http/routes/items.routes';
import usersRouter from '@modules/users/infra/http/routes/users.routes';
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes';
import passwordRouter from '@modules/users/infra/http/routes/password.routes';
import profileRouter from '@modules/users/infra/http/routes/profile.routes';

const routes = Router();

routes.use('/restaurants', restaurantsRouter);
routes.use('/items', itemsRouter);
routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/password', passwordRouter);
routes.use('/profile', profileRouter);

export default routes;
