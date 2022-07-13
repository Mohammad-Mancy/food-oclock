import React from 'react'
import MiddleNavBar from '../navbar/MiddleNavBar'
import TopNavBar from '../navbar/TopNavBar'

const Main = () => {
  return (
    <div className="main-wrapper">
        <TopNavBar/>
        <MiddleNavBar/>
        Restaurants
    </div>
  )
}

export default Main