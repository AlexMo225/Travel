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

describe("API Trips", () => {
  it("devrait créer un nouveau voyage", async () => {
    const res = await request(app)
      .post("/trips")
      .set("Authorization", `Bearer ${token}`) // Ajoute le token ici
      .send({ destination: "Londres" });

    console.log("Réponse trip test:", res.body); // Debug

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("destination", "Londres");
  });

  it("devrait retourner une erreur sans token", async () => {
    const res = await request(app).post("/trips").send({ destination: "Paris" });

    console.log("Réponse sans token :", res.body);

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("message", "Authentification requise");
  });
});
