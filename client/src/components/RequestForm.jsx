/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react"
import { useNewRequestMutation, useUserTicketsPageQuery } from "../redux/api/request"
import { useDispatch, useSelector } from "react-redux"
import {  setTickets } from "../redux/features/ticket/ticketSlice"

export const RequestForm = ({close, open, success}) => {
  const {userInfo} = useSelector((state)=> state.auth)
  const {ticketPage} = useSelector((state)=> state.ticket)
  const [requestForm, setRequestFrom] = useState({
    employee_name: "",
    position: "",
    department: userInfo?.department,
    request: "",
    qty: "",
    purpose: ""
  })
  const {data, refetch} = useUserTicketsPageQuery(ticketPage)
  const dispatch = useDispatch()
  const requests = ['SIM','HANDSET']
  const [confirmation, setConfirmation] = useState(false)
  const [required , setRequired] = useState(false)
  const [confirmTransition, setConfirmTransition] = useState('-translate-y-10 opacity-0')

  useEffect(()=> {
    dispatch(setTickets(data))
    refetch()
  },[ticketPage])

  const handleSubmit = (e) => {
    e.preventDefault()
    if(
      requestForm.employee_name === "" || 
      requestForm.position === "" ||
      requestForm.department === "" ||
      requestForm.request === "" ||
      requestForm.purpose === ""
    ) {
        setRequired(true)
    } else {
      setConfirmation(true)
      setRequired(false)
      setTimeout(()=> {
        setConfirmTransition('-translate-y-0 opacity-100')
      })
    }
  }

  const [openForm, setOpenForm] = useState('-translate-y-10 opacity-0')
  useEffect(()=> {
    if(open) {
      setOpenForm("-translate-y-0 opacity-100")
    } 
  },[open])

  const [newRequest] = useNewRequestMutation()

  const handleSubmitData = async()=> {
    const res = await newRequest(requestForm)
    if(!res.error) {
      setRequestFrom({
        employee_name: "",
        position: "",
        department: "",
        request: "",
        purpose: "",
        qty: ""
      })
      refetch()
      success()
      close()
    }
  }

  return (
    <div className='w-full h-full fixed bg-black/10 backdrop-blur-[1px] left-0 top-0 z-50 flex items-center justify-center'>
      <div className={`w-4/12 bg-white min-h-5/6 py-5 shadow-black/10 shadow-lg rounded-md flex items-center justify-center flex-col gap-5 relative duration-700 transition-all ease-in-out ${openForm} `}>
        <p className="text-3xl font-bold">Request Form</p>
        <form className="w-full 10 flex flex-col gap-2 px-20" onSubmit={handleSubmit}>
          {
            required &&
            <p className="text-xs font-bold text-center text-red-500">All fields are required</p>
          }
          <label>
            <span className="font-semibold">Employee Name :</span>
            <input type="text" value={requestForm.employee_name} className="w-full border rounded border-blue-500 px-2 py-1 focus:outline-blue-800" onChange={(e)=> setRequestFrom({...requestForm, employee_name: e.target.value})} />
          </label>
          <label>
            <span className="font-semibold">Position Title :</span>
            <input type="text" value={requestForm.position} className="w-full border rounded border-blue-500 px-2 py-1 focus:outline-blue-800" onChange={(e)=> setRequestFrom({...requestForm, position: e.target.value})}/>
          </label>
    
          <label>
            <span className="font-semibold">Request :</span>
            <select className="w-full border rounded border-blue-500 px-2 py-1 focus:outline-blue-800" onChange={(e)=> setRequestFrom({...requestForm, request: e.target.value})}>
              <option value="">Select Request</option>
                {requests.map((request,index) => 
                  <option key={index} value={request.toUpperCase()}>{request.toUpperCase()}</option>
                )}
            </select>
          </label>
          <label>
            <span className="font-semibold">Quantity :</span>
            <input type="number" min={1} value={requestForm.qty}className="w-full border rounded border-blue-500 px-2 py-1 focus:outline-blue-800" onChange={(e)=> setRequestFrom({...requestForm, qty: e.target.value})}/>
          </label>
          <label>
            <span className="font-semibold">Purpose :</span>
            <textarea value={requestForm.purpose} className="resize-none w-full border rounded border-blue-500 px-2 py-1 focus:outline-blue-800 h-24" onChange={(e)=> setRequestFrom({...requestForm, purpose: e.target.value})}></textarea>
          </label>
          <div className="flex items-center justify-center mt-5 gap-5">
            <button className="border-2 w-36 py-2 text-lg text-white bg-blue-500 rounded  border-blue-500 hover:text-blue-500 font-bold hover:bg-white duration-200 ease-in-out ">Submit</button>
            <div className="border-2 w-36 py-2 text-lg text-white bg-slate-500 rounded  border-slate-500 hover:text-slate-500 font-bold hover:bg-white duration-200 ease-in-out text-center cursor-pointer " onClick={()=> {  setOpenForm("-translate-y-10 opacity-0") ; setTimeout(()=> {close()},700)} }>Cancel</div>
          </div>
        </form>

        {
          confirmation && 
          <div className="absolute w-full h-full flex items-center justify-center">
            <div className={`h-56 w-96 bg-white border shadow-lg rounded-md shadow-black/20 flex flex-col overflow-hidden transition-all duration-700 ${confirmTransition}`}>
              <p className="p-2 text-xl font-bold text-white bg-blue-500">Confirmation</p>
              <div className="flex flex-col w-full h-full gap-5 items-center justify-center">
                <p className="font-semibold">Are you sure for this Request?</p>
                <div className="flex gap-5">
                  <button className="border-2 border-blue-500 bg-blue-500 text-white hover:text-blue-500 hover:bg-white w-24 py-2 rounded duration-200 ease-in-out font-bold" onClick={handleSubmitData}>Yes</button>
                  <button className="border-2 border-slate-500 bg-slate-500 text-white hover:text-slate-500 hover:bg-white w-24 py-2 rounded duration-200 ease-in-out font-bold" onClick={()=> {setConfirmTransition('-translate-y-10 opacity-0'); setTimeout(()=> {setConfirmation(false)},700)  }}>No</button>
                </div>
              </div>
            </div>
          </div>
        }

      </div>
    </div>
  )
}
