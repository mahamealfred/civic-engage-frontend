import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addNewAction } from '../api/issuesController';
import { getCategoryAction } from '../api/categoryController';
import { getDepartmentAction } from '../api/departmentController';

const NewIssueForm = () => {
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

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await getCategoryAction();
        if (isMounted && response?.data) {
          console.log("Dta",categoryData)
          setCategoryData(response.data); 
        }
      } catch (error) {
        console.log(error);
      }
    };
  
    fetchIssues();  // Call the async function
  }, []);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await getDepartmentAction();
        if (isMounted && response?.data) {
         
          setDepartmentData(response.data); 
        }
      } catch (error) {
        console.log(error);
      }
    };
  
    fetchIssues();  // Call the async function
  }, []);
  
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    
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
        New Issue
      </p>
   
      <div style={{ marginBottom: '20px' }}>
      {message && (
            <div className={`mb-4 text-center p-2 rounded-lg ${message.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
              {message.text}
            </div>
          )}
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Title:
        </label>
        <input
          type="text"
          value={newIssue.title}
          onChange={(e) => setNewIssue({ ...newIssue, title: e.target.value })}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            fontSize: '16px',
          }}
        />
      </div>
  
      
  
      <div style={{ marginBottom: '20px' }}>
      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
        Select Category:
      </label>
      <select
        value={newIssue.category}
        onChange={(e) => setNewIssue({ ...newIssue, category: e.target.value })}
        style={{
          width: '100%',
          padding: '10px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          fontSize: '16px',
        }}
      >
        <option value="" disabled>Select a category</option>
        {categoryData.map((category) => (
          <option key={category._id} value={category._id}>
            {category.name} - {category.description}
          </option>
        ))}
      </select>
    </div>
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
         Select  Department:
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
           <option value="" disabled>Select a department</option>
         {departmentData.map((department) => (
          <option key={department._id} value={department._id}>
            {department.name} - {department.description}
          </option>
        ))}
        </select>
      </div> 
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Enter you issue:
        </label>
        <textarea
          value={newIssue.description}
          onChange={(e) => setNewIssue({ ...newIssue, description: e.target.value })}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            fontSize: '16px',
          }}
        />
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
        Send
      </button>
    </form>
  </div>
  
  )
}

export default NewIssueForm