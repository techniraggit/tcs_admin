import React from 'react'

function NotFound(props) {
  return (
    <div>
        <div className="no-doc-list">
    {/* <img src={NoDoctorImg} alt="No Doctor" /> */}
    <h5>No {props.data ||  'data'} added yet</h5>
    <p>Lorem ipsum dolor sit amet consectetur.</p>
  </div></div>
  )
}

export default NotFound