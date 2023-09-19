const app = require("../app");
const request = require("supertest");
const { sequelize, User } = require("./../src/models/index.js");
const { Op } = require("sequelize");
beforeAll(async () => {
  const mockData = {
    email: "user1@gmail.com",
    username: "username1",
    password: "@Adarizki123",
    confirm_password: "@Adarizki123",
  };
  await User.create(mockData);
});
afterAll(async () => {
  await User.destroy({
    where: {
      id: {
        [Op.not]: null,
      },
    },
  });
  sequelize.close();
});
describe("Endpoint register user ", () => {
  // Positif Test
  test("it should return 201 because success create a new user", async () => {
    const response = await request(app)
      .post(
        `${process.env.BASE_URL}${process.env.URL_ROUTER_AUTH}/register/users`
      )
      .send({
        email: "rizkysr90@gmail.com",
        username: "rizkysr90",
        password: "@Adarizki123",
        confirm_password: "@Adarizki123",
      })
      .set("Accept", "application/json");

    const { code, message } = response.body;
    expect(response.statusCode).toBe(201);
    expect(code).toBe(201);
  });
  // negatif test
  test("it should return 400 because duplicate email", async () => {
    const response = await request(app)
      .post(
        `${process.env.BASE_URL}${process.env.URL_ROUTER_AUTH}/register/users`
      )
      .send({
        // data provided below is the same with data inside beforeAll function
        email: "user1@gmail.com",
        username: "username10",
        password: "@Adarizki123",
        confirm_password: "@Adarizki123",
      })
      .set("Accept", "application/json");

    const { code, message } = response.body;
    expect(response.statusCode).toBe(400);
    expect(code).toBe(400);
    expect(message).toBe("email has already been registered");
  });
  test("it should return 400 because duplicate username", async () => {
    const response = await request(app)
      .post(
        `${process.env.BASE_URL}${process.env.URL_ROUTER_AUTH}/register/users`
      )
      .send({
        // data provided below is the same with data inside beforeAll function
        email: "user10@gmail.com",
        username: "username1",
        password: "@Adarizki123",
        confirm_password: "@Adarizki123",
      })
      .set("Accept", "application/json");

    const { code, message } = response.body;
    expect(response.statusCode).toBe(400);
    expect(code).toBe(400);
    expect(message).toBe("username has already been used");
  });
  test("it should return 400 because confirmation password is incorrect", async () => {
    const response = await request(app)
      .post(
        `${process.env.BASE_URL}${process.env.URL_ROUTER_AUTH}/register/users`
      )
      .send({
        email: "rizkysr90@gmail.com",
        username: "rizkysr90",
        password: "@Adarizki123",
        confirm_password: "@Adaarizki123",
      })
      .set("Accept", "application/json");

    const { code, message } = response.body;
    expect(response.statusCode).toBe(400);
    expect(code).toBe(400);
    expect(message).toBe("confirmation password is incorrect");
  });
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
  test("/auth/register/users - it should return 400 because user email is invalid email", async () => {
    const response = await request(app)
      .post(
        `${process.env.BASE_URL}${process.env.URL_ROUTER_AUTH}/register/users`
      )
      .send({
        email: "invalidemail.com",
        username: "validusername",
        password: "validpassword1234",
        confirm_password: "validpassword1234",
      })
      .set("accept", "application/json");
    const expected = [
      {
        value: "invalidemail.com",
        msg: "invalid email format",
        param: "email",
        location: "body",
      },
    ];
    const { code, message } = response.body;
    expect(response.statusCode).toBe(400);
    expect(code).toBe(400);
    expect(message).toEqual(expect.arrayContaining(expected));
  });
  const table1 = [
    {
      email: "validemail@gmail.com",
      username: "invalidemail?",
      password: "validpassword1234",
      confirm_password: "validpassword1234",
      expected: [
        {
          value: "invalidemail?",
          msg: "username should only contains alphanumeric",
          param: "username",
          location: "body",
        },
      ],
    },
    {
      email: "validemail@gmail.com",
      username: "abc",
      password: "validpassword1234",
      confirm_password: "validpassword1234",
      expected: [
        {
          value: "abc",
          msg: "username should be minimum 6 and maximum 16 character",
          param: "username",
          location: "body",
        },
      ],
    },
    {
      email: "validemail@gmail.com",
      username: "morethan16charactersssssssssssssssssssssssssssss",
      password: "validpassword1234",
      confirm_password: "validpassword1234",
      expected: [
        {
          value: "morethan16charactersssssssssssssssssssssssssssss",
          msg: "username should be minimum 6 and maximum 16 character",
          param: "username",
          location: "body",
        },
      ],
    },
  ];
  test.each(table1)(
    "/auth/register/users - it should return 400 because username does not meet the criteria",
    async ({ email, username, password, confirm_password, expected }) => {
      const response = await request(app)
        .post(
          `${process.env.BASE_URL}${process.env.URL_ROUTER_AUTH}/register/users`
        )
        .send({
          email,
          username,
          password,
          confirm_password,
        })
        .set("accept", "application/json");
      const { code, message } = response.body;
      expect(response.statusCode).toBe(400);
      expect(code).toBe(400);
      expect(message).toEqual(expect.arrayContaining(expected));
    }
  );
  const table2 = [
    {
      email: "validemail@gmail.com",
      username: "validemail",
      password: "onlyalphabet",
      confirm_password: "onlyalphabet",
      expected: [
        {
          value: "onlyalphabet",
          msg: "password must be minimal 1 uppercase,1 lowercase,1 simbol,1 number, and minimum length is 8 char",
          param: "password",
          location: "body",
        },
      ],
    },
    {
      email: "validemail@gmail.com",
      username: "validemail",
      password: "onlyalphabetand123",
      confirm_password: "onlyalphabetand123",
      expected: [
        {
          value: "onlyalphabetand123",
          msg: "password must be minimal 1 uppercase,1 lowercase,1 simbol,1 number, and minimum length is 8 char",
          param: "password",
          location: "body",
        },
      ],
    },
    {
      email: "validemail@gmail.com",
      username: "validemail",
      password: "ada1",
      confirm_password: "ada1",
      expected: [
        {
          value: "ada1",
          msg: "password must be minimal 1 uppercase,1 lowercase,1 simbol,1 number, and minimum length is 8 char",
          param: "password",
          location: "body",
        },
      ],
    },
    {
      email: "validemail@gmail.com",
      username: "validemail",
      password: "ADA123@123",
      confirm_password: "ADA123@123",
      expected: [
        {
          value: "ADA123@123",
          msg: "password must be minimal 1 uppercase,1 lowercase,1 simbol,1 number, and minimum length is 8 char",
          param: "password",
          location: "body",
        },
      ],
    },
    {
      email: "validemail@gmail.com",
      username: "validemail",
      password: "ada123@123",
      confirm_password: "ada123@123",
      expected: [
        {
          value: "ada123@123",
          msg: "password must be minimal 1 uppercase,1 lowercase,1 simbol,1 number, and minimum length is 8 char",
          param: "password",
          location: "body",
        },
      ],
    },
  ];
  test.each(table2)(
    "/auth/register/users - it should return 400 because password does not meet the criteria",
    async ({ email, username, password, confirm_password, expected }) => {
      const response = await request(app)
        .post(
          `${process.env.BASE_URL}${process.env.URL_ROUTER_AUTH}/register/users`
        )
        .send({
          email,
          username,
          password,
          confirm_password,
        })
        .set("accept", "application/json");
      const { code, message } = response.body;
      expect(response.statusCode).toBe(400);
      expect(code).toBe(400);
      expect(message).toEqual(expect.arrayContaining(expected));
    }
  );
});
