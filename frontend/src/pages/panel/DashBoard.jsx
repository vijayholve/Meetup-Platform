import React from "react";
import Header from "../../components/dashboard/Header";
import DashBox from "../../components/dashboard/DashBox";
import EventList from "../../components/list/EventList";
import { UserContext, useUserContext } from "../../context/UserContext";
import { useEventContext } from "../../context/EventContext";
const DashBoard = () => {
  const {usersCount} =useUserContext()
  const{eventsCount} =useEventContext()
  return (
    <>
      <div className="flex justify-content-between">
        <DashBox className="col-md-6" title={"Total User Count"} total_number={usersCount.total_users} />
        <DashBox className="col-md-6" title={"Attendee Count "} total_number={usersCount.attendee_count} />
        <DashBox className="col-md-6" title={"Organizer Count"} total_number={usersCount.organizer_count} />
        <DashBox className="col-md-6" title={"Superusers "} total_number={usersCount.superusers_count} />
        <DashBox className="col-md-6" title={"Vendor Count"} total_number={usersCount.vendor_count} />
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
      <div>
        <EventList />
      </div>
    </>
  );
};

export default DashBoard;
