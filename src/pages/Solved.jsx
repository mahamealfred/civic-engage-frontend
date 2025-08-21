import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GridComponent, ColumnsDirective, ColumnDirective, Resize, Sort, ContextMenu, Filter, Page, ExcelExport, PdfExport, Edit, Inject, Toolbar } from '@syncfusion/ej2-react-grids';
import { DialogComponent } from '@syncfusion/ej2-react-popups'; // Import DialogComponent
import { Header } from '../components';
import Editor from "./Editor";
import { getIssuesAction } from '../api/issuesController';
import { getUsersAction } from '../api/UserController';
import IssuesReport from '../components/IssuesReport';

const Solved= () => {
  const [dialogVisible, setDialogVisible] = useState(false);  // State to control view dialog visibility
  const [addDialogVisible, setAddDialogVisible] = useState(false);  // State to control add new issue dialog visibility
  const [selectedIssue, setSelectedIssue] = useState(null);   // State to store selected issue details
  const [issuesData, setIssuesData] = useState([])
  const [dialogAsignVisible, setDialogAsignVisible] = useState(false);
  const [usersData, setUsersData] = useState([]);
  const [showReport, setShowReport] = useState(false);
  let isMounted = true;
  const navigate = useNavigate() 
  const [newIssue, setNewIssue] = useState({
    title: '',
    description: '',
    status: 'open',  // Default status
  });

  const localData=JSON.parse(localStorage.getItem('userData'))
   
  const fetchUsers = async () => {
    try {
      const response = await getUsersAction();
      if (response.responseCode === 200) {
        const staff = response.data.filter(user => user.role === 'Staff');
        if (isMounted) {
        setUsersData(staff);
        }
      } 
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
  
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await getIssuesAction();
        if (isMounted && response?.data) {
          const filteredIssues = response.data.filter(issue => issue.status === 'solved'); // Filter for 'in-progress' status
          setIssuesData(filteredIssues);
        }
      } catch (error) {
        console.log(error);
      }
    };
  
    fetchIssues();
  }, []);
  
