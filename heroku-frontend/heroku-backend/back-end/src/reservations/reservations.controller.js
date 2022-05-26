/**
 * List handler for reservation resources
 */

const reservationsService = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");


// validation middleware
const REQUIRED_FIELDS = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
]

async function isValidData(req, res, next) {
  if (!req.body.data) {
    return next({ status: 400, message: "Missing input fields."})
  }

  next();
}

async function hasValidFields(req, res, next) {
  for (const field of REQUIRED_FIELDS) {
    if (!req.body.data[field]) {
      return next({ status: 400, message: `Missing field: ${field}.`});
    }
  }

  const { reservation_date, reservation_time, people } = req.body.data;
  
  if (!Date.parse(reservation_date)) {
    return next({ status: 400, message: `reservation_date is not a valid date.`});
  }

  if (!reservation_time.match(/[0-9]{2}:[0-9]{2}/g)) {
    return next({ status: 400, message: `reservation_time is not a valid time.`})
  }

  if ( (typeof people !== 'number') || isNaN(people)) {
    return next({ status: 400, message: `people is not a valid number.`});
  }

  next();
}




// CRUD functions


// create new reservation, need to add middleware functions
async function create(req, res) {
  const data = req.body.data;
  const newReservation = await reservationsService.create(data);
  res.status(201).json({ data: newReservation });
}


async function list(req, res, next) {
  const { date } = req.query;
  const data = await reservationsService.listByDate(date);
  res.json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    asyncErrorBoundary(isValidData), 
    asyncErrorBoundary(hasValidFields), 
    asyncErrorBoundary(create)
  ],
};
