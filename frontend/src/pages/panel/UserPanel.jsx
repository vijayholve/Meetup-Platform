import React from "react";
import UserList from "../../components/list/UserList";
import Header from "../../components/dashboard/Header";
import { useUserContext } from "../../context/UserContext";
import DashBox from "../../components/dashboard/DashBox";

const UserPanel = () => {
    const {usersCount} =useUserContext()
  
  return (
    <>
      <Header
        title="User Creation"
        subtitle="Fill the form to register a new user"
        icon="bi bi-person-plus"
        link="/user/create"
      />
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
      <UserList />
    </>
  );
};

export default UserPanel;
