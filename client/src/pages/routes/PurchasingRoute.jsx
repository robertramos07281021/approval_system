
import { Wrapper } from "../../components/Wrapper"
import { Navbar } from "../../components/Navbar"
import { MainDiv } from "../../components/MainDiv"
import MainDivNavbar from "../../components/MainDivNavbar"
import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router"

import { Link } from "react-router-dom"

export const PurchasingRoute = () => {
  const {userInfo} = useSelector(state => state.auth)
  return userInfo?.type === "PURCHASING" ? (
    <Wrapper>
      <Navbar/>
      <MainDiv>
        <MainDivNavbar>
        <Link to="/purchasing-dashboard" className="rounded-md hover:bg-blue-200 duration-200 ease-in-out p-3 font-bold">
            Dashboard
          </Link>
        </MainDivNavbar>
        <Outlet/>
      </MainDiv>
    </Wrapper>
  ) : (
    <Navigate to='../'/>
  )
}
