import request from "supertest";
import { app } from "../app";

import createConnection from "../database";

describe("Users",  () => {
    beforeAll(async () => {
        const connection = await createConnection();
        await connection.runMigrations();
    });

   it("Should be able to crate a new user", async () => {
        const response = await request(app).post("/users").send({
            name: "teste2",
            email: "testez@123.com",
        });

        expect(response.status).toBe(201);
   });

   it("This email already exists", async () => {
        const response = await request(app).post("/users").send({
            name: "teste2",
            email: "testez@123.com",
        });
        
        expect(response.status).toBe(401);
    });
});
