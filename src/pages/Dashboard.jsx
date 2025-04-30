import React, { useEffect, useState } from 'react';
import { BsBoxSeam, BsCurrencyDollar } from 'react-icons/bs';
import { GoPrimitiveDot } from 'react-icons/go';
import { IoIosMore } from 'react-icons/io';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';

import { Stacked, Pie, Button, LineChart, SparkLine } from '../components';
import { earningData, medicalproBranding, recentTransactions, weeklyStats, dropdownData, SparklineAreaData, ecomPieChartData } from '../data/dummy';
import { useStateContext } from '../contexts/ContextProvider';
import product9 from '../data/product9.jpg';
import { getUsersAction } from '../api/UserController';
import { MdOutlineSupervisorAccount } from 'react-icons/md';
import { FiBarChart, FiPieChart } from 'react-icons/fi';
import { HiOutlineRefresh } from 'react-icons/hi';
import { getIssuesAction } from '../api/issuesController';

const DropDown = ({ currentMode }) => (
  <div className="w-28 border-1 border-color px-2 py-1 rounded-md">
    <DropDownListComponent id="time" fields={{ text: 'Time', value: 'Id' }} style={{ border: 'none', color: (currentMode === 'Dark') && 'white' }} value="1" dataSource={dropdownData} popupHeight="220px" popupWidth="120px" />
  </div>
);

