import React from "react";
import axios from "axios";
// import { Buffer } from "buffer";

//Local Test APIs:
const base_localhost_getallcategory = "http://localhost:5000/api/categories";

const base_localhost_new_category= "http://localhost:5000/api/categories/new-category";

const addNewCategoryAction = async (values,token) => {

  const serverResponse = {
    responseCode: "",
    responseDescription: "",
    communicationStatus: "",
    data:""
   
  };
  await axios
    .post(base_localhost_new_category,values,{
      headers: {
        'Authorization': `Bearer ${token}` // Sending Bearer token
      }
    })

    .then((response) => {
    
      if (response.status === 201) {
        console.log("res:",response.data.message)
        serverResponse.responseCode = response.status;
        serverResponse.responseDescription = response.data.message;
        serverResponse.data=response.data.data
      } else {
        serverResponse.responseDescription = response.error;
        serverResponse.responseCode = response.status;
      }
    })
    .catch((err) => {
      console.log("res err:",err)
        if (err.response.status == 400) {
            serverResponse.responseDescription = err.response.data.msg;
            serverResponse.responseCode = err.response.status;
          }
          else if(err.response.status == 401){
            serverResponse.responseDescription = err.response.data.msg;
            serverResponse.responseCode = err.response.status;
          }
          else{
            serverResponse.responseDescription = err.response.data.msg;
            serverResponse.responseCode = err.response.status;
          } 
    });

  return serverResponse;
};

const getCategoryAction = async() => {
  const serverResponse = {
    responseCode: "",
    responseDescription: "",
    communicationStatus: "",
    data:""
   
  };
  await axios
    .get( base_localhost_getallcategory)
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
    getCategoryAction,
    addNewCategoryAction
  
};
