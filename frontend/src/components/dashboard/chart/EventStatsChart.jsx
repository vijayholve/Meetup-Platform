import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { chartService } from "../../../services/chartService";

ChartJS.register(ArcElement, Tooltip, Legend);

const EventStatsChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await chartService.getEventStatsData();
        if (response.success) {
          setChartData(response.data);
        } else {
          setError("Failed to fetch event stats data");
        }
      } catch (err) {
        setError("Error fetching event stats data");
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
        position: "right",
      },
      title: {
        display: true,
        text: "Event Distribution",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage =
              total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
    animation: {
      animateRotate: true,
      duration: 1000,
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
          <p className="mt-2 text-muted">Loading Event Stats...</p>
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
      {chartData && <Doughnut data={chartData} options={options} />}
    </div>
  );
};

export default EventStatsChart;
