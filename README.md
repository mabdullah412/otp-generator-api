# OTP Generator API

This is a Node based server that provides an `api` which can be used perform the following functions:

| Endpoint                             | Method | Description                                       | Body                       |
| :----------------------------------- | :----- | :------------------------------------------------ | :------------------------- |
| `/api/users`                         | GET    | Returns a list of all users in the database       |                            |
| `/api/users`                         | POST   | Create a user                                     | `firstName`, `phoneNumber` |
| `.api/:userId`                       | PATCH  | Update a user's name                              | `firstName`                |
| `.api/:userId`                       | DELETE | Remove a user                                     |                            |
| `.api/users/generateOTP`             | POST   | Generates and stores a 4 digt OTP in the database | `phoneNumber`              |
| `/users/:user_id/verifyOTP?otp=1234` | GET    | Verifies the status of the OTP                    |                            |

The `api` can be seen in action at [OTP Generator React App](https://otp-generator-react.vercel.app/).

### Database

The `userController` establishes a connection with a firebase firestore database. The database values can be seen
by calling the `/api/users` endpoint. The `users` document in the database contain the following fields:

| Field                 | Datatype  |
| :-------------------- | :-------- |
| `id`                  | string    |
| `firstName`           | string    |
| `phoneNumber`         | string    |
| `otp`                 | number    |
| `otp_expiration_date` | timestamp |
