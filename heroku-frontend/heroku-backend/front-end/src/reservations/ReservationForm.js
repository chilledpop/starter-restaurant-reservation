import React from "react";


function ReservationForm({ handleSubmit, handleChange, cancelHandler, formData }) {
  return (
    <form onSubmit={handleSubmit} >
      <label htmlFor="first_name">
        First Name:
        <input
          id="first_name"
          type="text"
          className="form-control"
          placeholder="First name"
          name="first_name"
          onChange={handleChange}
          value={formData.first_name}
        />
      </label>
      <br />
      <label htmlFor="last_name">
        Last Name:
        <input
          id="last_name"
          type="text"
          className="form-control"
          placeholder="Last name"
          name="last_name"
          onChange={handleChange}
          value={formData.last_name}
        />
      </label>
      <br />
      <label htmlFor="mobile_number">
        Phone Number:
        <input
          id="mobile_number"
          type="tel"
          className="form-control"
          placeholder="xxx-xxx-xxxx"
          name="mobile_number"
          onChange={handleChange}
          value={formData.mobile_number}
        />
      </label>
      <br />
      <label htmlFor="reservation_date">
        Reservation Date:
        <input
          id="reservation_date"
          type="date"
          className="form-control"
          name="reservation_date"
          onChange={handleChange}
          value={formData.reservation_date}
        />
      </label>
      <br />
      <label htmlFor="reservation_time">
        Reservation Time:
        <input
          id="reservation_time"
          type="time"
          className="form-control"
          name="reservation_time"
          onChange={handleChange}
          value={formData.reservation_time}
        />
      </label>
      <br />
      <label htmlFor="people">
        Party Size:
        <input
          id="people"
          type="number"
          min="1"
          max="20"
          className="form-control"
          name="people"
          onChange={handleChange}
          value={formData.people}
        />
      </label>
      <br />
      <div>
        <button type="button" className="btn btn-secondary" onClick={cancelHandler}>Cancel</button>
        <button type="submit" className="btn btn-primary">Submit</button>
      </div>
    </form>
  );
}


export default ReservationForm;