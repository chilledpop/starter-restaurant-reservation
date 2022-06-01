import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { previous, today, next } from "../utils/date-time";
import useQuery from "../utils/useQuery";
import ReservationList from "./ReservationList";
import TablesList from "./TablesList";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard() {
  const query = useQuery();

  const [date, setDate] = useState(query.get("date") || today());
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    setTablesError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTables(abortController.signal)
      .then(setTables)
      .catch(setTablesError);
    return () => abortController.abort();
  }

  const handleChange = ({ target }) => {
    setDate(target.value);
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div>
        <button type="button" className="btn btn-info" onClick={() => setDate(previous(date))}>Previous</button>
        <button type="button" className="btn btn-info" onClick={() => setDate(today())}>Today</button>
        <button type="button" className="btn btn-info" onClick={() => setDate(next(date))}>Next</button>
      </div>
      <br/>
      <label htmlFor="reservation_date">
        <input
          id="reservation_date"
          name="reservation_date"
          type="date"
          value={date}
          onChange={handleChange}
        />
      </label>
      <br/>
      <ErrorAlert error={reservationsError} />
      <div>
        <div className="d-md-flex mb-3">
          {reservations.length ? <h5>Reservations</h5> : `There are no reservations for ${date}.`}
        </div>
        {reservations.map((reservation) => (
          <ReservationList key={reservation.reservation_id} reservation={reservation} />
        ))}
      </div>
      <br />
      <ErrorAlert error={tablesError} />
      <div>
        <div className="d-md-flex mb-3">
          {tables.length ? <h5>Tables</h5> : `There are no tables.`}
        </div>
        {tables.map((table) => (
          <TablesList key={table.table_id} table={table} />
        ))}
      </div>
    </main>
  );
}

export default Dashboard;
