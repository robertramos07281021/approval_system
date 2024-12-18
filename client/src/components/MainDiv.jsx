/* eslint-disable react/prop-types */
export const MainDiv = ({children}) => {
  return (
    <main className='h-screen w-full grid grid-cols-7 gap-2 p-2 pt-16 overflow-x-hidden "'>
      {children}
    </main>
  )
}
