# Capstone: Restaurant Reservation System

## Live Application
https://front-end-kappa-liard.vercel.app/dashboard 

## Screenshots
![Screen Shot 2022-09-01 at 11 14 50 AM](https://user-images.githubusercontent.com/93909152/187984427-9b978503-6db2-44db-bda2-8053eb75269d.png)
![Screen Shot 2022-09-01 at 11 15 28 AM](https://user-images.githubusercontent.com/93909152/187984520-b6b502f6-42f2-49d7-bfe0-9b63ca78dc26.png)
![Screen Shot 2022-09-01 at 11 15 41 AM](https://user-images.githubusercontent.com/93909152/187984540-a98dd865-895f-4f3d-b1dd-c983b7e117a9.png)
![Screen Shot 2022-09-01 at 11 16 00 AM](https://user-images.githubusercontent.com/93909152/187984589-fdf1b0b3-171c-4b4e-885b-c37aa0f60c2c.png)
![Screen Shot 2022-09-01 at 11 16 22 AM](https://user-images.githubusercontent.com/93909152/187984641-55f92197-b43d-4546-a65f-5fb476dbb29d.png)


## Technologies
- ReactJS
- Bootstrap
- Node.js
- Express
- Javascript
- HTML
- CSS
- Knex
- PostgreSQL
- Vercel

## Application
The restaurant reservation application allows restaurants to create, edit, track, and manage reservations and tables. Existing reservations can be booked, seated, finished, as well as searched for via phone number. Reservations are filtered by date, and tables are displayed on the dashboard with a status of Free or Occupied.

## Installation

1. Fork and clone this repository.
2. Set up an ElephantSQL database and connect it to database manager (DBeaver, etc.)
3. Run `cp ./back-end/.env.sample ./back-end/.env`.
4. Update the `./back-end/.env` file with the connection URL's to your ElephantSQL database instance.
5. Run `cp ./front-end/.env.sample ./front-end/.env`.
6. You should not need to make changes to the `./front-end/.env` file unless you want to connect to a backend at a location other than `http://localhost:5000`.
7. Run `npm install` to install project dependencies.
8. Run `npm run start:dev` to start your server in development mode.

