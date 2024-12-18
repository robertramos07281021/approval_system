/* eslint-disable react/prop-types */


export const Wrapper = ({children}) => {
  return (
    <div className='h-screen w-full relative flex flex-col overflow-x-hidden bg-no-repeat bg-cover' style={{backgroundImage: `url(/001.jpg)`}}>
      <div className='w-full h-full bg-blue-500/60 fixed top-0 left-0'></div>
      {children}
  </div>
  )
}
