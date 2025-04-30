import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { addNewAction } from '../api/issuesController';
import { getCategoryAction } from '../api/categoryController';
import { getDepartmentAction } from '../api/departmentController';
import { getUsersAction } from '../api/UserController';
import { useParams } from 'react-router-dom';

const AsignForm = () => {
const navigate=useNavigate()
let isMounted = true;
  const [newIssue, setNewIssue] = useState({
    title: '',
    description: '',
    category:'',
    department:''
   // status: 'open',  // Default status
  });
  const [message, setMessage] = useState(null);
  const [categoryData,setCategoryData]=useState([])
  const [departmentData,setDepartmentData]=useState([])
  const location = useLocation();
  const { issueId } = useParams()



  const handleAddNewIssue = async(event) => {
    event.preventDefault(); // Prevent default form submission
    // Your logic to add a new issue here
    const token=localStorage.getItem('access-token')
    try {
      const response = await addNewAction(newIssue,token);
    
      if (response.responseCode === 201) {
        setMessage({ type: 'success', text: response.responseDescription });
       // resetForm()
       setNewIssue({
        title: '',
        description: ''
       // status: 'open',  // Default status
      });
        //navigate('/issues')
      } else {
        setMessage({ type: 'error', text: response.responseDescription });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    }

  };

  

  const fetchUsers = async () => {
    try {
      const response = await getUsersAction();

      if (response.responseCode === 200) {
        const staff = response.data.filter(user => user.role === 'Analyst');
        setDepartmentData(staff);
      } 
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  
  
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
    
    <form
      onSubmit={handleAddNewIssue}
      style={{
        backgroundColor: '#f9f9f9',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.1)',
        maxWidth: '400px',
        width: '100%',
        fontFamily: 'Arial, sans-serif'
      }}
    >
      <p style={{ 
          display: 'block', 
          marginBottom: '4px', 
          fontWeight: 'bold',
          display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}
      >
       Allocate  Issue to Staff Member
      </p>
   
      
      <div style={{ marginBottom: '40px' }}>
        <label style={{ display: 'block', marginBottom: '14px', fontWeight: 'bold' }}>
         Select  Staff:
        </label>
        <select
          value={newIssue.department}
          onChange={(e) => setNewIssue({ ...newIssue, department: e.target.value })}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            fontSize: '16px',
          }}
        >
           <option value="" disabled>Select a staff</option>
         {departmentData.map((staff) => (
          <option key={staff._id} value={staff._id}>
            {staff.firstName+" "+staff.lastName} - {staff.role}
          </option>
        ))}
        </select>
      </div> 
      
     
  
      <button
        type="submit"
        style={{
          backgroundColor: '#28a745',
          color: '#fff',
          padding: '12px',
          width: '100%',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px',
          border: 'none',
        }}
      >
        Asign Issue
      </button>
    </form>
  </div>
  
  )
}

export default AsignForm