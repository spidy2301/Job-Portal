import React, { useContext, useState } from 'react'
import { Route,Routes } from 'react-router-dom'
import Applications from './pages/Applications'
import ApplyJobs from './pages/ApplyJobs'
import Home from './pages/Home'
import RecruiterLogin from './components/RecruiterLogin'
import { AppContext } from './context/AppContext'
import Dashboard from './pages/Dashboard'
import AddJob from './pages/AddJob'
import ManageJobs from './pages/ManageJobs'
import ViewApplications from './pages/ViewApplications'
import 'quill/dist/quill.snow.css' 
import { ToastContainer, toast } from 'react-toastify';
function App() {
  const{showRecruiterLogin,companyToken} =useContext(AppContext)


  return (
    <div>
      {showRecruiterLogin && <RecruiterLogin/> }
      <ToastContainer/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/applications' element={<Applications/>}/>
        <Route path='/apply-job/:id' element={<ApplyJobs/>}/>
        <Route path='/dashboard' element={<Dashboard/>}>
          {companyToken ? <>
            <Route path='add-job' element={<AddJob/>}/>
          <Route path='manage-jobs' element={<ManageJobs/>}/>
          <Route path='view-applications' element={<ViewApplications/>}/>  
          </>: null
          }
          
        </Route>
      </Routes>
    </div>
  )
}

export default App