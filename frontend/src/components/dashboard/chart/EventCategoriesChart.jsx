import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { chartService } from '../../../services/chartService';

ChartJS.register(ArcElement, Tooltip, Legend);

const EventCategoriesChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await chartService.getEventCategoriesData();
        if (response.success) {
          setChartData(response.data);
        } else {
          setError('Failed to fetch event categories data');
        }
      } catch (err) {
        setError('Error fetching event categories data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Events by Category',
      },
    },
  };

  if (loading) {
    return (
      <div className="chart-container" style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>Loading Event Categories...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chart-container" style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="chart-container" style={{ height: '400px', marginBottom: '2rem' }}>
      {chartData && <Pie data={chartData} options={options} />}
    </div>
  );
};

export default EventCategoriesChart;