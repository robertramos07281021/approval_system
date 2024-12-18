import { Outlet } from "react-router-dom"
export const Layout = () => {

  return (
    <div className='h-full w-full '>
      <Outlet/>
    </div>
  )
}