const Ecommerce = () => {
  const { currentColor, currentMode } = useStateContext();
   const [usersData, setUsersData] = useState([]);
   const [issuesData, setIssuesData] = useState([])
   const [issueCounts, setIssueCounts] = useState({
    open: 0,
    inProgress: 0,
    rejected: 0,
    solved: 0,
  });

 
  const [categoryDistribution, setCategoryDistribution] = useState({});
  const [statusCount, setStatusCount] = useState({});
  
  // Fetch issues data
  useEffect(() => {
    const fetchIssuesData = async () => {
      try {
        // Replace with actual API call to fetch issues data
        const response = await getIssuesAction();
        if (response?.data) {
          setIssuesData(response.data);

          // Calculate category-wise distribution
          const categoryGroups = {};
          const statusGroups = { open: 0, 'in-progress': 0, rejected: 0,solved: 0 };

          response.data.forEach((issue) => {
            // Category Distribution
            if (!categoryGroups[issue.category.name]) {
              categoryGroups[issue.category.name] = 0;
            }
            categoryGroups[issue.category.name]++;

            // Status Count
            if (statusGroups[issue.status] !== undefined) {
              statusGroups[issue.status]++;
            }
          });

          setCategoryDistribution(categoryGroups);
          setStatusCount(statusGroups);
        }
      } catch (error) {
        console.error('Error fetching issues:', error);
      }
    };

    fetchIssuesData();
  }, []);

  // Download Report Logic
  const handleDownloadReport = () => {
    // Convert issues data to a CSV format (you can adjust this as per your needs)
    const csvData = issuesData.map((issue) => ({
      Title: issue.title,
      Category: issue.category.name,
      Department: issue.department.name,
      Status: issue.status,
      CreatedAt: issue.createdAt,
    }));

    const csvRows = [
      ['Title', 'Category', 'Department', 'Status', 'CreatedAt'],
      ...csvData.map((row) => [
        row.Title,
        row.Category,
        row.Department,
        row.Status,
        row.CreatedAt,
      ]),
    ];

    // Convert to CSV string
    const csvString = csvRows.map((row) => row.join(',')).join('\n');
    
    // Create a Blob and trigger a download
    const blob = new Blob([csvString], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'issues_report.csv';
    link.click();
  };

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
   useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await getIssuesAction();
        if (response?.data) {
          setIssuesData(response.data); // Save the full data
          
          // Count issues based on their status
          const openIssues = response.data.filter(issue => issue.status === "open").length;
          const inProgressIssues = response.data.filter(issue => issue.status === "in-progress").length;
          const closedIssues = response.data.filter(issue => issue.status === "closed").length;

          // Update counts
          setIssueCounts({
            open: openIssues,
            inProgress: inProgressIssues,
            closed: closedIssues,
          });
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchIssues();
  }, []);

  return (
    <div className="mt-24">
      <div className="flex flex-wrap lg:flex-nowrap justify-center ">
       
        <div className="flex m-2 flex-wrap justify-center gap-1 items-center">
            <div  className="bg-white h-44 dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56  p-4 pt-9 rounded-2xl ">
              <button
                type="button"
                style={{ color: "#03C9D7", backgroundColor: "#E5FAFB" }}
                className="text-2xl opacity-0.9 rounded-full  p-4 hover:drop-shadow-xl"
              >
              <MdOutlineSupervisorAccount />
              </button>
              <p className="mt-3">
                <span className="text-lg font-semibold">{usersData?.length}</span>
                <span className={`text-sm text-red-600 ml-2`}>
                </span>
              </p>
              <p className="text-sm text-gray-400  mt-1">Users</p>
            </div>
      
        </div>
        <div className="flex m-2 flex-wrap justify-center gap-1 items-center">
            <div  className="bg-white h-44 dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56  p-4 pt-9 rounded-2xl ">
              <button
                type="button"
                style={{ color: "rgb(255, 244, 229)", backgroundColor: "rgb(254, 201, 15)" }}
                className="text-2xl opacity-0.9 rounded-full  p-4 hover:drop-shadow-xl"
              >
             <BsBoxSeam />
              </button>
              <p className="mt-3">
                <span className="text-lg font-semibold">{issueCounts?.inProgress || 0}</span>
                <span className={`text-sm text-green-600 ml-2`}>
                 
                </span>
              </p>
              <p className="text-sm text-gray-400  mt-1">In-progress</p>
            </div>
      
        </div>
        <div className="flex m-2 flex-wrap justify-center gap-1 items-center">
            <div  className="bg-white h-44 dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56  p-4 pt-9 rounded-2xl ">
              <button
                type="button"
                style={{ color: "rgb(228, 106, 118)", backgroundColor: "rgb(255, 244, 229)" }}
                className="text-2xl opacity-0.9 rounded-full  p-4 hover:drop-shadow-xl"
              >
              <FiBarChart />
              </button>
              <p className="mt-3">
                <span className="text-lg font-semibold">{issueCounts?.open || 0}</span>
                <span className={`text-sm text-green-600 ml-2`}>
                 
                </span>
              </p>
              <p className="text-sm text-gray-400  mt-1">Opened</p>
            </div>
      
        </div>
        <div className="flex m-2  flex-wrap justify-center gap-1 items-center">
            <div  className="bg-white h-44 dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56  p-4 pt-9 rounded-2xl ">
              <button
                type="button"
                style={{ color: "rgb(0, 194, 146)", backgroundColor: "rgb(235, 250, 242)" }}
                className="text-2xl opacity-0.9 rounded-full  p-4 hover:drop-shadow-xl"
              >
               <HiOutlineRefresh />
              </button>
              <p className="mt-3">
                <span className="text-lg font-semibold">{issueCounts?.rejected || 0}</span>
                <span className={`text-sm text-red-600 ml-2`}>
                 
                </span>
              </p>
              <p className="text-sm text-gray-400  mt-1">Closed Issues</p>
            </div>
      
        </div>
        <div className="flex m-2 flex-wrap justify-center gap-1 items-center">
            <div  className="bg-white h-44 dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56  p-4 pt-9 rounded-2xl ">
              <button
                type="button"
                style={{ color: "rgb(0, 194, 146)", backgroundColor: "rgb(235, 250, 242)" }}
                className="text-2xl opacity-0.9 rounded-full  p-4 hover:drop-shadow-xl"
              >
               <HiOutlineRefresh />
              </button>
              <p className="mt-3">
                <span className="text-lg font-semibold">{issueCounts?.solved || 0}</span>
                <span className={`text-sm text-red-600 ml-2`}>
                 
                </span>
              </p>
              <p className="text-sm text-gray-400  mt-1">Solved Issues</p>
            </div>
      
        </div>
      </div>
      

      <div className="flex gap-10 flex-wrap justify-center">
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg m-3 p-4 rounded-2xl md:w-780  ">
      
          {/* <div className="flex justify-between">
            <p className="font-semibold text-xl">Revenue Updates</p>
            <div className="flex items-center gap-4">
              <p className="flex items-center gap-2 text-gray-600 hover:drop-shadow-xl">
                <span>
                  <GoPrimitiveDot />
                </span>
                <span>Expense</span>
              </p>
              <p className="flex items-center gap-2 text-green-400 hover:drop-shadow-xl">
                <span>
                  <GoPrimitiveDot />
                </span>
                <span>Budget</span>
              </p>
            </div>
          </div> */}
          
           
          <div className="mt-10 flex gap-10 flex-wrap justify-center">
           
          <div className="border-r-1 border-color m-4 pr-10">
      <div>
        <p className="text-3xl font-semibold">Total Issues: {issuesData.length}</p>
        <p className="text-gray-500 mt-1">Number of Issues</p>
      </div>
      
      {/* Display Status Count */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold">Status Distribution:</h3>
        <p>Open: {statusCount.open || 0}</p>
        <p>In Progress: {statusCount['in-progress'] || 0}</p>
        <p>Rejected: {statusCount.rejected || 0}</p>
      </div>

      {/* Display Category Distribution */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold">Category Distribution:</h3>
        {Object.entries(categoryDistribution).map(([category, count]) => (
          <p key={category}>{category}: {count}</p>
        ))}
      </div>

      {/* Download Report Button */}
      <div className="mt-10">
        <Button
          color="white"
          bgColor="#4caf50"  // You can adjust the color
          text="Download Report"
          borderRadius="10px"
          onClick={handleDownloadReport} // Trigger the report download
        />
      </div>
    </div>
            <div>
              <Stacked currentMode={currentMode} width="320px" height="360px" />
            </div>
          </div>
        </div>
        <div>
        <div className="flex gap-10 m-4 flex-wrap justify-center">
      
      <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl w-96 md:w-760">
        <div className="flex justify-between items-center gap-2 mb-10">
          <p className="text-xl font-semibold">Issues Overview</p>
          <DropDown currentMode={currentMode} />
        </div>
        <div className="md:w-full overflow-auto">
          <LineChart />
         
        </div>
  
      </div>
    </div> 
          {/* <div
            className=" rounded-2xl md:w-400 p-4 m-3"
            style={{ backgroundColor: currentColor }}
          >
            <div className="flex justify-between items-center ">
              <p className="font-semibold text-white text-2xl">Total</p>

              <div>
                <p className="text-2xl text-white font-semibold mt-8">134</p>
                <p className="text-gray-200">Monthly issues</p>
              </div>
            </div>

            <div className="mt-4">
              <SparkLine currentColor={currentColor} id="column-sparkLine" height="100px" type="Column" data={SparklineAreaData} width="320" color="rgb(242, 252, 253)" />
            </div>
          </div> */}

          {/* <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-2xl md:w-400 p-8 m-3 flex justify-center items-center gap-10">
            <div>
              <p className="text-2xl font-semibold ">57</p>
              <p className="text-gray-400">Monthly Issues</p>
            </div>

            <div className="w-40">
              <Pie id="pie-chart" data={ecomPieChartData} legendVisiblity={false} height="160px" />
            </div>
          </div> */}
        </div>
      </div>

      {/* <div className="flex gap-10 m-4 flex-wrap justify-center">
      
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl w-96 md:w-760">
          <div className="flex justify-between items-center gap-2 mb-10">
            <p className="text-xl font-semibold">Issues Overview</p>
            <DropDown currentMode={currentMode} />
          </div>
          <div className="md:w-full overflow-auto">
            <LineChart />
          </div>
        </div>
      </div> */}

     
    </div>
  );
};

export default Ecommerce;
