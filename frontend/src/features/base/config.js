const MAIN_URL = "http://localhost:8000";
const BASE_URL = "http://localhost:8000/api";


export const API_ENDPOINTS = {
    MAIN_URL: MAIN_URL,

  BASE_URL: BASE_URL,
  REGISTER: `${BASE_URL}/auth/register/`,
  LOGIN: `${BASE_URL}/auth/login/`,
  USER_AUTH: `${BASE_URL}/auth/user/`,
  user_info: `${BASE_URL}/user-info/`,
 DASHBOARD_USER: `${BASE_URL}/dashboard/user/`,
 DASHBOARD_EVENT: `${BASE_URL}/dashboard/event/`

  // Add more endpoints as needed'http://localhost:8000/api/auth/user/
};
export const API_EVENT = {
  BASE_URL: `${BASE_URL}/events/`,
  GET_EVENTS: `${BASE_URL}/events/events-view/`,
  MODEL_INFO: `${BASE_URL}/events/event-model-info/`,
  CITY_VIEW:  `${BASE_URL}/events/city-view/`,
    VENUE_VIEW:  `${BASE_URL}/events/venue-view/`,

    CATEGORY_VIEW:  `${BASE_URL}/events/category-view/`,

};
export const API_EVENTREGISTER = {
    VIEW_EVENTS: `${BASE_URL}/tickets/events/`, // New: to fetch events for dropdown

  BASE_URL: `${BASE_URL}/events`,
  GENERATE_QR_CODE: `${BASE_URL}/tickets/qr/`, // Base path for QR code generatio,
  VIEW_EVENTREGISTERS: `${BASE_URL}/events/eventregisters-view/`,
    CREATE_REGISTRATION: `${BASE_URL}/tickets/registrations/`, // For POSTing registrations
  MY_REGISTRATIONS: `${BASE_URL}/tickets/registrations/my/`, // To fetch user's registrations
  GENERATE_QR: (ticketId) => `${BASE_URL}/tickets/qr/${ticketId}/`, // Dynamic QR path
  SCAN_TICKET: `${BASE_URL}/tickets/scan/`, // For scanning API

};
export const LOCAL_STORAGE_KEYS = {
  TOKENS: "tokens",
};
export const API_USER = {
  BASE_URL: `${BASE_URL}/users/`,
  VIEW_USERS: `${BASE_URL}/users/users-view/`,
};