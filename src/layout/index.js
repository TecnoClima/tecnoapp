import React from 'react'
import NavBar from '../components/NavBar'
import './index.css'

const Layout = (props) => {
  return(
    <React.Fragment>
      <NavBar />

      <div className="container-fluid p-0 d-flex flex-grow-1 overflow-auto">
        {props.children}
      </div>

    </React.Fragment>
  );
}
export default Layout