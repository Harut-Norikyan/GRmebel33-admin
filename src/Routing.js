import React, { useEffect } from 'react';
import { withRouter } from 'react-router';
import AdminRouting from './AdminRouting';
import UserRouting from './UserRouting';

const Routing = (props) => {

  useEffect(() => {
    window.scrollTo(0, 0);
  });

  return (
    (props.location.pathname.includes("gr-admin")) ?
      <div className="admin-pages">
        <AdminRouting />
      </div>
      :
      <UserRouting />
  );
}
export default withRouter(Routing)