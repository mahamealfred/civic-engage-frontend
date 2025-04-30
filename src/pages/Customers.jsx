import React, { useState, useEffect } from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Selection, Inject, Edit, Toolbar, Sort, Filter, Search, ExcelExport, PdfExport, CommandColumn } from '@syncfusion/ej2-react-grids';
import { Header } from '../components';
import { getUsersAction, deleteUserAction, updateUserAction } from '../api/UserController'; // Add updateUserAction
import { useNavigate } from 'react-router-dom';
import { getIssuesAction } from '../api/issuesController';

const Customers = () => {
  const selectionsettings = { persistSelection: true, type: 'Multiple', checkboxOnly: true };
  const toolbarOptions = ['Search', 'ExcelExport', 'PdfExport', 'Delete', { text: 'Add New Staff', prefixIcon: 'e-add', id: 'addIssue' }];
  const editing = { allowDeleting: true, allowEditing: true, mode: 'Dialog' }; // Use Dialog for edit mode
  const navigate = useNavigate();
  const [usersData, setUsersData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await getUsersAction();
      if (response.responseCode === 200) {
        setUsersData(response.data);
      } 
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);


 

  const toolbarClick = async (args) => {
    if (gridInstance) {
      if (args.item.properties.id.includes("excelexport")) {
        gridInstance.excelExport();
      } else if (args.item.properties.id.includes("addIssue")) {
        navigate('/new-user');
      } else if (args.item.properties.id.includes("pdfexport")) {
        gridInstance.pdfExport();
      } else if (args.item.properties.id.includes("delete")) {
        if (selectedUser) {
          try {
            await deleteUserAction(selectedUser._id); // Call delete API
            setUsersData(usersData.filter(user => user._id !== selectedUser._id)); // Remove from grid
            setSelectedUser(null); // Clear selected user
          } catch (error) {
            console.log("Error deleting user:", error);
          }
        } else {
          alert("Please select a user to delete.");
        }
      }
    }
  };

  const actionComplete = async (args) => {
    if (args.requestType === 'save') {
      const updatedUser = args.data;
      console.log("ggg:",args.data)
      try {
       // await updateUserAction(updatedUser._id, updatedUser); // Call API to update user
       // fetchUsers(); // Refresh data
      } catch (error) {
        console.log("Error updating user:", error);
      }
    }
  };

  const rowSelected = () => {
    const selectedRecords = gridInstance.getSelectedRecords();
    setSelectedUser(selectedRecords.length > 0 ? selectedRecords[0] : null);
  };

  let gridInstance;

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Page" title="Users" />
      <GridComponent
        dataSource={usersData}
        enableHover={false}
        allowPaging
        pageSettings={{ pageCount: 5 }}
        selectionSettings={selectionsettings}
        toolbar={toolbarOptions}
        editSettings={editing}
        allowSorting
        ref={grid => gridInstance = grid}
        toolbarClick={toolbarClick}
        actionComplete={actionComplete} // Handle save action
        rowSelected={rowSelected} // Bind rowSelected event
      >
        <ColumnsDirective>
          <ColumnDirective type="checkbox" width="50" />
          <ColumnDirective field="firstName" headerText="First Name" width="120" textAlign="Left" />
          <ColumnDirective field="lastName" headerText="Last Name" width="120" textAlign="Left" />
          <ColumnDirective field="email" headerText="Email" width="150" textAlign="Left" />
          <ColumnDirective field="role" headerText="Role" width="100" textAlign="Left" />
          <ColumnDirective field="createdAt" headerText="Created At" width="150" format='yMd' textAlign="Left" />
          <ColumnDirective headerText='Actions' width='150' commands={[{ type: 'Edit', buttonOption: { cssClass: 'e-flat', iconCss: 'e-edit e-icons' } }]} />
        </ColumnsDirective>
        <Inject services={[Page, Selection, Toolbar, Edit, Sort, Filter, Search, ExcelExport, PdfExport, CommandColumn]} />
      </GridComponent>
    </div>
  );
};

export default Customers;
