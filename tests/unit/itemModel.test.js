import Item from "../../src/models/Item.js";
import Trip from "../../src/models/Trip.js";
import User from "../../src/models/User.js";
import sequelize from "../../src/config/database.js";

describe("Modèle Item", () => {
  let user;
  let trip;

  beforeAll(async () => {
    await sequelize.sync({ force: true });

    user = await User.create({
      email: "test@example.com",
      password: "password123",
    });

    trip = await Trip.create({
      destination: "Paris",
      startDate: "2024-02-10",
      endDate: "2024-02-20",
      UserId: user.id,
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("devrait créer un item", async () => {
    const item = await Item.create({
      name: "Passeport",
      quantity: 1,
      TripId: trip.id,
    });

    expect(item.name).toBe("Passeport");
    expect(item.quantity).toBe(1);
    expect(item.TripId).toBe(trip.id);
  });

  it("devrait échouer à créer un item sans nom", async () => {
    await expect(
      Item.create({
        quantity: 1,
        TripId: trip.id,
      })
    ).rejects.toThrow();
  });

  it("devrait échouer à créer un item avec une quantité invalide", async () => {
    await expect(
      Item.create({
        name: "Passeport",
        quantity: 0,
        TripId: trip.id,
      })
    ).rejects.toThrow();
  });

  it("devrait appartenir à un voyage", async () => {
    const item = await Item.create({
      name: "Passeport",
      quantity: 1,
      TripId: trip.id,
    });

    const associatedTrip = await item.getTrip();
    expect(associatedTrip.id).toBe(trip.id);
  });
});