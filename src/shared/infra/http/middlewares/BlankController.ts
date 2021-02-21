import { Request, Response } from 'express';

export default class BlankController {
  public async index(request: Request, response: Response): Promise<Response> {
    return response.json({
      OK: 'OK',
    });
  }
}
