/**
 * List handler for reservation resources
 */

const reservationsService = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");


// VALIDATION MIDDLEWARE
const REQUIRED_FIELDS = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
]

// checks that the request body is not empty
function isValidData(req, res, next) {
  if (!req.body.data) {
    return next({ status: 400, message: "Missing input fields."})
  }

  next();
}

// checks the request body for the required fields to create a reservation
function hasRequiredFields(req, res, next) {
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

  if ((typeof people !== 'number') || isNaN(people)) {
    return next({ status: 400, message: `people is not a valid number.`});
  }

  res.locals.reservation = req.body.data;
  next();
}

// checks that the reservation date is in the future and not on a Tuesday
function validDate(req, res, next) {
  const { reservation_date, reservation_time } = res.locals.reservation;

  const reserveDate = new Date(reservation_date + "T" + reservation_time);
  const today = new Date();

  if(reserveDate.getDay() === 2) {
    return next({ status: 400, message: `The restaurant is closed on Tuesdays.`});
  }

  if(reserveDate < today) {
    return next({ status: 400, message: `The reservation time and date must be in the future.`});
  }

  next();
}

// verifies that the reservation time is during operating hours
function duringBusinessHours(req, res, next) {
  const { reservation_time } = res.locals.reservation;
  const time = Number(reservation_time.replace(":", ""));
    
  if (time < 1030) {
    return next({ status: 400, message: `The restaurant is not open until 10:30am.`});
  }

  if (time > 2130) {
    return next({ status: 400, message: `The restaurant closes at 10:30pm.`})
  }

  next();
}

// verifies the existence of the reservation 
async function reservationExists(req, res, next) {
  const { reservation_id } = req.params;
  const reservation = await reservationsService.read(reservation_id);

  if (!reservation) {
    return next({ status: 404, message: `Reservation ${reservation_id} does not exist.`});
  }

  res.locals.reservation = reservation;

  next();
}

// verifies that the status is only booked before creating the reservation
function statusOnlyBooked(req, res, next) {
  const { status } = req.body.data;

  if (status && status !== "booked") {
    return next({ status: 400, message: `Status cannot be ${status} for new reservations.`})
  }

  next();
}

// checks that the reservation has a valid status
function validStatus(req, res, next) {
  const { status } = req.body.data;

  if (status !== "booked" && status !== "seated" && status !== "finished") {
    return next({ status: 400, message: `unknown status. status must be booked, seated, or finished.`})
  }

  next();
}

// verifies that the reservation is not finished before updating the status 
function statusNotFinished(req, res, next) {
  const { reservation } = res.locals;

  if (reservation.status === "finished") {
    return next({ status: 400, message: `Reservation status is already finished and cannot be updated.`});
  }

  next();
}


// checks request query for either a date or phone number
async function queryInput(req, res, next) {
  const { date, mobile_number } = req.query;

  if (date) {
    res.locals.reservations = await reservationsService.list(date);
    next();
  }

  if (mobile_number) {
    res.locals.reservations = await reservationsService.search(mobile_number);
    next();
  }

  return next({ status: 400, message: `No query found.`});
}



// CRUD FUNCTIONS


// creates a new reservation
async function create(req, res) {
  const data = req.body.data;
  const newReservation = await reservationsService.create(data);
  res.status(201).json({ data: newReservation });
}

// lists all reservations
function list(req, res) {
  const { reservations } = res.locals;
  res.json({ data: reservations });
}

// returns reservation matching the reservation_id
function read(req, res) {
  const reservation = res.locals.reservation;
  res.json({ data: reservation });
}

// updates a reservation's status 
async function updateResStatus(req, res) {
  const { reservation } = res.locals;
  const updatedStatus = { 
    ...req.body.data,
    reservation_id: reservation.reservation_id,
  }

  const data = await reservationsService.update(updatedStatus);
  res.json({ data: data });
}


module.exports = {
  list: [
    asyncErrorBoundary(queryInput),
    list,
  ],
  create: [
    isValidData, 
    hasRequiredFields, 
    validDate,
    duringBusinessHours,
    statusOnlyBooked,
    asyncErrorBoundary(create),
  ],
  read: [
    asyncErrorBoundary(reservationExists),
    read,
  ],
  updateResStatus: [
    asyncErrorBoundary(reservationExists),
    validStatus,
    statusNotFinished,
    asyncErrorBoundary(updateResStatus),
  ]
};
