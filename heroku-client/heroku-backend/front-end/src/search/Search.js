import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { searchReservations } from "../utils/api";
import ReservationList from "../dashboard/ReservationList";
import ErrorAlert from "../layout/ErrorAlert";


function Search() {
  const initialFormState = {
    mobile_number: ""
  }

  const [formData, setFormData] = useState(initialFormState);
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);
  const history = useHistory();

  const handleChange = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    searchReservations(formData.mobile_number, abortController.signal)
      .then(setReservations)
      .catch(setError);
  }

  const cancelHandler = () => {
    history.goBack();
  }
  
  return (
    <div>
      <h1>Search Reservation</h1>
      <ErrorAlert error={error} />
      <form onSubmit={handleSubmit} >
        <label htmlFor="mobile_number">
          Mobile Number:
          <input
            name="mobile_number" 
            id="mobile_number"
            type="text"
            placeholder="555-555-5555"
            className="form-control"
            onChange={handleChange}
            value={formData.mobile_number}
          />
        </label>
        <br />
        <div>
          <button type="button" className="btn btn-secondary" onClick={cancelHandler}>Cancel</button>
          <button type="submit" className="btn btn-primary">Find</button>
        </div>
        <br />
        {reservations.length ? <h5>Results</h5> : <p>No reservations found</p>}
        {reservations && reservations.map((reservation) => (
          <ReservationList key={reservation.reservation_id} reservation={reservation} />
        ))}
      </form>
    </div>
  )
}


export default Search;