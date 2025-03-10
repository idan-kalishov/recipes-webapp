import jwt from "jsonwebtoken";
import userModel from "../models/User";
import { Request, Response, NextFunction } from "express";

const asyncMiddleware =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

const authMiddleware = async (
  req: Request,
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

    const decoded = jwt.verify(accessToken, process.env.TOKEN_SECRET) as {
      _id: string;
    };
    const user = await userModel.findById(decoded._id);

    if (!user) {
      return res.status(401).send("Invalid Token");
    }

    req.user = user;
    next();
  } catch (error) {
    if ((error as Error).name === "TokenExpiredError") {
      return res.status(401).json({ message: "Access token expired" });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default asyncMiddleware(authMiddleware);
