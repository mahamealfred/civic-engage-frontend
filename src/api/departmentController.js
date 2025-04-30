import React from "react";
import axios from "axios";
// import { Buffer } from "buffer";

//Local Test APIs:
const base_localhost_getalldepartment = "http://localhost:5000/api/departments";



const  getDepartmentAction  = async() => {
  const serverResponse = {
    responseCode: "",
    responseDescription: "",
    communicationStatus: "",
    data:""
   
  };
  await axios
    .get( base_localhost_getalldepartment)
    .then((response) => {
      if (response.status === 200) {
        serverResponse.responseCode = response.status;
        serverResponse.responseDescription = response.data.message;
        serverResponse.data=response.data
      } else {
        serverResponse.responseDescription = response.error;
        serverResponse.responseCode = response.status;
      }
    })
    .catch((err) => {
       
        if (err.response.status == 400) {
            serverResponse.responseDescription = err.response.data.error;
            serverResponse.responseCode = err.response.status;
          }
          else if(err.response.status == 401){
            serverResponse.responseDescription = err.response.data.error;
            serverResponse.responseCode = err.response.status;
          }
          else{
            serverResponse.responseDescription = err.response.data.error;
            serverResponse.responseCode = err.response.status;
          } 
    });

  return serverResponse;
};



export {
    getDepartmentAction
};
