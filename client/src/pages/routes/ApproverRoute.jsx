import { useSelector } from "react-redux"
import { Navbar } from "../../components/Navbar"
import { Link, Navigate, Outlet } from "react-router-dom"
import { Wrapper } from "../../components/Wrapper"
import { MainDiv } from "../../components/MainDiv"
import MainDivNavbar from "../../components/MainDivNavbar"


export const ApproverRoute = () => {
  const {userInfo} = useSelector((state) => state.auth)

  return userInfo?.type === "APPROVER" ? (
    <Wrapper>
      <Navbar/>
      <MainDiv>
        <MainDivNavbar>
          <Link to="/aom-dashboard" className="rounded-md hover:bg-blue-200 duration-200 ease-in-out p-3 font-bold">
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
