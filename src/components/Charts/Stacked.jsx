import React, { useEffect, useState } from 'react';
import {
  ChartComponent,
  SeriesCollectionDirective,
  SeriesDirective,
  Inject,
  Legend,
  Category,
  StackingColumnSeries,
  Tooltip,
} from '@syncfusion/ej2-react-charts';
import { useStateContext } from '../../contexts/ContextProvider';
import { getIssuesAction, getIssuesByUserIdAction } from '../../api/issuesController';

const Stacked = ({ width, height }) => {
  const { currentMode,userId,userRole } = useStateContext();
  const [stackedChartData, setStackedChartData] = useState([[], [], []]);

  // Fetch and process data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
      if (userRole === 'Admin') {
        response = await getIssuesAction(); // Get all issues
      } else {
        response = await getIssuesByUserIdAction(userId); // Get only user-specific issues
      }
        const data = response.data;

        // Aggregate data by status, category, and department
        const aggregatedData = {
          status: {},
          category: {},
          department: {},
        };

        data.forEach((item) => {
          const status = item.status;
          const category = item.category.name;
          const department = item.department.name;

          // Status Distribution
          if (!aggregatedData.status[status]) {
            aggregatedData.status[status] = 0;
          }
          aggregatedData.status[status]++;

          // Category Distribution
          if (!aggregatedData.category[category]) {
            aggregatedData.category[category] = 0;
          }
          aggregatedData.category[category]++;

          // Department Distribution
          if (!aggregatedData.department[department]) {
            aggregatedData.department[department] = 0;
          }
          aggregatedData.department[department]++;
        });

        // Process the aggregated data for the chart
        const statusData = Object.keys(aggregatedData.status).map((status) => ({
          x: status,
          y: aggregatedData.status[status],
        }));

        const categoryData = Object.keys(aggregatedData.category).map((category) => ({
          x: category,
          y: aggregatedData.category[category],
        }));

        const departmentData = Object.keys(aggregatedData.department).map((department) => ({
          x: department,
          y: aggregatedData.department[department],
        }));

        setStackedChartData([statusData, categoryData, departmentData]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const stackedCustomSeries = [
    {
      dataSource: stackedChartData[0],
      xName: 'x',
      yName: 'y',
      name: 'Status Distribution',
      type: 'StackingColumn',
      background: '#1E90FF', // Blue color for status distribution
    },
    {
      dataSource: stackedChartData[1],
      xName: 'x',
      yName: 'y',
      name: 'Category Distribution',
      type: 'StackingColumn',
      background: '#32CD32', // Green color for category distribution
    },
    {
      dataSource: stackedChartData[2],
      xName: 'x',
      yName: 'y',
      name: 'Department Distribution',
      type: 'StackingColumn',
      background: '#FFD700', // Yellow color for department distribution
    },
  ];

  return (
    <ChartComponent
      id="charts"
      primaryXAxis={{ valueType: 'Category', title: 'Categories' }}
      primaryYAxis={{ title: 'Number of Issues' }}
      width={width}
      height={height}
      chartArea={{ border: { width: 0 } }}
      tooltip={{ enable: true }}
      background={currentMode === 'Dark' ? '#33373E' : '#fff'}
      legendSettings={{ background: 'white' }}
    >
      <Inject services={[StackingColumnSeries, Category, Legend, Tooltip]} />
      <SeriesCollectionDirective>
        {stackedCustomSeries.map((item, index) => (
          <SeriesDirective key={index} {...item} />
        ))}
      </SeriesCollectionDirective>
    </ChartComponent>
  );
};

export default Stacked;
