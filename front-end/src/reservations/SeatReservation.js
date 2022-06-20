import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { listTables, updateSeatReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";


function SeatReservation() {
  const initialFormState = {
    table_id: "",
  }
  const [formData, setFormData] = useState(initialFormState);
  const [tables, setTables] = useState([]);
  const [error, setError] = useState(null);
  
  const history = useHistory();
  const { reservation_id } = useParams();
  
  function loadTables() {
    const abortController = new AbortController();
    listTables(abortController.signal)
      .then(setTables)
      .catch(setError);
    return () => abortController.abort();
  };

  useEffect(loadTables, []);

  const handleChange = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    updateSeatReservation(formData.table_id, reservation_id, abortController.signal)
      .then(() => history.push(`/dashboard`))
      .catch(setError);
    return () => abortController.signal;
  }

  const cancelHandler = () => {
    history.goBack();
  }

  return (
    <div>
      <h1 className="text-info text-center">Seat Reservation: {reservation_id}</h1>
      <h5 className="text-muted text-center">Choose a table for the reservation:</h5>
      <ErrorAlert error={error} />
      <form onSubmit={handleSubmit}>
        <label htmlFor="table_id" className="d-flex justify-content-center">
          <select
            id="table_id"
            name="table_id"
            onChange={handleChange}
            value={formData.table_id}
          >
            <option value="">-- Select a table --</option>
            {tables && tables.map((table) => (
              <option key={table.table_id} value={table.table_id} >
                {table.table_name} - {table.capacity} 
              </option>
            ))}
          </select>
        </label>
        <br />
        <div className="d-flex justify-content-center">
          <button type="button" className="btn btn-outline-secondary mx-2" onClick={cancelHandler}>Cancel</button>
          <button type="submit" className="btn btn-outline-info">Submit</button>
        </div>
      </form>
    </div>
  )
}


export default SeatReservation;