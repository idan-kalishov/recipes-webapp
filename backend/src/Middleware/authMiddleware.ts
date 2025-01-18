import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import userModel from "../models/User";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(401).send("Access Denied");
  }

  try {
    if (!process.env.TOKEN_SECRET) {
      return res.status(500).send("Server Error");
    }

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET) as {
      _id: string;
    };
    const user = await userModel.findById(decoded._id);

    if (!user) {
      return res.status(401).send("Invalid Token");
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).send("Invalid Token");
  }
};

export default authMiddleware;
