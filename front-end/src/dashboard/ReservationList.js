import React from "react";
import { Link } from "react-router-dom";

function ReservationList({ reservation }) {
  return (
    <div className="card col-lg-4">
      <div className="card-body">
        <h5 className="card-title">{reservation.first_name} {reservation.last_name}</h5>
        <h6 className="card-subtitle mb-2 text-muted">Phone Number: {reservation.mobile_number}</h6>
        <p className="card-text">Time: {reservation.reservation_time}</p>
        <p className="card-text">
          Party Size: {reservation.people}
        </p>
        <Link className="btn btn-outline-info"to={`/reservations/${reservation.reservation_id}/seat`}>Seat</Link>
      </div>
    </div>
  )
}


export default ReservationList;