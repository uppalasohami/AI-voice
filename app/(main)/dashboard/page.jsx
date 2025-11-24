import React from 'react'
import WelcomContainer from './_components/WelcomContainer'
import CreateOptions from './_components/CreateOptions'
import LatestInterviewsList from './_components/LatestInterviewsList'

function Dashboard() {
  return (
    <div>
      {/* <WelcomContainer/> */}
      <h2 className='my-3 font-bold text-2xl'>Dashboard</h2>
      <CreateOptions/>
      <LatestInterviewsList/>
    </div>
  )
}

export default Dashboard