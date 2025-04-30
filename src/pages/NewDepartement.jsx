import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addNewAction } from '../api/issuesController';
import { addNewCategoryAction } from '../api/categoryController';

const NewDepartmentForm = () => {
const navigate=useNavigate()
  const [newIssue, setNewIssue] = useState({
    name: '',
    description: ''
   // status: 'open',  // Default status
  });
  const [message, setMessage] = useState(null);

  const handleAddNewIssue = async(event) => {
    event.preventDefault(); // Prevent default form submission
    // Your logic to add a new issue here
    const token=localStorage.getItem('access-token')
    try {
      const response = await addNewCategoryAction(newIssue,token);
    
      if (response.responseCode === 201) {
        setMessage({ type: 'success', text: response.responseDescription });
       // resetForm()
       setNewIssue({
        name: '',
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
        New Department
      </p>
   
      <div style={{ marginBottom: '20px' }}>
      {message && (
            <div className={`mb-4 text-center p-2 rounded-lg ${message.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
              {message.text}
            </div>
          )}
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Name:
        </label>
        <input
          type="text"
          value={newIssue.name}
          onChange={(e) => setNewIssue({ ...newIssue, name: e.target.value })}
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
          Description:
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
  
      {/* <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Status:
        </label>
        <select
          value={newIssue.status}
          onChange={(e) => setNewIssue({ ...newIssue, status: e.target.value })}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            fontSize: '16px',
          }}
        >
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="closed">Closed</option>
        </select>
      </div> */}
  
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
        Submit
      </button>
    </form>
  </div>
  
  )
}

export default NewDepartmentForm