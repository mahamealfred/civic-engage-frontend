import React, { useState, useEffect } from 'react';
import {
  ChartComponent,
  SeriesCollectionDirective,
  SeriesDirective,
  Inject,
  LineSeries,
  DateTime,
  Legend,
  Tooltip,
} from '@syncfusion/ej2-react-charts';

import { useStateContext } from '../../contexts/ContextProvider';
import { getIssuesAction } from '../../api/issuesController';

export const LinePrimaryXAxis = {
  valueType: 'DateTime',
  labelFormat: 'MMM y',
  intervalType: 'Months',
  edgeLabelPlacement: 'Shift',
  majorGridLines: { width: 0 },
  background: 'white',
};

export const LinePrimaryYAxis = {
  labelFormat: '{value}',
  rangePadding: 'None',
  minimum: 0,
  maximum: 10,
  interval: 2,
  lineStyle: { width: 0 },
  majorTickLines: { width: 0 },
  minorTickLines: { width: 0 },
};

const LineChart = () => {
  const { currentMode } = useStateContext();
  const [lineChartData, setLineChartData] = useState({ departmentGroups: {}, categoryGroups: {} });
  const [filterType, setFilterType] = useState('department');

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await getIssuesAction();
        if (response?.data) {
          const departmentGroups = {};
          const categoryGroups = {};

          response.data.forEach((issue) => {
            const date = new Date(issue.createdAt);

            // Group by Department
            if (!departmentGroups[issue.department.name]) {
              departmentGroups[issue.department.name] = [];
            }
            departmentGroups[issue.department.name].push({ x: date, y: 1 });

            // Group by Category
            if (!categoryGroups[issue.category.name]) {
              categoryGroups[issue.category.name] = [];
            }
            categoryGroups[issue.category.name].push({ x: date, y: 1 });
          });

          setLineChartData({ departmentGroups, categoryGroups });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchIssues();
  }, []);

  const departmentSeries = Object.keys(lineChartData.departmentGroups || {}).map((dept) => ({
    dataSource: lineChartData.departmentGroups[dept],
    xName: 'x',
    yName: 'y',
    name: dept,
    width: '2',
    marker: { visible: true, width: 10, height: 10 },
    type: 'Line',
  }));

  const categorySeries = Object.keys(lineChartData.categoryGroups || {}).map((cat) => ({
    dataSource: lineChartData.categoryGroups[cat],
    xName: 'x',
    yName: 'y',
    name: cat,
    width: '2',
    marker: { visible: true, width: 10, height: 10 },
    type: 'Line',
  }));

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        {/* <h2 className="text-xl font-semibold">Issues Trend</h2> */}
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md"
          onClick={() => setFilterType(filterType === 'department' ? 'category' : 'department')}
        >
          View by {filterType === 'department' ? 'Category' : 'Department'}
        </button>
      </div>
      <ChartComponent
        id="line-chart"
        height="420px"
        primaryXAxis={LinePrimaryXAxis}
        primaryYAxis={LinePrimaryYAxis}
        chartArea={{ border: { width: 0 } }}
        tooltip={{ enable: true }}
        background={currentMode === 'Dark' ? '#33373E' : '#fff'}
        legendSettings={{ background: 'white' }}
      >
        <Inject services={[LineSeries, DateTime, Legend, Tooltip]} />
        <SeriesCollectionDirective>
          {(filterType === 'department' ? departmentSeries : categorySeries).map((item, index) => (
            <SeriesDirective key={index} {...item} />
          ))}
        </SeriesCollectionDirective>
      </ChartComponent>
    </div>
  );
};

export default LineChart;
