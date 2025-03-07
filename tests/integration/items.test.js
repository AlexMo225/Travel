import request from "supertest";
import app from "../../src/index.js";

let token; 

beforeAll(async () => {
  const loginRes = await request(app)
    .post("/auth/login")
    .send({ email: "test@example.com", password: "password123" });

  token = loginRes.body.token;
  console.log("Token récupéré après login :", token);
});

describe("API Items", () => {
  it("devrait créer un nouvel item", async () => {
    const res = await request(app)
      .post("/items")
      .set("Authorization", `Bearer ${token}`) 
      .send({ name: "Valise" });

    console.log("Réponse items test:", res.body); 

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("name", "Valise");
  });

  it("devrait retourner une erreur sans token", async () => {
    const res = await request(app).post("/items").send({ name: "Sac" });

    console.log("Réponse sans token :", res.body);

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("message", "Authentification requise");
  });
});
