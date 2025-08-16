import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import './index.css'
import App from "./App.jsx";
import store from "./app/store";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./context/UserContext.jsx";
import { EventProvider } from "./context/EventContext.jsx";
import {
  EventregisterContext,
  EventregisterProvider,
} from "./context/EventregisterContext.jsx";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <StrictMode>
      <BrowserRouter>
        <UserProvider>
          <EventProvider>
            <EventregisterProvider>
              <App />
            </EventregisterProvider>
          </EventProvider>
        </UserProvider>
      </BrowserRouter>
    </StrictMode>
    ,
  </Provider>
);
