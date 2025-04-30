import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addNewUserAction } from '../api/UserController';

const NewUserForm = () => {
  const navigate = useNavigate();
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'Staff' // Default role
  });
  const [message, setMessage] = useState(null);

  const handleAddNewUser = async (event) => {
    event.preventDefault();
   
    try {
      const response = await addNewUserAction(newUser);
    
      if (response.responseCode === 201) {
        setMessage({ type: 'success', text: response.responseDescription });
        setNewUser({
          firstName: '',
          lastName: '',
          email: '',
          role: 'Staff' // Reset to default role
        });
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
        onSubmit={handleAddNewUser}
        style={{
          backgroundColor: '#f9f9f9',
          padding: '30px',
          borderRadius: '8px',
          boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.1)',
          maxWidth: '400px',
          width: '100%',
          fontFamily: 'Arial, sans-serif'
        }}
      >
        <div style={{ marginBottom: '20px' }}>
        <p style={{ 
          display: 'block', 
          marginBottom: '4px', 
          fontWeight: 'bold',
          display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}
      >
        New Staff Form
      </p>
          {message && (
            <div className={`mb-4 text-center p-2 rounded-lg ${message.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
              {message.text}
            </div>
          )}
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            First Name:
          </label>
          <input
            type="text"
            value={newUser.firstName}
            onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
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
            Last Name:
          </label>
          <input
            type="text"
            value={newUser.lastName}
            onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
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
            Email:
          </label>
          <input
            type="email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
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
            Role:
          </label>
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontSize: '16px',
            }}
          >
            <option value="Admin">Admin</option>
            <option value="Analyst">Analyst</option>
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
          Add New Staff
        </button>
      </form>
    </div>
  );
};

export default NewUserForm;
