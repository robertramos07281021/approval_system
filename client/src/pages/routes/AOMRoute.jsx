import { useSelector } from "react-redux"
import { Link, Navigate, Outlet } from "react-router-dom"
import { Navbar } from "../../components/Navbar"
import { MainDiv } from "../../components/MainDiv"
import { Wrapper } from "../../components/Wrapper"
import MainDivNavbar from "../../components/MainDivNavbar"

export const AOMRoute = () => {
  const {userInfo} = useSelector((state) => state.auth)

  
  return userInfo?.type === "AOM" ? (
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
