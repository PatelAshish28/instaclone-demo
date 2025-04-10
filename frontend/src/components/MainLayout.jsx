import React from 'react'
import { Outlet } from 'react-router-dom'
import LeftSidebar from './LeftSidebar'

const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <LeftSidebar />

      {/* Main content */}
      <div className="flex-1 md:ml-[16%] px-4 md:px-8 pt-4">
        <Outlet />
      </div>
    </div>
  )
}

export default MainLayout
