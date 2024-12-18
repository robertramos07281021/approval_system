/* eslint-disable react/prop-types */


export const Confirmation = ({children,color}) => {
  return (
    <div className="w-full h-full bg-white/10 backdrop-blur-[1px] absolute left-0 top-0 flex items-center justify-center z-50">
      <div className="w-96 h-64 bg-white shadow-md rounded shadow-black/50 flex flex-col overflow-hidden">
        <p className={`p-2 text-xl ${color} text-white font-bold`}>Confirmation</p>
        <div className="w-full h-full flex items-center justify-center flex-col gap-5">
           {children}
        </div>
      </div>
    </div>
  )
}
