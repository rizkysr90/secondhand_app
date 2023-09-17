const app = require("../app");
const request = require("supertest");

describe("Endpoint register user ", () => {
  // Positif Test
  test("it should return 201 success to create a new user", async () => {
    const response = await request(app)
      .post(`${process.env.BASE_URL}${process.env.URL_ROUTER_AUTH}`)
      .send({
        email: "test@gmail.com",
        password: "test123456",
        name: "test",
      })
      .set("Accept", "application/json");

    const { code, data } = response.body;
    expect(code).toBe(201);
  });

  // negatif test
  test("/auth/register/users - it should return 400 because user not input required data", async () => {
    const response = await request(app)
      .post(
        `${process.env.BASE_URL}${process.env.URL_ROUTER_AUTH}/register/users`
      )
      .send({
        email: "",
        username: "",
        password: "",
        confirm_password: "",
      })
      .set("Accept", "application/json");
    const expected = [
      {
        value: "",
        msg: "email cannot be empty",
        param: "email",
        location: "body",
      },
      {
        value: "",
        msg: "username cannot be empty",
        param: "username",
        location: "body",
      },
      {
        value: "",
        msg: "password cannot be empty",
        param: "password",
        location: "body",
      },
      {
        value: "",
        msg: "confirmation password cannot be empty",
        param: "confirm_password",
        location: "body",
      },
    ];
    const { code, message } = response.body;
    expect(response.statusCode).toBe(400);
    expect(code).toBe(400);
    expect(message).toEqual(expect.arrayContaining(expected));
  });
  test("create data users Error Data Sudah Digunakan", async () => {
    const response = await request(app)
      .post(`${process.env.BASE_URL}/${process.env.URL_ROUTER_REGISTER}`)
      .send({
        email: "user1@gmail.com",
        password: "123456789",
        name: "Uchiha Itachi",
      })
      .set("Accept", "application/json");

    const { code, message } = response.body;
    expect(code).toBe(400);
    expect(message).toBe(`Email sudah digunakan`);
  });
});
