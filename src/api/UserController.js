

import React from "react";
import axios from "axios";
// import { Buffer } from "buffer";

//Local Test APIs:

const base_localhost_login = "http://localhost:5000/api/users/login";
const base_localhost_signup = "http://localhost:5000/api/users/register";


const loginAction = async (values) => {
  const serverResponse = {
    responseCode: "",
    responseDescription: "",
    communicationStatus: "",
    data:""
   
  };
  await axios
    .post(base_localhost_login,values)

    .then((response) => {
   
      if (response.status === 200) {
        serverResponse.responseCode = response.status;
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

const registerAction = async (values) => {
    const serverResponse = {
      responseCode: "",
      responseDescription: "",
      communicationStatus: "",
      data:""
     
    };
    await axios
      .post(base_localhost_signup,values)
  
      .then((response) => {
      
        if (response.status === 201) {
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
 loginAction,
 registerAction
  
};
