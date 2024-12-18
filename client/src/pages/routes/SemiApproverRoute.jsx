import { Wrapper } from '../../components/Wrapper';
import { Navbar } from '../../components/Navbar';
import { MainDiv } from '../../components/MainDiv';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MainDivNavbar from '../../components/MainDivNavbar';

export const SemiApproverRoute = () => {
  const {userInfo} = useSelector((state)=> state.auth)


  return userInfo?.type === "SEMI-APPROVER" ? (
  
    <Wrapper>
      <Navbar/>
      <MainDiv>
        <MainDivNavbar>
          <div className='p-3 font-bold rounded'>Dashboard</div>
        </MainDivNavbar>
        <Outlet/>
      </MainDiv>
    </Wrapper>
  ) : (
    <Navigate to='../'/>
  )
}

