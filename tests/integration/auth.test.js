import request from "supertest";
import app from "../../src/index.js";
import User from "../../src/models/User.js";
import sequelize from "../../src/config/database.js";

describe("API Auth", () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("devrait enregistrer un nouvel utilisateur", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({
        email: "test@example.com",
        password: "password123",
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("message", "Utilisateur créé.");
    expect(res.body.user).toHaveProperty("email", "test@example.com");
  });

  it("devrait échouer à enregistrer un utilisateur avec un email invalide", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({
        email: "invalid-email",
        password: "password123",
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error");
  });

  it("devrait échouer à enregistrer un utilisateur avec un mot de passe trop court", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({
        email: "test@example.com",
        password: "123",
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error");
  });


  it("devrait échouer à connecter un utilisateur avec un mot de passe incorrect", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({
        email: "test@example.com",
        password: "wrongpassword",
      });

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("message", "Mot de passe incorrect.");
  });

  it("devrait échouer à connecter un utilisateur inexistant", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({
        email: "nonexistent@example.com",
        password: "password123",
      });

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("message", "Utilisateur introuvable.");
  });
});