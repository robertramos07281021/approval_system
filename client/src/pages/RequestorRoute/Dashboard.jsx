/* eslint-disable react-hooks/exhaustive-deps */
import { useDispatch, useSelector } from "react-redux"
import { useMaxPagesSearchQuery, useSearchQuery, useTicketOpenMutation, useUserTicketDeleteMutation, useUserTicketReattemptMutation, useUserTicketsPageQuery, useUserTicketsQuery, useUserTicketUpdateMutation } from "../../redux/api/request"
import { useEffect, useState } from "react"
import { removeTicket, setTicket, setTickets } from "../../redux/features/ticket/ticketSlice"
import { TicketPagination } from "../../components/TicketPagination"
import { OutletHeader } from "../../components/OutletHeader"
import { Confirmation } from "../../components/Confirmation"
import { Notification } from "../../components/Notification"
import { DashboardWrapper } from "../../components/DashboardWrapper"
import { DateFormat } from "../../components/DateFormat"
import { StatusColor } from "../../components/StatusColor"
import { Search } from "../../components/Search"

export const Dashboard = () => {
  const {ticket, tickets, ticketPage, search} = useSelector((state)=> state.ticket)
  const [ticketOpen] = useTicketOpenMutation()
  const {data: userTicketsPage, refetch, isLoading:userTicketsLoading} = useUserTicketsPageQuery(ticketPage)
  const {data: userTicket, refetch:userTickets} = useUserTicketsQuery()
  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState(false)
  const {data: searchQuery, refetch: searchRefetch, isLoading:searchLoading} = useSearchQuery({page: ticketPage, query: search})
  const [transition, setTransition] = useState('-translate-y-5 opacity-0')
  const [update, setUpdate] = useState(false)
  const [required, setRequired] = useState(false)
  const [successReAttempt, setSuccessReAttempt] = useState(false)
  const [successUpdate, setSuccessUpdate] = useState(false)
  const [successDelete, setSuccessDelete] = useState(false)
  const [reattempt, setReattempt] = useState(false)
  const [submitData, setSubmitData] = useState(false)
  const [userTicketReattempt] = useUserTicketReattemptMutation()
  const [rejectedData, setRejectedData] = useState({
    employee_name: "",
    position: "",
    request: "",
    qty: "",
    purpose: ""
  })
  
  const [submitUpdateData, setSubmitUpdateData] = useState(false)
  const [userTicketUpdate] = useUserTicketUpdateMutation()
  const [submitDeleteTicket ,setSubmitDeleteTicket] = useState(false)
  const [deleteTicket] = useUserTicketDeleteMutation()
  const {data: maxPageSearch,refetch: maxPagesRefetch} = useMaxPagesSearchQuery(search)
  const forScroll = document.getElementById('forScroll')

  useEffect(()=> {
    if(search.trim() === "") {
      dispatch(setTickets(userTicketsPage))
    }  else {
      dispatch(setTickets(searchQuery))
      maxPagesRefetch()
    }
  },[userTicketsPage,searchQuery,search,maxPageSearch,refetch])

  useEffect(()=> {
    const timer = setTimeout(()=> {
      if(search.trim() === "") {
        userTickets()
        refetch()
      } else {
        searchRefetch()
      }
    })
    return ()=> clearTimeout(timer)
  })

  useEffect(()=> {
    const timer = setTimeout(()=> {
      if(search.trim() === "") {
        refetch()
      } else {
        searchRefetch()
      }
    })
    return ()=> clearTimeout(timer)
  },[ticketPage])

  //handle open request info
  const handleOpen = async(id,data)=> {
    setIsOpen(true)
    setTimeout(()=> {
      setTransition("-translate-y-0 opacity-100")
    })
    await ticketOpen(id)
    dispatch(setTicket(data))
    refetch()
  }

  //handle close request info
  const handleClose = () => {
    setTransition("-translate-y-5 opacity-0")
    setTimeout(()=> {
      setIsOpen(false);
      dispatch(removeTicket())
      setReattempt(false)
      setUpdate(false)
      setRequired(false)
    },700)
  }

  //hanlde reattempt  ==========================================
  const handleReattempt = () => {
    setReattempt(true)
    forScroll.scrollTop = 0;
  }

  useEffect(()=> {
    setRejectedData({
      employee_name: ticket?.employee_name,
      position: ticket?.position,
      request: ticket?.request,
      qty: ticket?.qty,
      purpose: ticket?.purpose
    })
  },[ticket])

  const handleSubmitData = async() => {
    const res = await userTicketReattempt({id: ticket._id, data: rejectedData})
    if(!res?.error) {
      setSubmitData(false)
      dispatch(removeTicket())
      setIsOpen(false)
      refetch()
      setSuccessReAttempt(true)
      setReattempt(false)
      setTransition("-translate-y-5 opacity-0")
    }
  }

  const handleSubmitReattempt = () => {
    if(!rejectedData.employee_name || !rejectedData.position || !rejectedData.request || !rejectedData.qty || !rejectedData.purpose) {
      setRequired(true)
    } else {
      setRequired(false)
      setSubmitData(true)
    }

  }
  // =========================================================================

  //update ticket ===========================================================
  const handleUpdate = ()=> {
    setUpdate(true)
  }

  const handleSubmitDataUpdate = async()=> {
    const res = await userTicketUpdate({id: ticket?._id, data: rejectedData}) 
    if(!res?.error) {
      setUpdate(false)
      setSubmitUpdateData(false)
      setRequired(false)
      refetch()
      setIsOpen(false)
      setSuccessUpdate(true)
      setTransition("-translate-y-5 opacity-0")
    }
  }

  const handleSubmitUpdate = () => {
    if(!rejectedData.employee_name || !rejectedData.position || !rejectedData.request ||  !rejectedData.qty || !rejectedData.purpose) {
      setRequired(true)
    } else {
      setRequired(false)
      setSubmitUpdateData(true)
    }
  }
  // ==============================================================================

  //delete ticket ================================================================

  const handleDelete = ()=> {
    setSubmitDeleteTicket(true)
  }

  const handleDeleteTicket = async()=> {
    const res = await deleteTicket(ticket._id)
    if(!res.error) {
      setSubmitDeleteTicket(false)
      setIsOpen(false)
      refetch()
      setSuccessDelete(true)
      setTransition("-translate-y-5 opacity-0")
    }
  }

  return (
    <>
      <DashboardWrapper>
        <div className="flex justify-between bg-white">
          <OutletHeader title="Dashboard"/>
        </div>
        <div className=" h-full flex flex-col pt-2 p-4">
          <Search data={userTicket} withPage={userTicketsPage} refetchSearch={()=> searchRefetch()} refetchWithPage={()=> refetch()}/>
          <hr className="border border-black mt-1" />
          <div className="grid grid-cols-7 px-2 text-center border-b-2 py-3 font-bold border-black mb-1">
            <div >Ticket No.</div>
            <div className='col-span-2'>Employee Name</div>
            <div>Position</div>
            <div>Request</div>
            <div>Quantity</div>
            <div>Status</div>
          </div>

          {
            (!searchLoading || !userTicketsLoading) ? 
              (
              <>
                {tickets?.map((ticket)=> 
                  <div key={ticket._id} className="even:bg-slate-200 p-2 grid grid-cols-7 text-center hover:border-slate-500 cursor-pointer border border-white" onClick={()=> handleOpen(ticket._id,ticket)}>
                    <div  className="font-mono">
                      {ticket.ticket_no}
                    </div>
                    <div className='col-span-2'>
                      {ticket.employee_name}
                    </div>
                    <div>
                      {ticket.position}
                    </div>
                    <div>
                      {ticket.request}
                    </div>
                    <div>
                      {ticket.qty}
                    </div>
                    <StatusColor isOpen={ticket.is_open_object.is_open} ticket={ticket}/>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex-col flex items-center justify-center">
                <h1 className="font-black animate-pulse text-2xl">Loading</h1>
                <div className="border-8 border-dotted border-black w-16 h-16 rounded-full animate-spin"></div>
              </div>
            )
          }


         
        </div>
        {
          ((Math.ceil(userTicket?.length/10) > 1 && search.trim() === "") || (search.trim() !== "" && Math.ceil(maxPageSearch/10) > 1 )) &&
          <div className="w-full">
            <TicketPagination/>
          </div>
        }
      </DashboardWrapper>
      {isOpen && 
      <div className="absolute left-0 top-0 bg-white/50 w-full h-full z-50 flex items-center justify-center">
        <div className={`w-6/12 h-[90%] flex flex-col rounded-md shadow-lg shadow-black/50 bg-white relative overflow-hidden transition-all duration-700 ${transition}`}>
          <div className="border-2 w-8 h-8 flex items-center justify-center border-black/20 absolute top-2 right-2 cursor-pointer rounded-full bg-white hover:bg-black hover:text-white duration-200 ease-in-out font-semibold" onClick={handleClose}>X</div>
          <h1 className="text-2xl font-bold pt-2 w-full text-center bg-blue-500 text-white h-28 flex items-center justify-center">Request Information</h1>
          <div className="w-full h-full overflow-y-auto p-10 gap-5 flex flex-col" id="forScroll">
            <div className="flex gap-2 text-lg">
              <h1 className="font-bold">Ticket No : </h1>
              <p>{ticket.ticket_no}</p>
            </div>
              {
                required && 
                <div className="flex justify-end text-red-500 text-xs font-bold tracking-wider">All fields are required</div>
              }
            <div className="flex flex-col border-4">
              <div className=" flex border-b-4">
                <div className="w-full border-r-4 p-3 font-bold">Status :</div>
                <div className="w-full  p-3 font-black">
                  {
                    !ticket.aom_approval_details?.is_approve_aom && ticket.is_declined  && 
                    <p className="text-red-500">Reject</p>
                  }
                  {
                    !ticket.aom_approval_details?.is_approve_aom && !ticket.is_declined && !ticket.verified_details?.is_verified && 
                    <p className="text-cyan-500">For AOM Approval</p>
                  }
                  {
                    ticket.aom_approval_details?.is_approve_aom && !ticket.is_declined && !ticket.semi_approved_details?.is_approve_semi && !ticket.oos &&
                    <p className="text-indigo-700">For Ms Wendy Approval</p>
                  }
                  {
                    ticket.semi_approved_details?.is_approve_semi && !ticket.is_declined && !ticket.verified_details?.is_verified && !ticket.oos && !ticket.fraud_details?.is_fraud && ticket?.request === "SIM" &&
                    <p className="text-yellow-500">For IT Verification</p>
                  }
                  {
                    ticket?.semi_approved_details?.is_approve_semi && !ticket?.is_declined && (!ticket?.purchasing_approval?.new_items && !ticket?.purchasing_approval?.used_items) && !ticket?.oos && !ticket.fraud_details?.is_fraud && ticket?.request === "HANDSET" &&
                    <p className="text-lime-500">Purchasing Approval</p>
                  }
                  {
                    ticket.oos && !ticket.verified_details?.is_verified &&
                    <p className="text-orange-500">Out of Stock</p>
                  }
                  {
                    (ticket.verified_details?.is_verified || ticket?.purchasing_approval?.new_items || ticket?.purchasing_approval?.used_items) && !ticket.last_approval_details?.last_approval && !ticket.fraud_details?.is_fraud &&
                    <p className="text-blue-500">For Ms Ethel Approval</p>
                  }
                  {
                    ticket.fraud_details?.is_fraud &&
                    <p className="text-orange-800">Fraud</p>
                  }
                  {
                    ticket.last_approval_details?.last_approval && !ticket.complete_details?.is_complete &&
                    <p className="text-black">For Receiving</p>
                  }
                  {
                    ticket.complete_details?.is_complete && !ticket.fraud_details?.is_fraud &&
                    <p className="text-black">Complete</p>
                  }
                </div>
              </div>
              <div className="border-b-4 flex ">

                <div className="w-full border-r-4 p-3 font-bold">Employee Name :</div>
                <div className={`w-full p-3 ${reattempt && "border border-red-500"} ${update && "border border-green-500"}`}>
                  {
                    !reattempt && !update ? (
                      <>
                        {ticket?.employee_name?.toUpperCase()}
                      </>
                    ) : (
                      <input type="text" 
                      className="outline-none w-full" 
                      value={rejectedData.employee_name} 
                      onChange={(e)=> setRejectedData({...rejectedData, employee_name: e.target.value})}
                      max={40}
                      />
                    )
                  }
                  </div>
              </div>
              <div className="border-b-4 flex ">
                <div className="w-full border-r-4 p-3 font-bold">Position :</div>
                <div className={`w-full p-3 ${reattempt && "border border-red-500"} ${update && "border border-green-500"}`}>
                  {
                    !reattempt && !update ? (
                      <>
                        {ticket?.position?.toUpperCase()}
                      </>
                    ) : (
                      <input type="text" 
                      className="outline-none w-full"
                      value={rejectedData.position} 
                      onChange={(e)=> setRejectedData({...rejectedData, position: e.target.value})}
                      max={40}
                      />
                    )
                  }
                </div>
              </div>
              <div className="border-b-4 flex ">
                <div className="w-full border-r-4 p-3 font-bold">Request :</div>
                <div className={`w-full p-3 ${reattempt && "border border-red-500"} ${update && "border border-green-500"}`}>     
                  {
                    !reattempt && !update ? (
                      <>
                        {ticket?.request}
                      </>
                    ) : (
                      <select className="outline-none w-full"
                      value={rejectedData.request} 
                      onChange={(e)=> setRejectedData({...rejectedData, request: e.target.value})}>
                        <option value="SIM">SIM</option>
                        <option value="HANDSET">HANDSET</option>
                      </select>
                    )
                  }
                </div>
              </div>
              <div className="border-b-4 flex">
                <div className="w-full border-r-4 p-3 font-bold">Quantity :</div>
                <div className={`w-full  p-3 ${reattempt && "border border-red-500"} ${update && "border border-green-500"}`}>
                  {
                    !reattempt && !update ? (
                      <>
                        {ticket?.qty}
                      </>
                    ) : (
                      <input type="number" 
                      className="outline-none w-full"
                      value={rejectedData.qty} 
                      onChange={(e)=> setRejectedData({...rejectedData, qty: e.target.value})}
                      max={99}
                      min={0}
                      />
                    )
                  }
                </div>
              </div>
              <div className="border-b-4 flex ">
                <div className="w-full border-r-4 p-3 font-bold">Purpose :</div>
                <div className={`w-full  p-3 h-44 overflow-y-auto text-justify ${reattempt && "border border-red-500"} ${update && "border border-green-500"}`}>
                {
                  !reattempt && !update ? (
                    <>
                        {ticket.purpose}
                      </>
                    ) : (

                      <textarea 
                      className="outline-none h-full w-full resize-none"
                      value={rejectedData.purpose} 
                      onChange={(e)=> setRejectedData({...rejectedData, purpose: e.target.value})}
                      ></textarea>
                    )
                  }
                </div>
              </div>
              
              <div className="border-b-4 flex ">
                <div className="w-full border-r-4 p-3 font-bold">Requested Date :</div>
                <div className="w-full p-3">
                  <DateFormat date={ticket.createdAt}/>
                </div>
              </div>
              {
                ticket.aom_approval_details?.is_approve_aom &&
                <>
                  <div className="border-b-4 flex ">
                    <div className="w-full border-r-4 p-3 font-bold">AOM Approved Date :</div>
                    <div className="w-full p-3">
                      <DateFormat date={ticket.aom_approval_details?.approve_date_aom}/>
                    </div>
                  </div>
                  <div className="border-b-4 flex ">
                    <div className="w-full border-r-4 p-3 font-bold">AOM Comment :</div>
                    <div className={`w-full p-3 overflow-y-auto${ticket.aom_approval_details?.aom_approved_comments && " h-44"}`}>
                      { ticket.aom_approval_details?.aom_approved_comments ? ticket.aom_approval_details?.aom_approved_comments : "N/A"
                      }
                    </div>
                  </div>
                </>
              }
              {
                ticket.semi_approved_details?.is_approve_semi &&
                <>
                  <div className="border-b-4 flex ">
                    <div className="w-full border-r-4 p-3 font-bold">Ms Wendy Approved Date:</div>
                    <div className="w-full p-3">
                      <DateFormat date={ticket.semi_approved_details?.semi_approved_date}/>
                    </div>
                  </div>
                  <div className="border-b-4 flex ">
                    <div className="w-full border-r-4 p-3 font-bold">Ms Wendy Comment :</div>
                    <div className={`w-full p-3 overflow-y-auto${ticket.semi_approved_details?.semi_approved_comment ? " h-44" : ""}`}>
                      { ticket.semi_approved_details?.semi_approved_comment ? ticket.semi_approved_details?.semi_approved_comment : "N/A"
                      }
                    </div>
                  </div>
                </>
              }
              {
                ticket.verified_details?.is_verified &&
                <>
                  <div className="border-b-4 flex ">
                    <div className="w-full border-r-4 p-3 font-bold">Verified Date:</div>
                    <div className="w-full p-3">
                      <DateFormat date={ticket.verified_details?.verified_date}/>
                    </div>
                  </div>
                  <div className="border-b-4 flex ">
                    <div className="w-full border-r-4 p-3 font-bold">Verification Comment :</div>
                    <div className={`w-full p-3 overflow-y-auto${ticket.verified_details?.verified_comment && " h-44"}`}>
                      { ticket.verified_details?.verified_comment ? ticket.verified_details?.verified_comment : "N/A"
                      }
                    </div>
                  </div>
                
                </>
              }
              {
                ticket.oos &&
                <div className="border-b-4 flex ">
                  <div className="w-full border-r-4 p-3 font-bold">Out of Stock Comment :</div>
                  <div className={`w-full p-3 overflow-y-auto${ticket.oos_comment ? " h-44" : ""}`}>
                    {
                      ticket.oos_comment ? ticket.oos_comment : "N/A"
                    }
                  </div>
                </div>
              }
              { ticket.declined_details?.length > 0 && 
                <div className="border-b-4 flex">
                  <div className="w-full border-r-4 p-3 font-bold">Reject Details :</div>
                  <div className={`w-full p-3 overflow-y-auto h-96`}>
                  {
                    ticket.declined_details.map((comment,index) => <div key={comment._id} className={`flex flex-col ${ticket?.declined_details?.length !== (index + 1) && "border-b-2" }`}>
                      <div className="flex">
                        { 
                          (index + 1) + ". " 
                        }<DateFormat date={comment?.declined_date}/>
                      </div>
                      <div className="indent-5 text-justify text-sm">
                        Rejected by : {comment.declined_by.toUpperCase()}
                      </div>
                      <div className="indent-5 text-justify text-sm">
                        Reason : {comment.declined_reason}
                      </div>
                    </div>)
                    }
                  </div>
                </div>
              }
              {
                ticket.fraud_details?.is_fraud &&(
                  <>
                    <div className="border-b-4 flex ">
                      <div className="w-full border-r-4 p-3 font-bold">Fraud Date :</div>
                      <div className="w-full p-3">
                        <DateFormat date={ticket.fraud_details?.fraud_date}/>
                      </div>
                    </div>
                    <div className="border-b-4 flex ">
                      <div className="w-full border-r-4 p-3 font-bold">Fraud Comment :</div>
                      <div className="w-full p-3 h-44 overflow-y-auto">{ticket.fraud_details?.fraud_comment}</div>
                    </div>
                    <div className="border-b-4 flex ">
                      <div className="w-full border-r-4 p-3 font-bold">Fraud By :</div>
                      <div className="w-full p-3">{ticket.fraud_details?.fraud_by.toUpperCase()}</div>
                    </div>
                  </>
                )
              }
              {
                ticket.complete_details?.is_complete && (
                  <>
                    <div className="border-b-4 flex ">
                      <div className="w-full border-r-4 p-3 font-bold">Complete Date :</div>
                      <div className="w-full p-3">
                        <DateFormat date={ticket.complete_details?.complete_date}/>
                      </div>
                    </div>
                    <div className="border-b-4 flex ">
                      <div className="w-full border-r-4 p-3 font-bold">Complete Comment :</div>
                      <div className={`w-full overflow-y-auto p-3${ticket.complete_details?.complete_comment ? " h-44" : ""} `}>
                        {
                         ticket.complete_details?.complete_comment ? ticket.complete_details?.complete_comment : ""
                        }
                      </div>
                    </div>
                    <div className="border-b-4 flex ">
                      <div className="w-full border-r-4 p-3 font-bold">Received By :</div>
                      <div className="w-full p-3">{ticket.complete_details?.receiver.toUpperCase()}</div>
                    </div>
                  </>
                )
              }
              {
               !ticket.aom_approval_details?.is_approve_aom && 
                <div className={`${update || ticket.is_declined ? "border-b-4 " : ""}flex`}>
                  <div className="w-full border-r-4 p-3 font-bold">Action :</div>
                  <div className="w-full p-3 flex gap-5 justify-end">
                  {
                    !ticket.is_declined && !ticket.aom_approval_details?.is_approve_aom && 
                    <i className="bi bi-pencil-square text-green-500 text-2xl 
                    cursor-pointer" onClick={handleUpdate}></i>
                  }
                  <i className="bi bi-trash3-fill text-red-500 text-2xl cursor-pointer" onClick={handleDelete}></i>
                  </div>
                </div>
              }
            {
              ticket.is_declined && !reattempt && 
              <div className="flex justify-end p-5">
                <button className="py-2 border-2 border-red-500 rounded w-40 bg-red-500 text-white shadow-md shadow-black/50 font-semibold hover:text-red-500 hover:bg-white duration-200 ease-in-out" onClick={handleReattempt}>Re-attempt</button>
              </div>
            }
            {
              reattempt && ticket.is_declined && !update && 
              <div className="flex justify-end p-5">
                <button className="py-2 border-2 border-red-500 rounded w-40 bg-red-500 text-white shadow-md shadow-black/50 font-semibold hover:text-red-500 hover:bg-white duration-200 ease-in-out" onClick={handleSubmitReattempt}>Submit</button>
              </div>
            }
            {
              !reattempt && !ticket.is_declined && update && 
              <div className="flex justify-end p-5">
                <button className="py-2 border-2 border-green-500 rounded w-40 bg-green-500 text-white shadow-md shadow-black/50 font-semibold hover:text-green-500 hover:bg-white duration-200 ease-in-out" onClick={handleSubmitUpdate}>Submit</button>
              </div>
            }
            </div>
          </div>
        </div>
      </div>
      }
      { submitData &&
      <Confirmation color="bg-red-500">
        <p className="text-lg font-semibold text-center px-5">Are you sure you want to RE-ATTEMPT this ticket?</p>
        <div className="flex gap-5">
          <button className="bg-red-500 border-2 border-red-500  w-24 py-2 text-lg font-semibold text-white rounded hover:bg-white hover:text-red-500 duration-200 ease-in-out" onClick={handleSubmitData}>Yes</button>
          <button className="bg-slate-500 border-2 border-slate-500  w-24 py-2 text-lg font-semibold text-white rounded hover:bg-white hover:text-slate-500 duration-200 ease-in-out" onClick={()=> setSubmitData(false)}>No</button>
        </div>  
      </Confirmation>
      }
      { submitUpdateData &&
      <Confirmation color="bg-green-500">
        <p className="text-lg font-semibold text-center px-5">Are you sure you want to UPDATE this ticket?</p>
        <div className="flex gap-5">
          <button className="bg-green-500 border-2 border-green-500  w-24 py-2 text-lg font-semibold text-white rounded hover:bg-white hover:text-green-500 duration-200 ease-in-out" onClick={handleSubmitDataUpdate}>Yes</button>
          <button className="bg-slate-500 border-2 border-slate-500  w-24 py-2 text-lg font-semibold text-white rounded hover:bg-white hover:text-slate-500 duration-200 ease-in-out" onClick={()=> setSubmitUpdateData(false)}>No</button>
        </div>  
      </Confirmation>
      }
      { submitDeleteTicket &&
      <Confirmation color="bg-red-500">
        <p className="text-lg font-semibold text-center px-5">Are you sure you want to DELETE this ticket?</p>
        <div className="flex gap-5">
          <button className="bg-red-500 border-2 border-red-500  w-24 py-2 text-lg font-semibold text-white rounded hover:bg-white hover:text-red-500 duration-200 ease-in-out" onClick={handleDeleteTicket}>Yes</button>
          <button className="bg-slate-500 border-2 border-slate-500  w-24 py-2 text-lg font-semibold text-white rounded hover:bg-white hover:text-slate-500 duration-200 ease-in-out" onClick={()=> setSubmitDeleteTicket(false)}>No</button>
        </div>  
      </Confirmation>
      }
      { 
        successReAttempt &&
        <Notification color="bg-red-500" transitions={successReAttempt} success={()=> setSuccessReAttempt(false)}>
          Ticket Is Successfully Re-attempt
        </Notification>
     
      }
      { 
        successUpdate &&
        <Notification color="bg-green-500" transitions={successUpdate} success={()=> setSuccessUpdate(false)}>
          Ticket Is Successfully Updated
        </Notification>
      }
      { 
        successDelete &&
        <Notification color="bg-red-500" transitions={successDelete} success={()=> setSuccessDelete(false)}>
          Ticket Is Successfully Delete
        </Notification>
      }
    </>
  )
}

 