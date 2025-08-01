import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { jobsApplied } from '../assets/assets'
import moment from 'moment'
import Footer from '../components/Footer'
import { AppContext } from '../context/AppContext'
import { useAuth, useUser } from '@clerk/clerk-react'
import axios from 'axios'
import { toast } from 'react-toastify'

const Applications = () => {
  const { user } = useUser()
  const { getToken } = useAuth()
  const [isEdit, setIsEdit] = useState(false)
  const [resumeFile, setResumeFile] = useState(null)
  const [tempFile, setTempFile] = useState(null)
  const { backendUrl, userData, userApplications, fetchUserData , fetchUserApplication } = useContext(AppContext)

  const handleSave = async () => {
  if (!tempFile) {
    // Show toast immediately
    toast.error('Please select a file first')
    return
  }
  // Start upload
  await updateResume(tempFile)
}

const updateResume = async (file) => {
  try {
    const formData = new FormData()
    formData.append('resume', file)
    const token = await getToken()

    // Show a loading toast immediately
    const loadingToast = toast.loading('Uploading resume...')

    const { data } = await axios.post(
      backendUrl + '/api/users/update-resume',
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    )

    if (data.success) {
      // Immediately show success toast
      toast.update(loadingToast, { render: data.message, type: 'success', isLoading: false, autoClose: 3000 })

      // Fetch user data in the background
      fetchUserData()
    } else {
      toast.update(loadingToast, { render: data.message, type: 'error', isLoading: false, autoClose: 3000 })
    }
  } catch (error) {
    toast.error(error.message || 'Upload failed')
  }

  setIsEdit(false)
  setTempFile(null)
}

  
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setTempFile(file)
    }
  }

  const handleCancel = () => {
    setTempFile(null)
    setIsEdit(false)
  }
 
   useEffect(()=>{
     if(user)
     {
      fetchUserApplication()
     }
   },[user])
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Your Resume</h2>
        <div className="bg-white shadow p-6 rounded-lg">
          {(isEdit || (userData && !userData.resume)) ? (
            <div className="space-y-4">
              <label className="block">
                <span className="text-gray-700">Upload Resume (PDF/DOC)</span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="mt-1 block w-full"
                />
              </label>
              <div className="space-x-2">
                <button
                  onClick={handleSave}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                  
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              {userData?.resume ? (
                <a
                  href={userData.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View Resume
                </a>
              ) : (
                <p className="text-gray-500">No resume uploaded.</p>
              )}
              <button
                onClick={() => setIsEdit(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                {userData?.resume ? 'Edit' : 'Upload'}
              </button>
            </div>
          )}
        </div>

        <h2 className="text-xl font-semibold mt-10 mb-4">Jobs Applied</h2>
        <table className="min-w-full bg-white border rounded-lg">
          <thead>
            <tr>
              <th className="px-3 py-4 border-b text-left">Company</th>
              <th className="px-3 py-4 border-b text-left">Job Title</th>
              <th className="px-3 py-4 border-b text-left max-sm:hidden">Location</th>
              <th className="px-3 py-4 border-b text-left max-sm:hidden">Date</th>
              <th className="px-3 py-4 border-b text-left">Status</th>
            </tr>
          </thead>
          <tbody>
  {userApplications.filter(job => job.jobId && job.companyId).map((job, index) => (
    <tr key={index}>
      <td className="py-3 px-4 flex items-center gap-2 border-b">
        <img className="w-8 h-8" src={job.companyId.image} alt="" />
        {job.companyId.name}
      </td>
      <td className="py-2 px-4 border-b">{job.jobId.title}</td>
      <td className="py-2 px-4 border-b max-sm:hidden">{job.jobId.location}</td>
      <td className="py-2 px-4 border-b max-sm:hidden">{moment(job.date).format('ll')}</td>
      <td className="py-2 px-4 border-b">
        <span
          className={`${
            job.status === 'Accepted'
              ? 'bg-green-100'
              : job.status === 'Rejected'
              ? 'bg-red-100'
              : 'bg-blue-100'
          } px-4 py-1.5 rounded`}
        >
          {job.status}
        </span>
      </td>
    </tr>
  ))}
</tbody>

        </table>
      </div>
      <Footer />
    </>
  )
}

export default Applications
