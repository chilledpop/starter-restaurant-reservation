# Capstone: Restaurant Reservation System

## Live Application
https://front-end-kappa-liard.vercel.app/dashboard 

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

