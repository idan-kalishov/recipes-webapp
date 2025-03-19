import request from "supertest";
import mongoose from "mongoose";
import Post from "../models/Post";
import userModel, {IUser} from "../models/User";
import {createServer} from "../server";

var app: any;

beforeAll(async () => {
    console.log("beforeAll");
    app = await createServer();
    await userModel.deleteMany();
    await Post.deleteMany();
});
afterAll((done) => {
    console.log("afterAll");
    mongoose.connection.close();
    done();
});

const baseUrl = "/auth";

type User = IUser & {
    accessToken?: string,
    refreshToken?: string
};

const testUser: User = {
    userName: "testUser",
    email: "test@user.com",
    password: "testpassword",
}

describe("Auth Tests", () => {
    test("Auth test register", async () => {
        const response = await request(app).post(baseUrl + "/register").send(testUser);
        expect(response.statusCode).toBe(201);
    });

    test("Auth test register fail", async () => {
        const response = await request(app).post(baseUrl + "/register").send(testUser);
        expect(response.statusCode).not.toBe(201);
    });

    test("Auth test register fail", async () => {
        const response = await request(app).post(baseUrl + "/register").send({
            email: "sdsdfsd",
        });

        expect(response.statusCode).not.toBe(201);
    });

    test("Auth test login", async () => {
        const response = await request(app).post(baseUrl + "/login").send(testUser);
        expect(response.statusCode).toBe(200);

        const cookies = response.headers["set-cookie"];
        expect(cookies).toBeDefined();
        // Optionally, you can inspect each cookie
        const accessTokenCookie = cookies.find((cookie) =>
            cookie.startsWith("accessToken=")
        );
        const refreshTokenCookie = cookies.find((cookie) =>
            cookie.startsWith("refreshToken=")
        );

        expect(accessTokenCookie).toBeDefined();
        expect(refreshTokenCookie).toBeDefined();

        testUser.accessToken = accessTokenCookie;
        testUser.refreshToken = refreshTokenCookie;
        testUser._id = response.body.user._id;
    });

    test("Check tokens are not the same", async () => {
        const response = await request(app).post(baseUrl + "/login").send(testUser);
        const accessToken = response.body.accessToken;
        const refreshToken = response.body.refreshToken;

        expect(accessToken).not.toBe(testUser.accessToken);
        expect(refreshToken).not.toBe(testUser.refreshToken);
    });

    test("Auth test login fail", async () => {
        const response = await request(app).post(baseUrl + "/login").send({
            email: testUser.email,
            password: "sdfsd",
        });


        expect(response.statusCode).not.toBe(200);
    });

    test("Auth test login fail", async () => {
        const response2 = await request(app).post(baseUrl + "/login").send({
            email: "dsfasd",
            password: "sdfsd",
        });

        expect(response2.statusCode).not.toBe(200);
    });


    test("Test refresh token", async () => {
        const response = await request(app).post(baseUrl + "/refresh")
            .set("Cookie", [`${testUser.refreshToken}`])
            .send();

        expect(response.statusCode).toBe(200);

        const cookies = response.headers["set-cookie"];
        expect(cookies).toBeDefined();
        // Optionally, you can inspect each cookie
        const accessTokenCookie = cookies.find((cookie) =>
            cookie.startsWith("accessToken=")
        );
        const refreshTokenCookie = cookies.find((cookie) =>
            cookie.startsWith("refreshToken=")
        );

        expect(accessTokenCookie).toBeDefined();
        expect(refreshTokenCookie).toBeDefined();

        testUser.accessToken = accessTokenCookie;
        testUser.refreshToken = refreshTokenCookie;
    });

    test("Double use refresh token", async () => {
        const response = await request(app).post(baseUrl + "/refresh")
            .set("Cookie", [`${testUser.refreshToken}`])
            .send();
        expect(response.statusCode).toBe(200);

        const cookies = response.headers["set-cookie"];
        const refreshTokenNew = cookies.find((cookie) =>
            cookie.startsWith("refreshToken=")
        );

        const response2 = await request(app).post(baseUrl + "/refresh")
            .set("Cookie", [`${testUser.refreshToken}`])
            .send();
        expect(response2.statusCode).not.toBe(200);

        const response3 = await request(app).post(baseUrl + "/refresh")
            .set("Cookie", [`${refreshTokenNew}`])
            .send();
        expect(response3.statusCode).toBe(200);
    });

    test("Test logout", async () => {
        const response = await request(app).post(baseUrl + "/login").send(testUser);
        expect(response.statusCode).toBe(200);
        testUser.accessToken = response.body.accessToken;
        testUser.refreshToken = response.body.refreshToken;

        const response2 = await request(app).post(baseUrl + "/logout").send({
            refreshToken: testUser.refreshToken,
        });
        expect(response2.statusCode).toBe(200);

        const response3 = await request(app).post(baseUrl + "/refresh").send({
            refreshToken: testUser.refreshToken,
        });
        expect(response3.statusCode).not.toBe(200);

    });
});
