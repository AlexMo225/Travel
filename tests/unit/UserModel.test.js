import User from "../../src/models/User.js";
import sequelize from "../../src/config/database.js";

describe("Modèle User", () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("devrait créer un utilisateur avec un email valide", async () => {
    const user = await User.create({
      email: "test@example.com",
      password: "password123",
    });
    expect(user.email).toBe("test@example.com");
  });
});