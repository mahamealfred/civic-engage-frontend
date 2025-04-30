import React, { useEffect, useState } from 'react';
import {
  AccumulationChartComponent,
  AccumulationSeriesCollectionDirective,
  AccumulationSeriesDirective,
  AccumulationLegend,
  PieSeries,
  AccumulationDataLabel,
  Inject,
  AccumulationTooltip,
} from '@syncfusion/ej2-react-charts';

import { useStateContext } from '../../contexts/ContextProvider';
import { getIssuesAction } from '../../api/issuesController';

const Doughnut = ({ id, legendVisiblity, height }) => {
  const { currentMode } = useStateContext();
  const [pieChartData, setPieChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getIssuesAction();
        const data = response.data;

        // Calculate percentage distribution of statuses
        const statusCounts = {};
        data.forEach((item) => {
          const status = item.status;
          statusCounts[status] = (statusCounts[status] || 0) + 1;
        });

        const total = Object.values(statusCounts).reduce((sum, count) => sum + count, 0);

        // Transform the data for the pie chart
        const chartData = Object.keys(statusCounts).map((status) => ({
          x: status,
          y: statusCounts[status],
          text: `${((statusCounts[status] / total) * 100).toFixed(1)}%`,
        }));

        setPieChartData(chartData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <AccumulationChartComponent
      id={id}
      legendSettings={{ visible: legendVisiblity, background: 'white' }}
      height={height}
      background={currentMode === 'Dark' ? '#33373E' : '#fff'}
      tooltip={{ enable: true }}
    >
      <Inject services={[AccumulationLegend, PieSeries, AccumulationDataLabel, AccumulationTooltip]} />
      <AccumulationSeriesCollectionDirective>
        <AccumulationSeriesDirective
          name="Issues"
          dataSource={pieChartData}
          xName="x"
          yName="y"
          innerRadius="40%"
          startAngle={0}
          endAngle={360}
          radius="70%"
          explode
          explodeOffset="10%"
          explodeIndex={2}
          dataLabel={{
            visible: true,
            name: 'text',
            position: 'Inside',
            font: {
              fontWeight: '600',
              color: '#fff',
            },
          }}
        />
      </AccumulationSeriesCollectionDirective>
    </AccumulationChartComponent>
  );
};

export default Doughnut;
