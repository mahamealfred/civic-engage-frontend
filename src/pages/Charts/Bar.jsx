import React, { useEffect, useState } from 'react';
import {
  ChartComponent,
  SeriesCollectionDirective,
  SeriesDirective,
  Inject,
  Legend,
  Category,
  Tooltip,
  LineSeries,
  DataLabel,
} from '@syncfusion/ej2-react-charts';

import { useStateContext } from '../../contexts/ContextProvider';
import { getIssuesAction } from '../../api/issuesController';

const LineChart = () => {
  const { currentMode } = useStateContext();
  const [lineChartData, setLineChartData] = useState({ departmentGroups: {}, categoryGroups: {} });

  // Fetch data from API and process it
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await getIssuesAction();
        if (response?.data) {
          const departmentGroups = {};
          const categoryGroups = {};

          // Group by Department and Category
          response.data.forEach((issue) => {
            const date = new Date(issue.createdAt);
            const dateKey = date.toLocaleDateString(); // Grouping by date

            // Group by Department
            if (!departmentGroups[issue.department.name]) {
              departmentGroups[issue.department.name] = [];
            }
            departmentGroups[issue.department.name].push({ x: dateKey, y: 1 });

            // Group by Category
            if (!categoryGroups[issue.category.name]) {
              categoryGroups[issue.category.name] = [];
            }
            categoryGroups[issue.category.name].push({ x: dateKey, y: 1 });
          });

          setLineChartData({ departmentGroups, categoryGroups });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchIssues();
  }, []);

  // Function to prepare data for line chart series
  const getChartData = (groupedData) => {
    const chartData = [];
    Object.keys(groupedData).forEach((group) => {
      const groupData = groupedData[group].reduce((acc, item) => {
        const existing = acc.find((d) => d.x === item.x);
        if (existing) {
          existing.y += 1;
        } else {
          acc.push(item);
        }
        return acc;
      }, []);
      chartData.push({ name: group, dataSource: groupData });
    });
    return chartData;
  };

  return (
    <div className="m-4 md:m-10 mt-24 p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl">
      <h2 className="text-center text-2xl font-bold">Line Chart: Issues Over Time (Department / Category)</h2>
      <div className="w-full">
        <ChartComponent
          id="lineChart"
          primaryXAxis={{ valueType: 'Category', title: 'Date' }}
          primaryYAxis={{ title: 'Issue Count' }}
          chartArea={{ border: { width: 0 } }}
          tooltip={{ enable: true }}
          background={currentMode === 'Dark' ? '#33373E' : '#fff'}
          legendSettings={{ background: 'white' }}
          height="400px"
        >
          <Inject services={[LineSeries, Legend, Tooltip, Category, DataLabel]} />
          <SeriesCollectionDirective>
            {/* Generate series for department-wise data */}
            {getChartData(lineChartData.departmentGroups).map((series) => (
              <SeriesDirective
                key={series.name}
                dataSource={series.dataSource}
                xName="x"
                yName="y"
                name={series.name}
                type="Line"
                marker={{
                  visible: true,
                  width: 10,
                  height: 10,
                  fill: '#ffffff',
                  border: { color: '#ff7b00', width: 2 },
                }}
              />
            ))}
            {/* Generate series for category-wise data */}
            {getChartData(lineChartData.categoryGroups).map((series) => (
              <SeriesDirective
                key={series.name}
                dataSource={series.dataSource}
                xName="x"
                yName="y"
                name={series.name}
                type="Line"
                marker={{
                  visible: true,
                  width: 10,
                  height: 10,
                  fill: '#ffffff',
                  border: { color: '#00bcd4', width: 2 },
                }}
              />
            ))}
          </SeriesCollectionDirective>
        </ChartComponent>
      </div>
    </div>
  );
};

export default LineChart;
