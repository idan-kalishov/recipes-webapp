import { Request, Response } from "express";
import { updateUser } from "../controllers/userController";
import userModel from "../models/User";
import fs from "fs";
import path from "path";

jest.mock("../models/User");
jest.mock("fs");

describe("updateUser", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      user: { _id: "mockUserId" },
      body: {},
      file: undefined,
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should update user details and profile picture successfully", async () => {
    const mockUser = {
      _id: "mockUserId",
      userName: "oldUsername",
      profilePicture: "uploads/oldPicture.jpg",
      save: jest.fn(),
    };

    (userModel.findById as jest.Mock).mockResolvedValue(mockUser);
    (fs.existsSync as jest.Mock).mockReturnValue(true);

    req.body = { userName: "newUsername" };
    req.file = { filename: "newPicture.jpg" } as any;

    await updateUser(req as Request, res as Response);

    expect(userModel.findById).toHaveBeenCalledWith("mockUserId");
    expect(fs.unlinkSync).toHaveBeenCalledWith(
      path.join(__dirname, "../uploads/oldPicture.jpg")
    );
    expect(mockUser.userName).toBe("newUsername");
    expect(mockUser.profilePicture).toBe("uploads/newPicture.jpg");
    expect(mockUser.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "User updated successfully",
      profilePicture: "uploads/newPicture.jpg",
    });
  });

  it("should handle missing userId in the request", async () => {
    delete req.user;

    await updateUser(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid request: User ID is missing",
    });
  });

  it("should handle user not found in the database", async () => {
    (userModel.findById as jest.Mock).mockResolvedValue(null);

    await updateUser(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
  });

  it("should handle database errors", async () => {
    (userModel.findById as jest.Mock).mockRejectedValue(new Error("DB error"));

    await updateUser(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "DB error" });
  });

  it("should handle file system errors during unlink", async () => {
    const mockUser = {
      _id: "mockUserId",
      profilePicture: "uploads/oldPicture.jpg",
      save: jest.fn(),
    };

    (userModel.findById as jest.Mock).mockResolvedValue(mockUser);
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.unlinkSync as jest.Mock).mockImplementation(() => {
      throw new Error("File system error");
    });

    req.file = { filename: "newPicture.jpg" } as any;

    await updateUser(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "File system error" });
  });
});
