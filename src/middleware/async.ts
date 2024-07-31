import { Request, Response, NextFunction } from "express";

const asyncMiddleware = (
  handler: (req: Request, res: Response) => Promise<void>
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res);
    } catch (ex) {
      next(ex);
    }
  };
};

export default asyncMiddleware;
