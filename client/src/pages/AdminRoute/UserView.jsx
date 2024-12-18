
import { useLocation, useNavigate } from 'react-router-dom'
import { DashboardWrapper } from '../../components/DashboardWrapper'
import { useState } from 'react'
import { useChangePasswordMutation, useUpdateLoginMutation, useUpdateUserMutation } from '../../redux/api/user'
import { Confirmation } from '../../components/Confirmation'

export const UserView = () => {
  const {state} = useLocation()
  const [update, setupdate] = useState(false)
  const [updateUser] = useUpdateUserMutation()
  const [data, setData] = useState({
    name: state.name,
    email: state.email
  })
  const [submitModal, setSubmitModal] = useState(false)
  const navigate = useNavigate()
  const [updateLogin] = useUpdateLoginMutation()
  const [offline, setOffline] = useState(false)
  const [changePass, setChangePass] = useState(false)
  const [passData, setPassData] = useState({
    password: "",
    confirmPass: ""
  })
  const [required, setRequired] = useState(false)
  const [notSame, setNotSame] = useState(false)
  const [changePassword] = useChangePasswordMutation()


  //update =================================================
  const handleUpdate = () => {
    setupdate(true)
  }

  const handleSubmitUpdateData = async() => {
    const res = await updateUser({id: state._id, data: data})
    if(!res.error) {
      setSubmitModal(false)
      setupdate(false)
      navigate("/accounts?updated=true")
    } else {
      setSubmitModal(false)
      setupdate(false)
      if(res.error?.data?.message === "Danger") {
        navigate('/danger?error=Danger')
      }
    }
  }

  const handleSubmitUpdate = () => {
    setSubmitModal(true)
  }
  // ==========================================================


  // update isOnline =======================================
  const handleOffline = () => {
    setOffline(true)
  }

  const handleSubmitOffline = async() => {
    const res = await updateLogin(state._id)
    console.log(res)
    if(!res.error) {
      navigate("/accounts?isOnline=false")
    }
  }
  // ========================================================

  //change password ========================================
  const handleChangeButton = () => {  
    if(passData.password.trim() !== "" || passData.confirmPass.trim() !== "") {
      setRequired(false)
      if(passData.confirmPass !== passData.password || passData.confirmPass.trim() === "" ) {
        setNotSame(true)
      } else {
        setNotSame(false)
        setChangePass(true)
      }
    } else {
      setRequired(true)
      setNotSame(false)
    }
  }

  const handleSubmitChangePass = async() => {
    const res = await changePassword({id: state._id, data: passData})
    if(!res.error) {
      setChangePass(false)
      navigate("/accounts?resetPass=true")
    } else {
      setChangePass(false)
      if(res.error?.data?.message === "Danger") {
        navigate('/danger?error=Danger')
      }
    }
  }
  //========================================================


  const [passwShow, setPassShow] = useState(false)
  const handleShowPass = () => {
    setPassShow(!passwShow)
  }

  const [confirm, setConfirm] = useState(false)
  const handleShowConfirm = () => {
    setConfirm(!confirm)
  }

  return (
    <>
      <DashboardWrapper>
        <div className='h-full flex flex-col'>
          <div className='text-3xl font-bold'>
            {state.name.toUpperCase()}
          </div>
          <div className='h-full grid grid-cols-3 mt-2'>
            <div className='col-span-2 p-5'>
              <div className=' w-9/12 shadow-lg shadow-black/30'>
                <div className='text-center py-1.5 bg-blue-500 text-white font-bold'>Details</div>
                <div className='flex'>
                  <div className='w-3/12 bg-slate-200 px-2 py-2 font-semibold'>Name : </div>
                  <div className={`w-full px-2  py-2${update ? " border border-b-0  border-green-500" : "border-b-2 border-r-2 flex items-center"}`}>
                    {
                      !update ? 
                      (
                        <>
                          {state.name.toUpperCase()}
                        </>
                      ) : (
                        <input type="text" value={data.name.toUpperCase()} className=' outline-none w-full' onChange={(e)=> setData({...data, name: e.target.value})}/>
                      ) 
                    }
                    </div>
                </div>
                <div className='flex'>
                  <div className='w-3/12 border-b-2 border-l-2 px-2 py-2 font-semibold'>Email : </div>
                  <div className={`w-full px-2 bg-slate-200 py-2 ${update ? "border  border-green-500" : ""}`}>
                    {
                      !update ? 
                      (
                        <>
                          {state.email}
                        </>
                      ) : (
                        <input type="text" value={data.email} className='bg-slate-200 outline-none w-full' onChange={(e)=> setData({...data, email: e.target.value})}/>
                      ) 
                    }
                  </div>
                </div>
                <div className='flex'>
                  <div className='w-3/12 bg-slate-200 px-2 py-2 font-semibold'>Username : </div>
                  <div className='w-full px-2 border-b-2 border-r-2 py-2'>{state.username}</div>
                </div>
                <div className='flex'>
                  <div className='w-3/12 border-b-2 border-l-2 px-2 py-2 font-semibold'>Department : </div>
                  <div className='w-full px-2  bg-slate-200 py-2'>{state.department}</div>
                </div>
                <div className='flex'>
                  <div className='w-3/12 bg-slate-200 px-2 py-2 font-semibold'>Branch : </div>
                  <div className='w-full px-2 border-b-2 border-r-2 py-2'>{state.branch}</div>
                </div>
                <div className='flex'>
                  <div className='w-3/12 border-b-2 border-l-2 px-2 py-2 font-semibold'>Type : </div>
                  <div className='w-full px-2  bg-slate-200 py-2'>{state.type}</div>
                </div>
                <div className='flex'>
                  <div className='w-3/12 bg-slate-200 px-2 py-2 font-semibold items-center flex'>Login Status : </div>
                  <div className={`w-full px-2 border-b-2 border-r-2 py-2 flex justify-between ${!state.isOnline ? "py-3": ""}`}> 
                    <div className='flex items-center'>
                      {state.isOnline ? "Online" : "Offline"}
                    </div>
                    {
                      state.isOnline && 
                      <button className=' px-5 py-2 border-2 border-green-500 rounded bg-green-500 text-white hover:text-green-500 hover:bg-white duration-200 ease-in-out font-bold' onClick={handleOffline}>Offline</button>
                    }</div>
                </div>
              </div>
              <div className='mt-5 flex gap-10'>
                {
                  !update ? 
                  <button className='py-2 border-orange-500 border-2 px-10 mt-2 bg-orange-500 text-white font-bold rounded hover:text-orange-500 hover:bg-white duration-200 easy-in-out shadow-md shadow-black/50' onClick={handleUpdate}>Update</button> :
                  <>
                    <button className='py-2 border-orange-500 border-2 px-10 mt-2 bg-orange-500 text-white font-bold rounded hover:text-orange-500 hover:bg-white duration-200 easy-in-out shadow-md shadow-black/50' onClick={handleSubmitUpdate}>Submit</button>
                    <button className='py-2 border-slate-500 border-2 px-10 mt-2 bg-slate-500 text-white font-bold rounded hover:text-slate-500 hover:bg-white duration-200 easy-in-out shadow-md shadow-black/50' onClick={()=> setupdate(false)}>Cancel</button>
                  </>
                }
              </div>
            </div>
            <div>
              <div className='border mr-5 shadow-lg shadow-black/30 mt-4'>
                <div className='p-2 bg-blue-500 text-center text-white font-bold'>Reset Password</div>
                <div className='p-4 flex flex-col gap-2'>
                  {
                    required && 
                    <p className='text-xs font-bold text-red-500 text-center'>All fields are required.</p>
                  }
                  {
                    notSame &&
                    <p className='text-xs font-bold text-red-500 text-center'>Confirm new password not match on password.</p>
                  }
                  <label className='relative' >
                    <span className='font-semibold'>New Password :</span>
                    <input type={passwShow ? "text" : "password"} value={passData.password} onChange={(e)=> setPassData({...passData, password: e.target.value})} className='w-full border-2 p-2 rounded'/>
                    {
                    passwShow ? (
                      <i className="bi bi-eye-slash-fill absolute text-xl top-8 right-4" onClick={handleShowPass}></i>
                    ) : ( 
                      <i className="bi bi-eye-fill absolute text-xl top-8 right-4" onClick={handleShowPass}></i>
                    )
                  }
                  </label>
                  <label className='relative' >
                    <span className='font-semibold'>Confirm New Password :</span>
                    <input type={confirm ? "text" : "password"} value={passData.confirmPass} onChange={(e)=> setPassData({...passData, confirmPass: e.target.value})} className='w-full border-2 p-2 rounded'/>
                    {
                    confirm ? (
                      <i className="bi bi-eye-slash-fill absolute text-xl top-8 right-4" onClick={handleShowConfirm}></i>
                    ) : ( 
                      <i className="bi bi-eye-fill absolute text-xl top-8 right-4" onClick={handleShowConfirm}></i>
                    )
                  }
                  </label>
                  <div className='flex justify-center p-2'>
                    <button className='border-2 border-blue-500 bg-blue-500 text-white font-bold py-2 px-10 rounded hover:text-blue-500 hover:bg-white duration-200 ease-in-out' onClick={handleChangeButton}>Submit</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardWrapper>
      {
        submitModal &&
        <Confirmation color="bg-orange-500">
          <p className="text-lg font-semibold px-5 text-center">Are you sure you want to update this account?</p>
            <div className="flex gap-5">
              <button className="bg-orange-500 border-2 border-orange-500  w-24 py-2 text-lg font-semibold text-white rounded hover:bg-white hover:text-orange-500 duration-200 ease-in-out" onClick={handleSubmitUpdateData}>Yes</button>
              <button className="bg-slate-500 border-2 border-slate-500  w-24 py-2 text-lg font-semibold text-white rounded hover:bg-white hover:text-slate-500 duration-200 ease-in-out" onClick={()=> setSubmitModal(false)}>No</button>
            </div>
        </Confirmation>
      }
      {
        changePass &&
        <Confirmation color="bg-blue-500">
          <p className="text-lg font-semibold px-5 text-center">Are you sure you want to reset the password of this account?</p>
            <div className="flex gap-5">
              <button className="bg-blue-500 border-2 border-blue-500  w-24 py-2 text-lg font-semibold text-white rounded hover:bg-white hover:text-blue-500 duration-200 ease-in-out" onClick={handleSubmitChangePass}>Yes</button>
              <button className="bg-slate-500 border-2 border-slate-500  w-24 py-2 text-lg font-semibold text-white rounded hover:bg-white hover:text-slate-500 duration-200 ease-in-out" onClick={()=> setChangePass(false)}>No</button>
            </div>
        </Confirmation>
      }
      {
        offline &&
        <Confirmation color="bg-green-500">
          <p className="text-lg font-semibold px-5 text-center">Are you sure this account is online?</p>
            <div className="flex gap-5">
              <button className="bg-green-500 border-2 border-green-500  w-24 py-2 text-lg font-semibold text-white rounded hover:bg-white hover:text-green-500 duration-200 ease-in-out" onClick={handleSubmitOffline}>Yes</button>
              <button className="bg-slate-500 border-2 border-slate-500  w-24 py-2 text-lg font-semibold text-white rounded hover:bg-white hover:text-slate-500 duration-200 ease-in-out" onClick={()=> setOffline(false)}>No</button>
            </div>
        </Confirmation>
      }
    </>
  )
}
