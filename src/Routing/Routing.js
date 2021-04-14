import React from 'react';
import { withRouter } from "react-router-dom";
import AdminRouting from "../Routing/AdminRouting";
import UserRouting from "../Routing/UserRouting";

const Routing = (props) => {
  return <>
    {
      props.history.location.pathname.includes("gr-admin") ? <AdminRouting /> : <UserRouting />
    }
  </>
}

export default withRouter(Routing);