import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const asyncMiddleware =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

interface IUserRequest extends Request {
  user?: { _id: string };
}

const authMiddleware = async (
  req: IUserRequest,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return res.status(401).send("Access Denied");
  }

  try {
    if (!process.env.TOKEN_SECRET) {
      return res.status(500).send("Server Error");
    }

    // Verify the access token
    const decoded = jwt.verify(accessToken, process.env.TOKEN_SECRET) as {
      _id: string;
    };

    // Attach only the user ID to the request
    req.user = { _id: decoded._id };

    next();
  } catch (error) {
    if ((error as Error).name === "TokenExpiredError") {
      return res.status(401).json({ message: "Access token expired" });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default asyncMiddleware(authMiddleware);
