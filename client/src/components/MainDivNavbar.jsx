/* eslint-disable react/prop-types */


const MainDivNavbar = ({children}) => {
  return (
    <div className="xs:hidden lg:flex bg-white overflow-y-auto rounded p-3 flex-col gap-2 shadow-md shadow-black/50 z-20"> 
      {children}
    </div>
  )
}

export default MainDivNavbar