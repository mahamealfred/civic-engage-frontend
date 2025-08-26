import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { assignIssueToUserAction } from '../api/issuesController';
import { getUsersAction } from '../api/UserController';
import { useStateContext } from '../contexts/ContextProvider';

const AsignForm = () => {
  const navigate = useNavigate();
  const { userId } = useStateContext();
  const { issueId } = useParams();
  const location = useLocation();

  const [newIssue, setNewIssue] = useState({
    title: '',
    description: '',
    category: '',
    department: ''
  });

  const [message, setMessage] = useState(null);
  const [departmentData, setDepartmentData] = useState([]);

  const handleAssignIssue = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('access-token');
console.log("Event ...")
    try {
      const response = await assignIssueToUserAction(issueId, newIssue.department);

      if (response.responseCode === 200 || response.status === 201) {
        setMessage({ type: 'success', text: response.responseDescription || 'Issue assigned successfully' });

        setNewIssue({
          title: '',
          description: '',
          category: '',
          department: ''
        });

        // Auto-dismiss message
        setTimeout(() => setMessage(null), 3000);
        // Optional: navigate('/issues');
      } else {
        console.log("Event error ...",response)
        setMessage({ type: 'error', text: response.responseDescription || 'Something went wrong.' });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      const errMsg = error?.response?.data?.message || 'An error occurred. Please try again.';
      setMessage({ type: 'error', text: errMsg });
      setTimeout(() => setMessage(null), 3000);
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
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <form
        onSubmit={handleAssignIssue}
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
          marginBottom: '16px',
          fontWeight: 'bold',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '18px'
        }}>
          Allocate Issue to Staff Member
        </p>

        {/* ✅ Success/Error Message */}
        {message && (
          <div
            style={{
              padding: '10px',
              marginBottom: '20px',
              borderRadius: '4px',
              color: message.type === 'success' ? '#155724' : '#721c24',
              backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
              border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
              textAlign: 'center',
              fontWeight: 'bold',
            }}
          >
            {message.text}
          </div>
        )}

        <div style={{ marginBottom: '40px' }}>
          <label style={{ display: 'block', marginBottom: '14px', fontWeight: 'bold' }}>
            Select Staff:
          </label>
          <select
            value={newIssue.department}
            onChange={(e) => {
              setNewIssue({ ...newIssue, department: e.target.value });
              setMessage(null); // Clear old message on change
            }}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontSize: '16px',
            }}
            required
          >
            <option value="" disabled>Select a staff</option>
            {departmentData.map((staff) => (
              <option key={staff._id} value={staff._id}>
                {staff.firstName + " " + staff.lastName} - {staff.role}
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
          Assign Issue
        </button>
      </form>
    </div>
  );
};

export default AsignForm;
