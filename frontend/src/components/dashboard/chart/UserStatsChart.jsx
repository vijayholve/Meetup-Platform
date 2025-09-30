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

const UserStatsChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await chartService.getUserStatsData();
        if (response.success) {
          setChartData(response.data);
        } else {
          setError("Failed to fetch user stats data");
        }
      } catch (err) {
        setError("Error fetching user stats data");
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
        text: "User Statistics",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.parsed.y} users`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
        title: {
          display: true,
          text: "Number of Users",
        },
      },
      x: {
        title: {
          display: true,
          text: "User Types",
        },
      },
    },
    animation: {
      duration: 1000,
      easing: "easeInOutQuart",
    },
  };

  if (loading) {
    return (
      <div
        className="chart-container d-flex align-items-center justify-content-center"
        style={{ height: "400px", marginBottom: "2rem" }}
      >
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading User Stats...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="chart-container d-flex align-items-center justify-content-center"
        style={{ height: "400px", marginBottom: "2rem" }}
      >
        <div className="text-center">
          <div className="alert alert-danger" role="alert">
            <i className="fas fa-exclamation-triangle me-2"></i>
            Error: {error}
          </div>
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={() => window.location.reload()}
          >
            <i className="fas fa-refresh me-1"></i>
            Retry
          </button>
        </div>
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

export default UserStatsChart;
