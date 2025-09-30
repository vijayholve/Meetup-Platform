// For Vite projects, use import.meta.env; for Create React App, process.env is available at build time.
// If using Vite:
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// Helper function to get headers with optional authentication
const getHeaders = () => {
  const headers = {
    "Content-Type": "application/json",
  };

  const token = localStorage.getItem("token");
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

// Helper function to handle API requests
const apiRequest = async (url) => {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    throw error;
  }
};

export const chartService = {
  async getUserStatsData() {
    return apiRequest(`${API_BASE_URL}/api/dashboard/charts/user-stats/`);
  },

  async getEventStatsData() {
    return apiRequest(`${API_BASE_URL}/api/dashboard/charts/event-stats/`);
  },

  async getRegistrationTrendsData() {
    return apiRequest(
      `${API_BASE_URL}/api/dashboard/charts/registration-trends/`
    );
  },

  async getMonthlyEventsData() {
    return apiRequest(`${API_BASE_URL}/api/dashboard/charts/monthly-events/`);
  },

  async getEventCategoriesData() {
    return apiRequest(`${API_BASE_URL}/api/dashboard/charts/event-categories/`);
  },

  async getVenueStatsData() {
    return apiRequest(`${API_BASE_URL}/api/dashboard/charts/venue-stats/`);
  },

  async getDashboardAnalytics() {
    return apiRequest(`${API_BASE_URL}/api/dashboard/analytics/`);
  },
};
