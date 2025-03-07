import Trip from "../../src/models/Trip.js";
import User from "../../src/models/User.js";
import sequelize from "../../src/config/database.js";

describe("Modèle Trip", () => {
  let user;

  beforeAll(async () => {
    await sequelize.sync({ force: true });

    user = await User.create({
      email: "test@example.com",
      password: "password123",
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("devrait créer un voyage", async () => {
    const trip = await Trip.create({
      destination: "Paris",
      startDate: "2024-02-10",
      endDate: "2024-02-20",
      UserId: user.id,
    });

    expect(trip.destination).toBe("Paris");
    expect(trip.UserId).toBe(user.id);
  });

  it("devrait échouer à créer un voyage sans destination", async () => {
    await expect(
      Trip.create({
        startDate: "2024-02-10",
        endDate: "2024-02-20",
        UserId: user.id,
      })
    ).rejects.toThrow();
  });

  it("devrait échouer à créer un voyage avec des dates invalides", async () => {
    await expect(
      Trip.create({
        destination: "Paris",
        startDate: "invalid-date",
        endDate: "invalid-date",
        UserId: user.id,
      })
    ).rejects.toThrow();
  });

  it("devrait appartenir à un utilisateur", async () => {
    const trip = await Trip.create({
      destination: "Paris",
      startDate: "2024-02-10",
      endDate: "2024-02-20",
      UserId: user.id,
    });

    const associatedUser = await trip.getUser();
    expect(associatedUser.id).toBe(user.id);
  });
});