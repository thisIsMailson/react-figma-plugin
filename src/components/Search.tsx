import React, { useState } from "react";
import { fetchNyTimesSearch, sendJsonMessage } from "./../utils/";
import { Form } from "./Form";
import { FILL_RESULTS } from "../messages";

export const Search = () => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const handleSubmit = async (formFields) => {
    console.log("formFields", "submited");
  };
  return (
    <div>
      <Form
        loading={loading}
        onSubmit={handleSubmit}
        errorMsg={errorMsg}
        fields={[
          {
            name: "q",
            placeholder: "Search NY Times...",
            type: "text",
          },
        ]}
      />
    </div>
  );
};
