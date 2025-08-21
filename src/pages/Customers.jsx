import React, { useState, useEffect, useRef } from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Selection, Inject, Edit, Toolbar, Sort, Filter, Search, ExcelExport, PdfExport, CommandColumn } from '@syncfusion/ej2-react-grids';
import { Header } from '../components';
import { getUsersAction, deleteUserAction } from '../api/UserController';
import { useNavigate } from 'react-router-dom';
import UsersReport from '../components/UsersReport';

const Customers = () => {
  const selectionsettings = { persistSelection: true, type: 'Multiple', checkboxOnly: true };
  const toolbarOptions = ['Search', 'ExcelExport', 'PdfExport', 'Delete', { text: 'Add New Staff', prefixIcon: 'e-add', id: 'addIssue' }];
  const editing = { allowDeleting: true, allowEditing: true, mode: 'Dialog' };
  const navigate = useNavigate();
  const [usersData, setUsersData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showReport, setShowReport] = useState(false);

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
            await deleteUserAction(selectedUser._id);
            setUsersData(usersData.filter(user => user._id !== selectedUser._id));
            setSelectedUser(null);
          } catch (error) {
            console.log("Error deleting user:", error);
          }
        } else {
          alert("Please select a user to delete.");
        }
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
        rowSelected={rowSelected}
      >
        <ColumnsDirective>
          <ColumnDirective type="checkbox" width="50" />
          <ColumnDirective field="firstName" headerText="First Name" width="120" />
          <ColumnDirective field="lastName" headerText="Last Name" width="120" />
          <ColumnDirective field="email" headerText="Email" width="150" />
          <ColumnDirective field="role" headerText="Role" width="100" />
          <ColumnDirective field="createdAt" headerText="Created At" width="150" format='yMd' />
          <ColumnDirective headerText='Actions' width='150' commands={[{ type: 'Edit', buttonOption: { cssClass: 'e-flat', iconCss: 'e-edit e-icons' } }]} />
        </ColumnsDirective>
        <Inject services={[Page, Selection, Toolbar, Edit, Sort, Filter, Search, ExcelExport, PdfExport, CommandColumn]} />
      </GridComponent>

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

      <UsersReport rows={usersData} generatedBy="System Admin" />
    </div>
  </div>
)}

    </div>
  );
};

export default Customers;
