import request from 'supertest';
import mongoose from 'mongoose';
import CommentModel from '../models/commentsModel';
import Post from '../models/Post';
import {Application} from 'express';
import {createServer} from "../server";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();
const testUserId = "60c72b2f9b1e8a0012345678";
const token = jwt.sign({_id: testUserId}, process.env.TOKEN_SECRET || "testSecret", {
    expiresIn: "1h",
});

const authCookie = `accessToken=${token}`;

const mockPostId = new mongoose.Types.ObjectId();
let app: Application;

beforeAll(async () => {
    app = await createServer();
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Comments Controller Tests', () => {
    afterEach(async () => {
        await CommentModel.deleteMany();
        await Post.deleteMany();
    });

    test('GET /comments - should return all comments', async () => {
        await CommentModel.create({
            user:  new mongoose.Types.ObjectId(testUserId),
            message: 'This is a test comment',
            postId: mockPostId,
        });

        const response = await request(app).get('/comments');

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].user).toBe(testUserId);
    });

    test('GET /comments/:comment_id - should return a comment by ID', async () => {
        const comment = await CommentModel.create({
            user: testUserId,
            message: 'Another test comment',
            postId: mockPostId,
        });

        const response = await request(app).get(`/comments/${comment._id}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Another test comment');
    });

    test('POST /comments - should create a new comment', async () => {
        await Post.create({
            _id: mockPostId,
            title: 'Test Post',
            content: 'This is a test post',
            owner: testUserId,
        });

        const newComment = {
            user: testUserId,
            message: 'This is a new comment',
            postId: mockPostId,
        };

        const response = await request(app).post('/comments')
            .set('Cookie', [authCookie]).
            send(newComment);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('This is a new comment');

        const updatedPost = await Post.findById(mockPostId);

        console.log('Updated Post Comments:', updatedPost?.comments);
        console.log('Response Body ID:', response.body._id);

        expect(updatedPost?.comments.map(String)).toContain(response.body._id);
    });


    test('PUT /comments/:comment_id - should update a comment by ID', async () => {
        const comment = await CommentModel.create({
            user: testUserId,
            message: 'Old comment message',
            postId: mockPostId,
        });

        const updatedData = {
            message: 'Updated comment message',
        };

        const response = await request(app).put(`/comments/${comment._id}`)
            .set('Cookie', [authCookie])
            .send(updatedData);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Updated comment message');
    });

    test('DELETE /comments/:comment_id - should delete a comment by ID', async () => {
        const post = await Post.create({
            _id: mockPostId,
            title: 'Test Post',
            content: 'This is a test post',
            owner: testUserId,
        });

        const comment = await CommentModel.create({
            user: testUserId,
            message: 'Comment to delete',
            postId: mockPostId,
        });

        const response = await request(app)
            .delete(`/comments/${comment._id}`)
            .set('Cookie', [authCookie]);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Comment deleted successfully');

        const updatedPost = await Post.findById(mockPostId);
        expect(updatedPost).not.toBeNull();
        expect(updatedPost?.comments).not.toContain(comment._id);
    });

    test('PUT /comments/:comment_id - non-existent comment update', async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const updatedData = {
            message: 'No comment to update',
        };

        CommentModel.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

        const response = await request(app).put(`/comments/${fakeId}`)
            .set('Cookie', [authCookie])
            .send(updatedData);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Comment not found');
    });

    test('GET /comments - error when fetching comments by postId', async () => {
        const invalidPostId = 'invalid-post-id';
        CommentModel.find = jest.fn().mockRejectedValue(new Error('Database failure'));

        const response = await request(app).get(`/comments?post_id=${invalidPostId}`);

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Database failure');
    });

    test('DELETE /comments/:comment_id - database error on deletion', async () => {
        const comment = await CommentModel.create({
            user: testUserId,
            message: 'Temp message',
            postId: mockPostId,
        });

        CommentModel.findByIdAndDelete = jest.fn().mockRejectedValue(new Error('Database failure'));

        const response = await request(app)
            .delete(`/comments/${comment._id}`)
            .set('Cookie', [authCookie]);

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Database failure');
    });

});
