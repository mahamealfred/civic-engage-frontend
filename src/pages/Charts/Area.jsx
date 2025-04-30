import React, { useEffect, useState } from 'react'; 
import { ChartComponent, SeriesCollectionDirective, SeriesDirective, Inject, DateTime, SplineAreaSeries, Legend } from '@syncfusion/ej2-react-charts';

const AreaChart = () => {
  const [formattedData, setFormattedData] = useState([]);

  useEffect(() => {
    // Fetch issue data from API
    const fetchIssues = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/issues'); // Replace with actual API URL
        const issues = await response.json();

        // Process data
        const groupedData = issues.reduce((acc, item) => {
          const dateKey = new Date(item.createdAt).toISOString().split('T')[0];
          if (!acc[dateKey]) acc[dateKey] = { date: new Date(dateKey), open: 0, 'in-progress': 0, rejected: 0 };
          acc[dateKey][item.status.replace('-', '')] += 1;
          return acc;
        }, {});

        setFormattedData(Object.values(groupedData));
      } catch (error) {
        console.error('Error fetching issues:', error);
      }
    };

    fetchIssues();
  }, []);

  const areaCustomSeries = [
    {
      dataSource: formattedData,
      xName: 'date',
      yName: 'open',
      name: 'Open Issues',
      opacity: '0.8',
      type: 'SplineArea',
      width: '2',
    },
    {
      dataSource: formattedData,
      xName: 'date',
      yName: 'in-progress',
      name: 'In Progress Issues',
      opacity: '0.8',
      type: 'SplineArea',
      width: '2',
    },
    {
      dataSource: formattedData,
      xName: 'date',
      yName: 'rejected',
      name: 'Rejected Issues',
      opacity: '0.8',
      type: 'SplineArea',
      width: '2',
    },
  ];

  const areaPrimaryXAxis = { valueType: 'DateTime', labelFormat: 'yMMM', intervalType: 'Months' };
  const areaPrimaryYAxis = { labelFormat: '{value}' };

  return (
    <div className="m-4 md:m-10 mt-24 p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl">
      <h2 className="text-xl font-semibold mb-4">Civic Issue Reports Over Time</h2>
      <ChartComponent
        id="charts"
        primaryXAxis={areaPrimaryXAxis}
        primaryYAxis={areaPrimaryYAxis}
        chartArea={{ border: { width: 0 } }}
        background={'#fff'}
        legendSettings={{ background: 'white' }}
      >
        <Inject services={[SplineAreaSeries, DateTime, Legend]} />
        <SeriesCollectionDirective>
          {areaCustomSeries.map((item, index) => <SeriesDirective key={index} {...item} />)}
        </SeriesCollectionDirective>
      </ChartComponent>
    </div>
  );
};

export default AreaChart;
