import React from 'react'
import EventList from '../../components/list/EventList'
import { useEventContext } from '../../context/EventContext'
import DashBox from '../../components/dashboard/DashBox'
import Header from '../../components/dashboard/Header'

const EventPanel = () => {
    const{eventsCount} =useEventContext()
  
  return (
    <>          <Header title={"Event Create"} icon='bi bi-calendar-event' link={"/event/create"} />

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
    
    <EventList /></>
  )
}

export default EventPanel