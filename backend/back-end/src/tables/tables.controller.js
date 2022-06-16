const tablesService = require("./tables.service");
const reservationsService = require("../reservations/reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");


// middleware functions

const REQUIRED_FIELDS = [
  "table_name",
  "capacity",
]

const VALID_FIELDS = [
  "reservation_id",
]


function isValidData(req, res, next) {
  if (!req.body.data) {
    return next({ status: 400, message: "Missing input fields."})
  }

  next();
}

function hasRequiredFields(req, res, next) {
  for (const field of REQUIRED_FIELDS) {
    if (!req.body.data[field]) {
      return next({ status: 400, message: `Missing field: ${field}.`});
    }
  }

  const { table_name, capacity } = req.body.data;

  if (table_name.length < 2) {
    return next({ status: 400, message: "table_name must be at least 2 characters long."})
  }

  if (typeof capacity !== "number") {
    return next({ status: 400, message: "capacity must be a number."})
  }

  res.locals.table = req.body.data;
  next();
}

function hasValidFields(req, res, next) {
  for (const field of VALID_FIELDS) {
    if (!req.body.data[field]) {
      return next({ status: 400, message: `Missing field: ${field}.`});
    }
  }

  next();
}

async function tableExists(req, res, next) {
  const { table_id } = req.params;
  const table = await tablesService.read(table_id);

  if (!table) {
    return next({ status: 404, message: `Table ${table_id} does not exist.`});
  }

  res.locals.table = table;

  next();
}

async function reservationExists(req, res, next) {
  const { reservation_id } = req.body.data;
  const reservation = await reservationsService.read(reservation_id);
  if (!reservation) {
    return next({ status: 404, message: `Reservation ${reservation_id} does not exist.`});
  }
  
  res.locals.reservation = reservation;
  
  next();
}

function tableCapacity(req, res, next) {
  const { capacity } = res.locals.table;
  const { people } = res.locals.reservation;

  if (capacity < people) {
    return next({ status: 400, message: `Number of people exceeds table capacity.`});
  }

  next();
}


function tableOccupied(req, res, next) {
  const table = res.locals.table;
  if (table.status === "Occupied") {
    return next({ status: 400, message: `Table is currently occupied.`});
  }

  next();
}

function tableNotOccupied(req, res, next) {
  const table = res.locals.table;
  if (!table.reservation_id) {
    return next({ status: 400, message: `Table is not occupied.`});
  }

  next();
}

function checkResStatus(req, res, next) {
  const { reservation } = res.locals;
  if (reservation.status === "seated") {
    return next({ status: 400, message: `Reservation is already seated.`});
  } 

  next();
}

// CRUD functions

async function create(req, res) {
  const table = res.locals.table;
  const newTable = await tablesService.create(table);
  res.status(201).json({ data: newTable });
}

async function list(req, res) {
  const tables = await tablesService.list();
  res.status(200).json({ data: tables });
}

async function updateSeatReservation(req, res) {
  const { table, reservation } = res.locals;
  table.reservation_id = reservation.reservation_id;
  table.status = "Occupied";
  reservation.status = "seated";

  const updatedTable = await tablesService.update(table);
  await reservationsService.update(reservation);
  res.json({ data: updatedTable });
}

async function finishTable(req, res) {
  const { table } = res.locals;

  const updatedReservation = {
    status: "finished",
    reservation_id: table.reservation_id,
  }
  await reservationsService.update(updatedReservation);

  table.reservation_id = null;
  table.status = "Free";

  const updatedTable = await tablesService.update(table);
  res.status(200).json({ data: updatedTable });
}


module.exports = {
  create: [
    isValidData,
    hasRequiredFields,
    asyncErrorBoundary(create),
  ],
  list: asyncErrorBoundary(list),
  update: [
    isValidData,
    hasValidFields,
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(reservationExists),
    tableCapacity,
    tableOccupied,
    checkResStatus,
    asyncErrorBoundary(updateSeatReservation),
  ],
  delete: [
    asyncErrorBoundary(tableExists),
    tableNotOccupied,
    asyncErrorBoundary(finishTable),
  ]
}