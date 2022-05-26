import React, { useState } from "react";
import { useHistory } from "react-router";
import ReservationForm from "./ReservationForm";
import createReservation from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";


function CreateReservation() {
  const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  }

  const [formData, setFormData] = useState(initialFormState);
  const [error, setError] = useState(null);
  const history = useHistory();

  const handleChange = ({ target }) => {
    const fieldValue = (target.id === 'people') ? target.valueAsNumber : target.value
    setFormData({
      ...formData,
      [target.name]: fieldValue, 
    });
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    createReservation(formData)
      .then(() => history.push(`/dashboard?date=${formData.reservation_date}`))
      .catch((error) => {
        setError(error);
      })
  }


  const cancelHandler = () => {
    history.goBack();
  }

  return (
    <div>
      <h2>Create New Reservation</h2>
      <ErrorAlert error={error} />
      <ReservationForm 
        handleSubmit={handleSubmit} 
        handleChange={handleChange} 
        cancelHandler={cancelHandler}
        formData={formData}
      />
    </div>
  )
}


export default CreateReservation;