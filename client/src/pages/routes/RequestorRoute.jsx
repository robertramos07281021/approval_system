import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import { RequestForm } from '../../components/RequestForm'
import { Notification } from '../../components/Notification'
import { Navbar } from '../../components/Navbar'
import { Wrapper } from '../../components/Wrapper'
import { MainDiv } from '../../components/MainDiv'
import MainDivNavbar from '../../components/MainDivNavbar'


export const RequestorRoute = () => {
    
  const [formClick, setFormClick] = useState(false)
  
  const handleClick = ()=> {
      setFormClick(!formClick)
  }
  const [simRequest, setSimRequest] = useState(false)

  const handleSimFormRequest = () => {
      setSimRequest(true)
      setFormClick(false)
  }
  const [successfully, setSuccessfully] = useState(false)

  const {userInfo} = useSelector(state => state.auth)

  return userInfo?.type === "USER" ? (
    <Wrapper>
      <Navbar/>
      <MainDiv>
        <MainDivNavbar>
          <div className={`relative flex flex-col rounded ${formClick && "shadow-md shadow-black/50"} cursor-pointer`}>
            <div className='flex justify-between w-full p-3 rounded marker:cursor-pointer bg-white  z-20 hover:bg-blue-200 duration-200 ease-in-out' onClick={handleClick}>
              <p className='font-bold'>Request Form</p>
              {
                formClick ? 
                (
                  <i className="bi bi-caret-up-fill"></i>
                ) :
                (
                  <i className="bi bi-caret-down-fill"></i>
                )
              }
            </div>
            <div className={`${formClick ? "" : "absolute"}  top-0 p-3 z-10 w-full cursor-pointer hover:bg-blue-200 rounded text-sm `} onClick={handleSimFormRequest}>
                Purchase
            </div>
          </div>
        </MainDivNavbar>
        <Outlet/>
      </MainDiv>
      {
        simRequest && 
        <RequestForm close={()=> {setSimRequest(false);setFormClick(false) }} open={simRequest} success={()=> {setSuccessfully(true)}}/>
      }
      {
        successfully &&
        <Notification color="bg-blue-500" transitions={successfully} success={()=> setSuccessfully(false)}>
          Request is successfully submit
        </Notification>
      }
    </Wrapper>
  ) : (
    <Navigate to='../'/>
  )
}
