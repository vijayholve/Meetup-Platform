import React from "react";
import Header from "../../components/dashboard/Header";
import DashBox from "../../components/dashboard/DashBox";
import EventList from "../../components/list/EventList";
import { UserContext, useUserContext } from "../../context/UserContext";
import { useEventContext } from "../../context/EventContext";
import {
  UserStatsChart,
  EventRegistrationChart,
  MonthlyEventsChart,
} from "../../components/dashboard/chart";

const DashBoard = () => {
  const { usersCount } = useUserContext();
  const { eventsCount } = useEventContext();
  return (
    <>
      <div className="flex justify-content-between">
        <DashBox
          className="col-md-6"
          title={"Total User Count"}
          total_number={usersCount.total_users}
        />
        <DashBox
          className="col-md-6"
          title={"Attendee Count "}
          total_number={usersCount.attendee_count}
        />
        <DashBox
          className="col-md-6"
          title={"Organizer Count"}
          total_number={usersCount.organizer_count}
        />
        <DashBox
          className="col-md-6"
          title={"Superusers "}
          total_number={usersCount.superusers_count}
        />
        <DashBox
          className="col-md-6"
          title={"Vendor Count"}
          total_number={usersCount.vendor_count}
        />
      </div>
      <div className="flex justify-content-between">
        <DashBox
          className="col-md-6"
          title={"Total Events Count"}
          total_number={eventsCount.total_events}
        />
        <DashBox
          className="col-md-6"
          title={"Total Event Register Count"}
          total_number={eventsCount.total_eventsregister}
        />
        <DashBox
          className="col-md-6"
          title={"Public Events Count "}
          total_number={eventsCount.public_events_count}
        />
        <DashBox
          className="col-md-6"
          title={"Total Blocked Events "}
          total_number={eventsCount.blocked_events}
        />
        <DashBox
          className="col-md-6"
          title={"Blocked Event Registers "}
          total_number={eventsCount.blocked_eventregisters}
        />
      </div>

      {/* Charts Section - Improved Layout */}
      <div className="row mt-4 p-9">
        {/* First Row - Two Charts Side by Side */}
          <div className="card shadow-sm">
            <div className="card-header bg-light">
              <h6 className="card-title mb-0">
                <i className="fas fa-chart-line me-2 text-info"></i>
                Registration Trends
              </h6>
            </div>
            <div className="card-body p-2" style={{ height: "300px" }}>
              <EventRegistrationChart />
            </div>
          </div>
          </div>

        <div className="row mt-8 p-9 ">
          <div className="card shadow-sm">
            <div className="card-header bg-light">
              <h6 className="card-title mb-0">
                <i className="fas fa-chart-bar me-2 text-warning"></i>
                Monthly Events
              </h6>
            </div>
            <div className="card-body p-2" style={{ height: "300px"  , 
            margin:"10px"
            }}>
              <MonthlyEventsChart />
            </div>
          </div>
        </div>

      {/* Second Row - User Stats Chart (Smaller Width) */}
      <div className="row mt-3 p-10 ">
        <div className="col-lg-8 col-md-10 mx-auto">
          <div className="card shadow-sm">
            <div className="card-header bg-light">
              <h6 className="card-title mb-0">
                <i className="fas fa-users me-2 text-success"></i>
                User Statistics
              </h6>
            </div>
            <div className="card-body p-2" style={{ height: "350px" }}>
              <UserStatsChart />
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div>
          <EventList />
        </div>
      </div>
    </>
  );
};

export default DashBoard;
