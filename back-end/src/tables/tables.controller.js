const tablesService = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");


// middleware functions

const REQUIRED_FIELDS = [
  "table_name",
  "capacity",
]


async function isValidData(req, res, next) {
  if (!req.body.data) {
    return next({ status: 400, message: "Missing input fields."})
  }

  next();
}

async function hasRequiredFields(req, res, next) {
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


module.exports = {
  create: [
    asyncErrorBoundary(isValidData),
    asyncErrorBoundary(hasRequiredFields),
    asyncErrorBoundary(create),
  ],
  list: asyncErrorBoundary(list),
}