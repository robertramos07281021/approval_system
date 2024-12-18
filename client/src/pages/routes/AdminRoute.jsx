import { useSelector } from "react-redux"
import { Link, Navigate, Outlet, useNavigate } from "react-router-dom"
import { Navbar } from "../../components/Navbar"
import { MainDiv } from "../../components/MainDiv"
import { Wrapper } from "../../components/Wrapper"
import MainDivNavbar from "../../components/MainDivNavbar"
import { useEffect, useState } from "react"
export const AdminRoute = () => {
  const {userInfo} = useSelector((state) => state.auth)

      
  const [formClick, setFormClick] = useState(false)
  
  const handleClick = ()=> {
      setFormClick(!formClick)
  }
  const navigate = useNavigate()

  useEffect(()=> {
    setFormClick(false)
  },[navigate])

  return userInfo?.type === "ADMIN" ? (
  <Wrapper>
    <Navbar/>
    <MainDiv>
      <MainDivNavbar>
        <Link to="/admin-dashboard" className="rounded-md hover:bg-blue-200 duration-200 ease-in-out p-3 font-bold">
          Dashboard
        </Link>
        <div className={`relative flex flex-col rounded ${formClick && "shadow-md shadow-black/50"} cursor-pointer`}>
            <div className='flex justify-between w-full p-3 rounded marker:cursor-pointer bg-white  z-20 hover:bg-blue-200 duration-200 ease-in-out' onClick={handleClick}>
              <p className='font-bold'>Accounts</p>
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
            <Link to="../accounts" className={`${formClick ? "" : "absolute"}  top-0 p-3 z-10 w-full cursor-pointer hover:bg-blue-200 rounded text-sm font-semibold`}>
              All Accounts
            </Link>
            <Link to="../accounts/register" className={`${formClick ? "" : "absolute"}  top-0 p-3 z-10 w-full cursor-pointer hover:bg-blue-200 rounded text-sm font-semibold`}>
              New Account
            </Link>
            <Link to="../new-department" className={`${formClick ? "" : "absolute"}  top-0 p-3 z-10 w-full cursor-pointer hover:bg-blue-200 rounded text-sm font-semibold`}>
              Department
            </Link>
            <Link to="../branch" className={`${formClick ? "" : "absolute"}  top-0 p-3 z-10 w-full cursor-pointer hover:bg-blue-200 rounded text-sm font-semibold`}>
              Branch
            </Link>
          </div>
          <Link to="../reports" className="rounded-md hover:bg-blue-200 duration-200 ease-in-out p-3 font-bold">
              Reports
          </Link>
      </MainDivNavbar>
      <Outlet/> 
    </MainDiv>
  </Wrapper>
  ) : (
    <Navigate to='../'/>
  )
}