const gridRef = useRef(null); // Using ref to store the GridComponent
  const contextMenuItems = ['AutoFit', 'AutoFitAll', 'SortAscending', 'SortDescending', 'Edit', 'Delete', 'PdfExport', 'ExcelExport'];
  const editing = { allowDeleting: true, allowEditing: true };
  const toolbarOptions =['Search', 'PdfExport', 'ExcelExport', 'Delete'];

  const handleToolbarClick = async(args) => {
 

    console.log("data:",args.item.id)
  if (args.item.id === 'gridcomp_excelexport') {
 
    try {
      if (gridRef.current) {
        await gridRef.current.excelExport();
      } else {
        console.error("Grid reference is not set.");
      }
    } catch (error) {
      console.error("Error generating excel:", error.message || error);
    }
  }
  if (args.item.id === 'addDepartment') {
    setAddDialogVisible(true)
    
  }
    if (args.item.id === 'gridcomp_pdfexport') {
      const pdfExportProperties = {
        header: {
          contents: [
            // Top border line
            {
              type: 'Line',
              style: { penColor: '#000080', penSize: 2, dashStyle: 'Solid' },
              points: { x1: 0, y1: 4, x2: 685, y2: 4 },
            },
            // Company/Project Name
            {
              type: 'Text',
              value: 'CivicEngage',
              position: { x: 40, y: 30 },
              style: { textBrushColor: '#000000', fontSize: 30, bold: true, fontFamily: 'Arial' },
            },
            // Report Title
            {
              type: 'Text',
              value: 'List of Opened Issues',
              position: { x: 240, y: 50 },
              style: { textBrushColor: '#000000', fontSize: 22, bold: true },
            },
            // Date & Time (Dynamic)
            {
              type: 'Text',
              value: `Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
              position: { x: 400, y: 30 },
              style: { textBrushColor: '#333333', fontSize: 12, italic: true },
            },
            // Optional Logo (Uncomment if needed)
            // {
            //   type: 'Image',
            //   src: image,  // Replace with actual image path or base64
            //   position: { x: 40, y: 10 },
            //   size: { height: 50, width: 50 },
            // },
          ],
          fromTop: 0,
          height: 140,
        },
      
        footer: {
          contents: [
            // Footer separating line
            {
              type: 'Line',
              style: { penColor: '#000080', penSize: 1.5, dashStyle: 'Dash' },
              points: { x1: 0, y1: 4, x2: 685, y2: 4 },
            },
            // Page number
            {
              type: 'Text',
              value: 'Page {$current} of {$total}',
              position: { x: 330, y: 20 },
              style: { fontSize: 14, textBrushColor: '#4169e1', bold: true },
            },
            // Copyright Information
            {
              type: 'Text',
              value: '© 2025 CivicEngage. All rights reserved.',
              position: { x: 40, y: 35 },
              style: { fontSize: 12, textBrushColor: '#666666', italic: true },
            },
          ],
          fromBottom: 100,
          height: 80,
        },
      };
  
      try {
        if (gridRef.current) {
          await gridRef.current.pdfExport(pdfExportProperties);
        } else {
          console.error("Grid reference is not set.");
        }
      } catch (error) {
        console.error("Error generating PDF:", error.message || error);
      }
    }

  };

  const handleActionBegin = (args) => {
    if (args.requestType === 'delete') {
      const deletedId = args.data[0]._id;
      console.log('Delete issue with ID:', deletedId);
      // Make an API call to delete the issue by ID
    }
  };
  const handleAddNewIssue = (event) => {
    event.preventDefault(); // Prevent default form submission
    // Your logic to add a new issue here
    console.log('handleAddNewIssue called');
    console.log('New issue details:', newIssue);
    // Make API call to add the new issue here
    setAddDialogVisible(false);
  };


  // Template for rendering colored status
  const statusTemplate = (props) => {
    let statusColor;

    switch (props.status) {
      case 'open':
        statusColor = 'green';
        break;
      case 'in-progress':
        statusColor = 'orange';
        break;
      case 'closed':
        statusColor = 'red';
        break;
      default:
        statusColor = 'gray';
    }

    return (
      <span style={{ color: statusColor, fontWeight: 'bold' }}>
        {props.status}
      </span>
    );
  };

  const viewButtonTemplate = (props) => {
    return (
      <>
        <button
          onClick={() => handleViewClick(props).then(() => {
            // Add any success handling if needed
          }).catch((error) => {
            console.error("Error handling view click: ", error);
          })}
          className="bg-blue-500 text-white px-2 py-1 rounded"
        >
          View
        </button>
  
        {localData?.role === 'Analyst' && (
          <button
            onClick={() => handleAsignClick(props).then(() => {
              // Add any success handling if needed
            }).catch((error) => {
              console.error("Error handling assign click: ", error);
            })}
            className="bg-blue-500 text-white px-2 py-1 rounded"
          >
            Update Status
          </button>
        )}
  
        {/* {localData?.role === 'Admin' && (
          <Link
            to={{ pathname: '/asign', state: { ...props } }}
            className="bg-blue-500 text-white px-2 py-1 rounded"
          >
            Asign
          </Link>
        )} */}
      </>
    );
  };
  

  const handleViewClick = (props) => {
    setSelectedIssue(props);  // Store the selected issue data
    setDialogVisible(true);   // Show the dialog

  };


  const handleAsignClick = (event, props) => {
    event.preventDefault(); // Prevent the default form submission if inside a form
    console.log("assigned props:", props);
    navigate('/asign', { state: { ...props } });
  };

  const handleCloseDialog = () => {
    setDialogVisible(false);
 
    setSelectedIssue(null);
  };
  const handleCloseDialogAsign=()=>{
    setDialogAsignVisible(false)
  }

  const handleCloseAddDialog = () => {
    setAddDialogVisible(false);
  };
const handleSubmitAsign=(event)=>{
  event.preventDefault(); 
  console.log("....")
}
  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Page" title="Issues" />
       {/* Report Button */}
      <div style={{ marginBottom: "15px" }}>
        <button
          onClick={() => setShowReport(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Generate Report
        </button>
      </div>
      <GridComponent
        id="gridcomp"
        dataSource={issuesData || []} 
        allowPaging
        allowSorting
        allowExcelExport
        allowPdfExport
        contextMenuItems={contextMenuItems}
        editSettings={editing}
        toolbar={toolbarOptions}
        actionBegin={handleActionBegin}
        toolbarClick={handleToolbarClick}
        ref={gridRef}
      >
        <ColumnsDirective>
          <ColumnDirective field="_id" headerText="ID" width="120" isPrimaryKey={true} visible={false} />
          <ColumnDirective field="title" headerText="Title" width="200" />
          <ColumnDirective field="description" headerText="Message" width="250" />
          <ColumnDirective field="status" headerText="Status" width="100" template={statusTemplate} />
          <ColumnDirective field="creator.firstName" headerText="Creator First Name" width="150" />
         
          <ColumnDirective
            headerText="Actions"
            width="150"
            template={viewButtonTemplate} 
          />
        </ColumnsDirective>
        <Inject services={[Resize, Sort, ContextMenu, Filter, Page, ExcelExport, Edit, PdfExport, Toolbar]} />
      </GridComponent>
      {/* Dialog box for displaying selected issue details */}
      <DialogComponent
        width="800px"
        visible={dialogVisible}
        header="Issue Details"
        isModal={true}
        showCloseIcon={true}
        close={handleCloseDialog} // Handle dialog close
      >
        {selectedIssue  && (
          <div key={selectedIssue._id} style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <p style={{ margin: '10px 0', lineHeight: '1.5', color: '#333' }}>
              <strong>Title:</strong> {selectedIssue.title}
            </p>
            <p style={{ margin: '10px 0', lineHeight: '1.5', color: '#333' }}>
              <strong>Message:</strong> {selectedIssue.description}
            </p>
            <p style={{ margin: '10px 0', lineHeight: '1.5', color: 'green', fontWeight: 'bold' }}>
              <strong>Status:</strong> {selectedIssue.status}
            </p>
            <p style={{ margin: '10px 0', lineHeight: '1.5', color: '#333' }}>
              <strong>Sender:</strong> {selectedIssue.creator.firstName} {selectedIssue.creator.lastName}
            </p>
            
            {/* <Editor /> */}
          </div>
        )}
      </DialogComponent>
      <DialogComponent
        width="800px"
        visible={dialogAsignVisible}
        header="Update Issue Status"
        isModal={true}
        showCloseIcon={true}
        close={handleCloseDialogAsign} // Handle dialog close
      >
        <form onSubmit={handleSubmitAsign}>
        {selectedIssue && (
          
            <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <p style={{ margin: '10px 0', lineHeight: '1.5', color: '#333' }}>
              <strong>Title:</strong> {selectedIssue.title}
            </p>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Select Status
              </label>
              <select
            //  value={newUser.role}
            //  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            style={{
              width: '240px',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontSize: '16px',
            }}
          >
            {usersData.map((user) => (
              <option key={user._id} value={user._id}>
                {user.firstName} {user.lastName}
              </option>
            ))}
            {/* <option value="Closed">
                Closed
              </option>
              <option value="Cancel">
                Cancel
              </option> */}
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
          Submit
        </button>
            {/* <Editor /> */}
          </div>
        
        )}
          </form>
      </DialogComponent>
      {/* Dialog box for adding new issue */}
      <DialogComponent
        width="600px"
        visible={addDialogVisible}
        header="Add New Issue"
        isModal={true}
        showCloseIcon={true}
        close={handleCloseAddDialog} // Handle dialog close
      >
        <form onSubmit={handleAddNewIssue}>
          <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <label>
              <strong>Title:</strong>
              <input
                type="text"
                value={newIssue.title}
                onChange={(e) => setNewIssue({ ...newIssue, title: e.target.value })}
                style={{ width: '100%', padding: '8px', marginTop: '8px', marginBottom: '12px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </label>

            <label>
              <strong>Message:</strong>
              <textarea
                value={newIssue.description}
                onChange={(e) => setNewIssue({ ...newIssue, description: e.target.value })}
                style={{ width: '100%', padding: '8px', marginTop: '8px', marginBottom: '12px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </label>

            <label>
              <strong>Status:</strong>
              <select
                value={newIssue.status}
                onChange={(e) => setNewIssue({ ...newIssue, status: e.target.value })}
                style={{ width: '100%', padding: '8px', marginTop: '8px', marginBottom: '12px', borderRadius: '4px', border: '1px solid #ccc' }}
              >
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="rejected">Rejected</option>
              </select>
            </label>

            <button
              type="submit"
              style={{
                backgroundColor: '#28a745',
                color: '#fff',
                padding: '10px 20px',
                borderRadius: '4px',
                cursor: 'pointer',
                border: 'none',
                marginTop: '12px',
              }}
            >
              Submit
            </button>
          </div>
        </form>


      </DialogComponent>
 {/* Modal-like Report Preview */}
      {showReport && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded-lg w-11/12 h-5/6 overflow-auto">
      {/* Buttons with no-print class */}
      <div className="no-print mb-4">
        <button
          onClick={() => setShowReport(false)}
          className="bg-red-500 text-white px-3 py-1 rounded mr-2"
        >
          Close
        </button>
        <button
          onClick={() => window.print()}
          className="bg-green-600 text-white px-3 py-1 rounded"
        >
          Print
        </button>
      </div>

      <IssuesReport  rows={issuesData} generatedBy="System Admin" />
    </div>
  </div>
)}
    </div>
  );
};

export default Solved;
