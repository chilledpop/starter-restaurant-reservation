import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import ReservationForm from "./ReservationForm";
import { readReservation, updateReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";


function EditReservation() {
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
  const { reservation_id } = useParams();

  useEffect(() => {
    const abortController = new AbortController();
    readReservation(reservation_id, abortController.signal)
      .then((reservationFromAPI) => {
        setFormData({...reservationFromAPI});
      })
      .catch(setError);
    return () => abortController.abort();
  }, [reservation_id]);

  const handleChange = ({ target }) => {
    const fieldValue = (target.id === 'people') ? target.valueAsNumber : target.value
    setFormData({
      ...formData,
      [target.name]: fieldValue, 
    });
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    updateReservation(formData, abortController.signal)
      .then(history.goBack())
      .catch(setError);
    return () => abortController.abort();
  }

  const cancelHandler = () => {
    history.goBack();
  }

  return (
    <div>
      <h2>Edit Reservation {reservation_id}</h2>
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

export default EditReservation;