/* eslint-disable react/prop-types */

export const DashboardWrapper = ({children}) => {
  return (
    <div className="xs:col-span-7 lg:col-span-6 flex flex-col overflow-y-auto bg-white rounded p-2 shadow-md shadow-black/50 relative w-full">
      {children}
    </div>
  )
}
