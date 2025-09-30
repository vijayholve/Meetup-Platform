import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { chartService } from "../../../services/chartService";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const EventRegistrationChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await chartService.getRegistrationTrendsData();
        if (response.success) {
          setChartData(response.data);
          console.log(response.data);
        } else {
          setError("Failed to fetch registration trends data");
        }
      } catch (err) {
        setError("Error fetching registration trends data");
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
        position: "top",
      },
      title: {
        display: true,
        text: "Event Registration Trends (Last 12 Months)",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  if (loading) {
    return (
      <div
        className="chart-container"
        style={{
          height: "400px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div>Loading Registration Trends...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="chart-container"
        style={{
          height: "400px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div>Error: {error}</div>
      </div>
    );
  }

  return (
    <div
      className="chart-container"
      style={{ height: "400px", marginBottom: "2rem" }}
    >
      {chartData && <Line data={chartData} options={options} />}
    </div>
  );
};

export default EventRegistrationChart;
