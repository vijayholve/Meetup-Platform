import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { chartService } from "../../../services/chartService";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const VenueStatsChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/dashboard/charts/venue-stats/");
        const data = await response.json();
        if (data.success) {
          setChartData(data.data);
        } else {
          setError("Failed to fetch venue stats data");
        }
      } catch (err) {
        setError("Error fetching venue stats data");
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
        text: "Events by Venue",
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
        <div>Loading Venue Stats...</div>
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
      {chartData && <Bar data={chartData} options={options} />}
    </div>
  );
};

export default VenueStatsChart;
