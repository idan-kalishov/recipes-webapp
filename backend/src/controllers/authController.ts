import { NextFunction, Request, Response } from "express";
import userModel, { IUser } from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Document } from "mongoose";

const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password, userName } = req.body;
  console.log(email, password, userName);

  if (!email || !password || !userName) {
    res.status(400).json({ message: "Missing email, password, or username" });
    return;
  }

  if (password.length < 8) {
    res
      .status(400)
      .json({ message: "Password must be at least 8 characters long" });
    return;
  }

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "Email already exists" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await userModel.create({
      email,
      userName,
      password: hashedPassword,
    });

    const { password: _, ...userWithoutPassword } = user.toObject();

    res.status(201).json({
      message: "User registered successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Registration Error:", error);

    if ((error as any).code === 11000) {
      res.status(400).json({ message: "Email already exists" });
      return;
    }

    res.status(500).json({ message: "An error occurred during registration" });
  }
};

type tTokens = {
  accessToken: string;
  refreshToken: string;
};

const generateToken = (userId: string): tTokens | null => {
  if (!process.env.TOKEN_SECRET) {
    return null;
  }
  // generate token
  const random = Math.random().toString();
  const accessToken = jwt.sign(
    {
      _id: userId,
      random: random,
    },
    process.env.TOKEN_SECRET,
    { expiresIn: process.env.TOKEN_EXPIRES }
  );

  const refreshToken = jwt.sign(
    {
      _id: userId,
      random: random,
    },
    process.env.TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES }
  );

  return {
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
};

const login = async (req: Request, res: Response) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user || !user.password) {
      res.status(400).send("wrong username or password");
      return;
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password as string
    );

    if (!validPassword) {
      console.log("invalid password");
      res.status(400).send("wrong username or password");
      return;
    }
    if (!process.env.TOKEN_SECRET) {
      res.status(500).send("Server Error");
      return;
    }

    const tokens = generateToken(user._id.toString());

    if (!tokens) {
      res.status(500).send("Server Error");
      return;
    }
    if (!user.refreshToken) {
      user.refreshToken = [];
    }

    user.refreshToken.push(tokens.refreshToken);
    await user.save();
    res.cookie("accessToken", tokens.accessToken, { httpOnly: true });
    res.cookie("refreshToken", tokens.refreshToken, { httpOnly: true });
    res.status(200).json({
      user: {
        _id: user._id,
        email: user.email,
        userName: user.userName,
        profilePicture: user.profilePicture
          ? `/uploads/${user.profilePicture}`
          : null,
      },
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

type tIUser = Document<unknown, {}, IUser> &
  IUser &
  Required<{
    _id: string;
  }> & {
    __v: number;
  };
const verifyRefreshToken = (refreshToken: string | undefined) => {
  return new Promise<tIUser>((resolve, reject) => {
    //get refresh token from body
    if (!refreshToken) {
      reject("fail");
      return;
    }
    //verify token
    if (!process.env.TOKEN_SECRET) {
      reject("fail");
      return;
    }
    jwt.verify(
      refreshToken,
      process.env.TOKEN_SECRET,
      async (err: any, payload: any) => {
        if (err) {
          reject("fail");
          return;
        }
        //get the user id from token
        const userId = payload._id;
        try {
          //get the user form the db
          const user = await userModel.findById(userId);
          if (!user) {
            reject("fail");
            return;
          }
          if (!user.refreshToken || !user.refreshToken.includes(refreshToken)) {
            user.refreshToken = [];
            await user.save();
            reject("fail");
            return;
          }
          const tokens = user.refreshToken!.filter(
            (token) => token !== refreshToken
          );
          user.refreshToken = tokens;

          resolve(user);
        } catch (err) {
          reject("fail");
          return;
        }
      }
    );
  });
};

const logout = async (req: Request, res: Response) => {
  try {
    const user = await verifyRefreshToken(req.body.refreshToken);
    await user.save();
    res.status(200).send("success");
  } catch (err) {
    res.status(400).send("fail");
  }
};

const refresh = async (req: Request, res: Response) => {
  try {
    const user = await verifyRefreshToken(req.body.refreshToken);
    if (!user) {
      res.status(400).send("fail");
      return;
    }
    const tokens = generateToken(user._id);

    if (!tokens) {
      res.status(500).send("Server Error");
      return;
    }
    if (!user.refreshToken) {
      user.refreshToken = [];
    }
    user.refreshToken.push(tokens.refreshToken);
    await user.save();
    res.status(200).send({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      _id: user._id,
    });
    //send new token
  } catch (err) {
    res.status(400).send("fail");
  }
};

const userDetails = (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;

    if (!user) {
      res.status(401).json({ message: "User not authenticated" });
    } else {
      res.status(200).json({
        user: {
          _id: user._id,
          email: user.email,
          userName: user.userName,
          profilePicture: user.profilePicture
            ? `/uploads/${user.profilePicture}`
            : null,
        },
      });
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export default {
  register,
  login,
  refresh,
  logout,
  userDetails,
};
