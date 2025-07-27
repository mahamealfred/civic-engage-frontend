
import React from "react";
import axios from "axios";
// import { Buffer } from "buffer";

//Local Test APIs:

const base_localhost_getallIssues = "http://localhost:5000/api/issues";
const base_localhost_deleteUser="http://localhost:5000/api/users/"
const base_localhost_addUser="http://localhost:5000/api/issues"
const base_localhost_getallDepartments="http://localhost:5000/api/departments"
const base_localhost_getallIssuesByUserId="http://localhost:5000/api/issues/creator"
const base_localhost_getAssignedIssues="http://localhost:5000/api/issues/assigned-to/"
const base_localhost_assignIssue="http://localhost:5000/api/issues/assign"


const addNewAction = async (values,token) => {
 
  const serverResponse = {
    responseCode: "",
    responseDescription: "",
    communicationStatus: "",
    data:""
   
  };
  await axios
    .post(base_localhost_addUser,values,{
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

//Assign isuue to a user

const assignIssueToUserAction = async (issueId,userId) => {
 
  const serverResponse = {
    responseCode: "",
    responseDescription: "",
    communicationStatus: "",
    data:""
   
  };
  await axios
    .post(base_localhost_assignIssue+"/"+issueId+"/"+userId,{
      headers: {
       // 'Authorization': `Bearer ${token}` // Sending Bearer token
      }
    })

    .then((response) => {
    
      if (response.status === 200) {

        serverResponse.responseCode = response.status;
        serverResponse.responseDescription = response.data.message;
        serverResponse.data=response.data.data
      } else {
        serverResponse.responseDescription = response.error;
        serverResponse.responseCode = response.status;
      }
    })
    .catch((err) => {
  
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

const getIssuesAction = async() => {
  const serverResponse = {
    responseCode: "",
    responseDescription: "",
    communicationStatus: "",
    data:""
   
  };
  await axios
    .get( base_localhost_getallIssues)

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


const getAssignedIssuesAction = async(id) => {
  const serverResponse = {
    responseCode: "",
    responseDescription: "",
    communicationStatus: "",
    data:""
   
  };
  await axios
    .get( base_localhost_getAssignedIssues+id)

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

const getIssuesByCreatorIDAction = async(id) => {
  const serverResponse = {
    responseCode: "",
    responseDescription: "",
    communicationStatus: "",
    data:""
   
  };
  await axios
    .get( base_localhost_getallIssuesByUserId+"/"+id)

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
const getDepartmentAction = async() => {
  const serverResponse = {
    responseCode: "",
    responseDescription: "",
    communicationStatus: "",
    data:""
   
  };
  await axios
    .get( base_localhost_getallDepartments)

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
 
const  getIssuesByUserIdAction = async(id) => {
  const serverResponse = {
    responseCode: "",
    responseDescription: "",
    communicationStatus: "",
    data:""
   
  };
  await axios
    .get( base_localhost_getAssignedIssues+id)

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
const  deleteUserAction = async (id) => {
  const serverResponse = {
    responseCode: "",
    responseDescription: "",
    communicationStatus: "",
    data:""
   
  };
  await axios
    .delete(base_localhost_deleteUser+id)

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

 getIssuesAction,
 addNewAction,
 getIssuesByCreatorIDAction,
 getAssignedIssuesAction,
 getIssuesByUserIdAction,
 assignIssueToUserAction
  
};
