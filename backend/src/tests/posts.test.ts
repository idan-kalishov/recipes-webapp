import dotenv from "dotenv";
import { Application } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import request from "supertest";
import Post from "../models/Post";
import { createServer } from "../server";

dotenv.config();
const testUserId = "60c72b2f9b1e8a0012345678";
const token = jwt.sign(
  { _id: testUserId },
  process.env.TOKEN_SECRET || "testSecret",
  {
    expiresIn: "1h",
  }
);

const authCookie = `accessToken=${token}`;

describe("Post Controller Tests", () => {
  let mockPostId: string = "";

  let app: Application;

  beforeAll(async () => {
    app = await createServer();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear the database before each test
    await Post.deleteMany({});

    // Create a mock post for tests
    const post = await Post.create({
      title: "Mock Post",
      content: "This is a mock post.",
      owner: testUserId,
    });
    mockPostId = post._id as any;
  });

  afterEach(async () => {
    // Clean up after tests
    await Post.deleteMany({});
  });

  test("POST /posts - should fail without required fields", async () => {
    const incompletePost = {
      content: "Missing title and owner.",
    };

    const response = await request(app)
      .post("/posts")
      .set("Cookie", [authCookie])
      .send(incompletePost);

    expect(response.status).toBe(400);
    expect(response.body.error).toContain("Title and owner are required.");
  });

  test("POST /posts - should create a new post", async () => {
    const newPost = {
      title: "New Post",
      content: "This is a new post.",
      owner: testUserId,
    };

    const response = await request(app)
      .post("/posts")
      .set("Cookie", [authCookie])
      .send(newPost);

    expect(response.status).toBe(201);
    expect(response.body.title).toBe(newPost.title);
    expect(response.body.owner).toBe(newPost.owner);
  });

  test("GET /posts - should fetch all posts", async () => {
    const response = await request(app).get("/posts");

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test("PUT /posts/:post_id - should handle updates for non-existing post", async () => {
    const nonExistingId = new mongoose.Types.ObjectId();
    const updatedData = { title: "Updated", content: "Updated content" };

    const response = await request(app)
      .put(`/posts/${nonExistingId}`)
      .set("Cookie", [authCookie])
      .send(updatedData);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Post not found.");
  });

  test("DELETE /posts/:post_id - should handle deletion of non-existing post", async () => {
    const nonExistingId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .delete(`/posts/${nonExistingId}`)
      .set("Cookie", [authCookie]);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Post not found.");
  });

  test("PUT /posts/:post_id - should update a post", async () => {
    const updatedData = {
      title: "Updated Post",
      content: "This is an updated post.",
    };

    const response = await request(app)
      .put(`/posts/${mockPostId}`)
      .set("Cookie", [authCookie])
      .send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body.title).toBe(updatedData.title);
    expect(response.body.content).toBe(updatedData.content);
  });

  test("DELETE /posts/:post_id - should delete a post", async () => {
    const response = await request(app)
      .delete(`/posts/${mockPostId}`)
      .set("Cookie", [authCookie]);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Post deleted successfully.");

    const deletedPost = await Post.findById(mockPostId);
    expect(deletedPost).toBeNull();
  });

  test("GET /posts?lastUpdateTime - should fetch posts after a specific time", async () => {
    const lastUpdateTime = new Date().toISOString();

    const response = await request(app).get(
      `/posts?lastUpdateTime=${lastUpdateTime}`
    );

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  test("GET /posts/paginate?page=1&limit=2 - should return paginated posts", async () => {
    const response = await request(app).get("/posts/paginate?page=1&limit=2");

    expect(response.status).toBe(200);
    expect(response.body.posts).toBeInstanceOf(Array);
    expect(response.body.totalCount).toBeGreaterThanOrEqual(0);
  });

  test("PUT /posts/:post_id - should fail if not authenticated", async () => {
    const response = await request(app)
      .put(`/posts/${mockPostId}`)
      .send({ title: "Unauthorized Update" });

    expect(response.status).toBe(401);
  });

  test("DELETE /posts/:post_id - should fail if not authenticated", async () => {
    const response = await request(app).delete(`/posts/${mockPostId}`);

    expect(response.status).toBe(401);
  });

  test("POST /posts/:id/like - should like a post", async () => {
    const response = await request(app)
      .post(`/posts/${mockPostId}/like`)
      .set("Cookie", [authCookie]);

    expect(response.status).toBe(200);
    expect(response.body.likes).toContain(testUserId);
  });
});
