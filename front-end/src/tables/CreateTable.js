import React, { useState } from "react";
import { useHistory } from "react-router";
import createTable from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";


function CreateTable() {
  const initialFormState = {
    table_name: "",
    capacity: "",
  }

  const [formData, setFormData] = useState(initialFormState);
  const [error, setError] = useState(null);
  const history = useHistory();


  const handleChange = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.id === "capacity" ? target.valueAsNumber : target.value, 
    });
    console.log(formData.capacity, typeof formData.capacity)
    console.log(formData.table_name)
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    createTable(formData)
      .then(() => history.push("/dashboard"))
      .catch((error) => {
        setError(error);
      })
  }

  const cancelHandler = () => {
    history.goBack();
  }

  return (
    <div>
      <h2>Create New Table</h2>
      <ErrorAlert error={error} />
      <div>
        <form onSubmit={handleSubmit} >
          <label htmlFor="table_name">
            Table Name
            <input 
              id="table_name"
              type="text"
              className="form-control"
              name="table_name"
              onChange={handleChange}
              value={formData.table_name}
            />
          </label>
          <br />
          <label htmlFor="capacity">
            Capacity
            <input
              id="capacity"
              type="number"
              min="1"
              className="form-control"
              name="capacity"
              onChange={handleChange}
              value={formData.capacity}
            />
          </label>
          <br />
          <div>
            <button type="button" className="btn btn-secondary" onClick={cancelHandler}>Cancel</button>
            <button type="submit" className="btn btn-primary">Submit</button> 
          </div>
        </form>
      </div>
    </div>
  )
}


export default CreateTable;