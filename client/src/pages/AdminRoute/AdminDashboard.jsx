/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { OutletHeader } from "../../components/OutletHeader"
import { TicketPagination } from "../../components/TicketPagination"
import { 
  useAllTicketsQuery, 
  useAllTicketsWithPageQuery, 
  useDeleteFraudMutation, 
  useMaxPagesSearchQuery, 
  useSearchQuery, 
  useTicketOosCommentUpdateMutation, 
  useTicketOosUpdateMutation, 
  useTicketOpenMutation, 
  useTicketVerifyUpdateMutation,
  useUpdateFraudMutation,
  useUpdateIsCompleteMutation,  
} from "../../redux/api/request"
import { useDispatch, useSelector } from "react-redux"
import { removeTicket, setTicket, setTickets } from "../../redux/features/ticket/ticketSlice"
import { Confirmation } from "../../components/Confirmation"
import { Notification } from "../../components/Notification"
import { DashboardWrapper } from "../../components/DashboardWrapper"
import { StatusColor } from "../../components/StatusColor"
import { RequestInformationModal } from "../../components/RequestInformationModal"
import { Search } from "../../components/Search"


export const AdminDashboard = () => {
  const {userInfo} = useSelector((state) => state.auth)
  const {data: allTickets, refetch} = useAllTicketsQuery()
  const {ticketPage, ticket, tickets,search} = useSelector((state) => state.ticket)
  const {data: allTicketWithPage, refetch:ticketPageRefetch, isLoading:loadingTwp} = useAllTicketsWithPageQuery(ticketPage)
  const {data: searchQuery, refetch: searchRefetch, isLoading} = useSearchQuery({page: ticketPage, query: search})
  const [isOpen, setIsOpen] = useState(false)
  const [transition, setTransition] = useState('-translate-y-5 opacity-0')
  const dispatch = useDispatch()
  const [ticketOpen] = useTicketOpenMutation()
  const [comment, setComment] = useState("")
  const [verifyModal, setVerifyModal] = useState(false)
  const [ticketVerifyUpdate] = useTicketVerifyUpdateMutation()
  const [successVerified, setSuccessVerified] = useState(false)
  const [oosModal, setOosModal] = useState(false)
  const [ticketOosUpdate] = useTicketOosUpdateMutation()
  const [successOos, setSuccessOos] = useState(false)
  const [updateOosComment, setUpdateOosComment] = useState(false)
  const [oosComment, setOosComment] = useState("")
  const [updateOosModal, setUpdateOosModal] = useState(false)
  const [ticketOosCommentUpdate] = useTicketOosCommentUpdateMutation()
  const [updateOosSuccess, setUpdateOosSuccess] = useState(false)
  const [fraud, setFraud] = useState(false)
  const [updateFraud] = useUpdateFraudMutation()
  const [successFraud, setSuccessFraud] = useState(false)
  const [error, setError] = useState(false)
  const [deleteFraudModal, setDeleteFraudModal] = useState(false)
  const [deleteFraud] = useDeleteFraudMutation()
  const [deleteFraudSuccess, setDeleteFraudSuccess] = useState(false)
  const [updateIsComplete] = useUpdateIsCompleteMutation()
  const [completeModal, setCompleteModal] = useState(false)
  const [receiver, setReceiver] = useState("")
  const [successComplete, setSuccessComplete] = useState(false)
  const [receiverError, setReceiverError] = useState(false)
  const {data: maxPageSearch,refetch: maxPagesRefetch} = useMaxPagesSearchQuery(search)


  useEffect(()=> {
    setOosComment(ticket?.oos_comment)
  },[ticket])

  //for console purpose only
  useEffect(()=> {
    if(search.trim() === "") {
      dispatch(setTickets(allTicketWithPage))
      ticketPageRefetch()
    } else {
      searchRefetch()
      dispatch(setTickets(searchQuery))
 
    }
  },[allTicketWithPage,searchQuery,search,maxPageSearch])

  // refetching data
  useEffect(()=> {
    const timer = setTimeout(()=> {
      if(search.trim() === ""){
        refetch()
        ticketPageRefetch()
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


  //is open
  const handleOpen = async(id, data) => {
    setIsOpen(true)
    setTimeout(()=> {
      setTransition("-translate-y-0 opacity-100")
    })
    await ticketOpen(id)
    dispatch(setTicket(data))
    ticketPageRefetch()
  }

  //close button
  const handleClose = ()=> {
    setTransition("-translate-y-5 opacity-0")
    setTimeout(()=> {
      setIsOpen(false);
      dispatch(removeTicket())
      setUpdateOosComment(false)
      setError(false)
      setComment("")
    },700)
  }

  // verifing tickets =============================================
  const handleVerifyTicket = ()=> {
    setVerifyModal(true)
  }

  const handleSubmitVerify = async()=> {
    const res = await ticketVerifyUpdate({id: ticket._id, comment: comment})
    if(!res.error) {
      setTransition("-translate-y-5 opacity-0")
      setIsOpen(false);
      setVerifyModal(false)
      setComment("")
      dispatch(removeTicket())
      setSuccessVerified(true)
      ticketPageRefetch()
    }
  }

  //update oos ================================================
  const handleOosTicket = ()=> {
    if(comment.trim() === ""){
      setError(true)
    }else {
      setError(false)
      setOosModal(true)
    }
  }

  const handleSubmitOos = async() => {
    const res = await ticketOosUpdate({id: ticket._id, comment: comment})
    if(!res.error) {
      setTransition("-translate-y-5 opacity-0")
      setIsOpen(false);
      setOosModal(false)
      setComment("")
      dispatch(removeTicket())
      setSuccessOos(true)
      ticketPageRefetch()
    }
  }

  const handleUpdateOosComment = async() => {
    setUpdateOosComment(true)
  }

  const handleUOCModal = ()=> {
    setUpdateOosModal(true)
  
  }
  
  const handleSubmitOosUpdate = async() => {
    const res = await ticketOosCommentUpdate({id: ticket._id, comment: oosComment})

    if(!res.error) {
      setIsOpen(false);
      setUpdateOosModal(false)
      setTransition("-translate-y-5 opacity-0")
      setOosComment("")
      dispatch(removeTicket())
      ticketPageRefetch()
      setUpdateOosSuccess(true)
      setUpdateOosComment(false)
    }
  }
//  ==================================================================

//fraud deleting 
const handleDeleteFraudButton = ()=> {
  setDeleteFraudModal(true)
}

const handleSubmitDeleteFraud = async()=> {
  const res = await deleteFraud(ticket._id)
  if(!res.error) {
    setIsOpen(false)
    setDeleteFraudModal(false)
    setTransition("-translate-y-5 opacity-0")
    dispatch(removeTicket())
    ticketPageRefetch()
    setDeleteFraudSuccess(true)
  }
}

//fraud ticket ===================================================
const handleButtonFraud = ()=> {
  if(comment.trim() === ""){
    setError(true)
  }else {
    setError(false)
    setFraud(true)
  }
}

const handleSubmitFraud = async()=> {
  const res = await updateFraud({id: ticket._id, comment: comment,name: userInfo.name + " - " + userInfo.type})
  if(!res.error) {
    setIsOpen(false)
    setSuccessFraud(true)
    setTransition("-translate-y-5 opacity-0")
    setFraud(false)
    ticketPageRefetch()
  }
}
// ==============================================================================

//for receiving =================================================================


const handleReceiveButton = ()=> {
  if(receiver.trim() === "") {
    setReceiverError(true)
  } else {
    setReceiverError(false)
    setCompleteModal(true)
  }
}

const handleSubmitReceived = async()=> {
  const res = await updateIsComplete({id: ticket._id, comment: comment, name: receiver})
  if(!res.error) {
    setCompleteModal(false)
    setIsOpen(false)
    setTransition("-translate-y-5 opacity-0")
    ticketPageRefetch()
    setSuccessComplete(true)
    setReceiver("")
    setComment("")
  }
}

// ============================================================================
  return (
    <>
      <DashboardWrapper>
        <div className="flex justify-between bg-white">
          <OutletHeader title="Dashboard"/>
        </div>
        <div className=" h-full flex flex-col pt-2 p-4">
        
          <Search data={allTickets} withPage={allTicketWithPage} refetchSearch={()=> searchRefetch()} refetchWithPage={()=> maxPagesRefetch()}/>
          <hr  className="border border-black mt-1"/>
          <div className="h-full  ">
            <div className="mt-1 h-full flex flex-col">
              <div className="grid grid-cols-6 px-2 text-center border-b-2 py-2 font-bold border-black mb-1">
                <div >Ticket No.</div>
                <div >Employee Name</div>
                <div >Department</div>
                <div>Request</div>
                <div>Quantity</div>
                <div>Status</div>
              </div>
              {
                (loadingTwp || isLoading) ? 
                (<>
                {tickets?.map((ticket)=> 
                  <div key={ticket._id} className="even:bg-slate-200 p-2 grid grid-cols-6 text-center hover:border-slate-500 cursor-pointer border border-white" 
                  onClick={()=> handleOpen(ticket._id,ticket)}
                  >
                    <div  className="font-mono">
                      {ticket.ticket_no}
                    </div>
                    <div >
                      {ticket.employee_name}
                    </div>
                    <div>
                      {ticket.department}
                    </div>
                    <div>
                      {ticket.request}
                    </div>
                    <div>
                      {ticket.qty}
                    </div>
                    <StatusColor isOpen={ticket.is_open_object.is_open_admin} ticket={ticket}/>
                  </div>
                )}
                </>) :
                (<div className="w-full h-full flex-col flex items-center justify-center">
                  <h1 className="font-black animate-pulse text-2xl">Loading</h1>
                  <div className="border-8 border-dotted border-black w-16 h-16 rounded-full animate-spin"></div>
                </div>)
              }
            </div>
          </div>
        </div>
        {
         ((Math.ceil(allTickets?.length/10) > 1 && search.trim() === "") || (search.trim() !== "" && Math.ceil(maxPageSearch/10) > 1 )) &&
         <div className="w-full">
           <TicketPagination/>
         </div>
        }
      </DashboardWrapper>
      {
        isOpen && 
        <div className="absolute left-0 top-0 bg-white/50 w-full h-full z-50 flex items-center justify-center">
        <div className={`w-6/12 h-[90%] flex flex-col rounded-md shadow-lg shadow-black/50 bg-white relative overflow-hidden transition-all duration-700 ${transition}`}>
          <div className="border-2 w-8 h-8 flex items-center justify-center border-black/20 absolute top-2 right-2 cursor-pointer rounded-full bg-white hover:bg-black hover:text-white duration-200 ease-in-out font-semibold " onClick={handleClose}>X</div>
          <RequestInformationModal ticket={ticket}>
            {
              ticket.oos_comment && !ticket.verified_details?.is_verified && ticket.request === "SIM" && 
              <div className="flex border-b-4">
                <div className="w-full border-r-4 p-3 font-bold flex flex-col justify-between">
                  Out of stock comments :
                  <div className="flex justify-end">
                    { !updateOosComment ? (
                      <i className="bi bi-pencil-square text-4xl text-orange-500 cursor-pointer" onClick={handleUpdateOosComment}></i>
                    ) : (
                    <button className="bg-orange-500 rounded border-2 py-2 px-10 hover:bg-white text-white border-orange-500 hover:text-orange-500 duration-200 ease-in-out shadow-md shadow-black/50" onClick={handleUOCModal}>Submit</button>
                    ) }
                  </div>
                </div>

                <div className={`w-full p-3 h-96 ${updateOosComment && "border border-orange-500"}`}>
                  { !updateOosComment ? (
                      <>
                        {ticket?.oos_comment}
                      </>
                    ) : (
                      <textarea className="w-full outline-none resize-none h-full" placeholder="Enter new comments " value={oosComment} onChange={(e)=>setOosComment(e.target.value) }></textarea>
                    )
                  }
                </div>
              </div>
            }
            {
              !ticket.verified_details?.is_verified && ticket.semi_approved_details?.is_approve_semi && !ticket.fraud_details.is_fraud && ticket.request === "SIM" &&
              <div className="flex border-b-4">
                <div className="w-full p-3 border-r-4 font-bold">Comments :</div>
                <textarea value={comment} onChange={(e)=> setComment(e.target.value)} className={`w-full p-3 resize-none h-44 ${error && "border border-red-500"}`} placeholder="Write comment here...">
                      </textarea>
              </div>
            }
            { 
              ticket.last_approval_details?.last_approval && !ticket.complete_details?.is_complete && 
              <>
                <label className="flex border-b-4">
                  <div className="w-full border-r-4 p-3 font-bold">Receiver :</div>
                    <input type="text" className={`w-full p-3 ${receiverError && "border border-red-500"}`} value={receiver} onChange={(e)=> setReceiver(e.target.value)} placeholder="Enter Receiver Name"/>
  
                </label>
                <label className="flex border-b-4">
                  <div className="w-full p-3 border-r-4 font-bold">Comments :</div>
                  <textarea value={comment} onChange={(e)=> setComment(e.target.value)} className={`w-full p-3  resize-none h-44  `} placeholder="Write comment here...">
                        </textarea>
                </label>
              </>
            }
            {
              !ticket.verified_details?.is_verified && ticket.semi_approved_details?.is_approve_semi && !ticket.fraud_details?.is_fraud && ticket.request === "SIM" && (
                <div className="flex p-5 justify-end gap-5 border-b-4">
                  <button className="w-36 py-2 border-2 border-yellow-400 rounded-md bg-yellow-400 shadow-md shadow-black/50 font-bold hover:text-yellow-400 hover:bg-white duration-200 text-white" onClick={handleVerifyTicket}>Verified</button>
                  {
                    !ticket.oos &&
                    <button className="w-36 py-2 border-2 border-orange-500 rounded-md bg-orange-500 shadow-md shadow-black/50 font-bold hover:text-orange-500 hover:bg-white text-white  duration-200" onClick={handleOosTicket}>Out of Stock</button>
                  }
                  <button className="w-36 py-2 border-2 border-orange-800 rounded-md bg-orange-800 shadow-md shadow-black/50 font-bold hover:text-orange-800 hover:bg-white duration-200 text-white" onClick={handleButtonFraud}>Reject</button>
                </div>
              )
            }
            {
              !ticket.complete_details?.is_complete && ticket.last_approval_details?.last_approval && (
                <div className="flex p-5 justify-end gap-5 border-b-4 ">
                  <button className="w-36 py-2 border-2 border-black rounded-md bg-black shadow-md shadow-black/50 font-bold hover:text-black hover:bg-white duration-200 text-white" onClick={handleReceiveButton}>Received</button>
                </div>
              )
            }
            {
              ticket.fraud_details?.is_fraud && (
                <div className="flex p-5 justify-end gap-5 border-b-4 ">
                  <i className="bi bi-trash3-fill w-36 py-2 border-2 border-orange-800 rounded-md bg-orange-800 shadow-md shadow-black/50 font-bold hover:text-orange-800 hover:bg-white duration-200 text-white text-2xl cursor-pointer text-center" onClick={handleDeleteFraudButton}></i>
                </div>
              )
            }
          </RequestInformationModal >
        </div>
      </div>
      }
      {
        verifyModal &&
        <Confirmation color="bg-yellow-400">
          <p className="text-lg font-semibold text-center px-5">Are you sure this request are verified?</p>
          <div className="flex gap-5">
            <button className="bg-yellow-400 border-2 border-yellow-400  w-24 py-2 text-lg font-semibold text-white rounded hover:bg-white hover:text-yellow-400 duration-200 ease-in-out" onClick={handleSubmitVerify}>Yes</button>
            <button className="bg-slate-500 border-2 border-slate-500  w-24 py-2 text-lg font-semibold text-white rounded hover:bg-white hover:text-slate-500 duration-200 ease-in-out" onClick={()=> setVerifyModal(false)}>No</button>
          </div>
        </Confirmation>
      }
      {
        successVerified && 
        <Notification color="bg-yellow-400" transitions={successVerified} success={()=> setSuccessVerified(false)}>
            Ticket Successfully Verified
        </Notification>
      }
      {
        oosModal &&
        <Confirmation color="bg-orange-500">
          <p className="text-lg font-semibold text-center px-5">The request item are out of stock?</p>
          <div className="flex gap-5">
            <button className="bg-orange-500 border-2 border-orange-500  w-24 py-2 text-lg font-semibold text-white rounded hover:bg-white hover:text-orange-500 duration-200 ease-in-out" onClick={handleSubmitOos}>Yes</button>
            <button className="bg-slate-500 border-2 border-slate-500  w-24 py-2 text-lg font-semibold text-white rounded hover:bg-white hover:text-slate-500 duration-200 ease-in-out" onClick={()=> setOosModal(false)}>No</button>
          </div>
        </Confirmation>
      }
      {
        successOos &&
        <Notification color="bg-orange-500" transitions={successOos} success={()=> setSuccessOos(false)}>
          Item Request Are Out Of Stock
        </Notification>
      }
      { 
        updateOosModal &&
        <Confirmation color="bg-orange-500">
            <p className="text-lg font-semibold text-center px-5">You want to update Out Of Stock Comment?</p>
          <div className="flex gap-5">
            <button className="bg-orange-500 border-2 border-orange-500  w-24 py-2 text-lg font-semibold text-white rounded hover:bg-white hover:text-orange-500 duration-200 ease-in-out" onClick={handleSubmitOosUpdate}>Yes</button>
            <button className="bg-slate-500 border-2 border-slate-500  w-24 py-2 text-lg font-semibold text-white rounded hover:bg-white hover:text-slate-500 duration-200 ease-in-out" onClick={()=> setUpdateOosModal(false)}>No</button>
          </div>
        </Confirmation>
      }
      {
        updateOosSuccess &&
        <Notification color="bg-orange-500" transitions={updateOosSuccess} success={()=> updateOosSuccess(false)}>
          OOS Successfully Updated
        </Notification>
      }
      {
        deleteFraudModal &&
        <Confirmation color="bg-orange-800">
          <p className="text-lg font-semibold text-center px-5">You want to delete this fraud?</p>
          <div className="flex gap-5">
            <button className="bg-orange-800 border-2 border-orange-800  w-24 py-2 text-lg font-semibold text-white rounded hover:bg-white hover:text-orange-500 duration-200 ease-in-out" onClick={handleSubmitDeleteFraud}>Yes</button>
            <button className="bg-slate-500 border-2 border-slate-500  w-24 py-2 text-lg font-semibold text-white rounded hover:bg-white hover:text-slate-500 duration-200 ease-in-out" onClick={()=> setDeleteFraudModal(false)}>No</button>
          </div>
        </Confirmation>
      }
      {
        deleteFraudSuccess &&
        <Notification color="bg-orange-800" transitions={deleteFraudSuccess} success={()=> setDeleteFraudSuccess(false)}>
          Fraud Successfully Deleted
        </Notification>
      }
      {
        fraud &&
        <Confirmation color="bg-orange-800">
          <p className="text-lg font-semibold text-center px-5">You want to reject this ticket?</p>
          <div className="flex gap-5">
            <button className="bg-orange-800 border-2 border-orange-800  w-24 py-2 text-lg font-semibold text-white rounded hover:bg-white hover:text-orange-500 duration-200 ease-in-out" onClick={handleSubmitFraud}>Yes</button>
            <button className="bg-slate-500 border-2 border-slate-500  w-24 py-2 text-lg font-semibold text-white rounded hover:bg-white hover:text-slate-500 duration-200 ease-in-out" onClick={()=> setFraud(false)}>No</button>
          </div>
        </Confirmation>
      }
      {
        successFraud &&
        <Notification color="bg-orange-800" transitions={successFraud} success={()=> setSuccessFraud(false)}>
          Ticket Successfully Rejected
        </Notification>
      }
      {
        completeModal &&
        <Confirmation color="bg-black">
          <p className="text-lg font-semibold text-center px-5">You want to reject this ticket?</p>
          <div className="flex gap-5">
            <button className="bg-black border-2 border-black  w-24 py-2 text-lg font-semibold text-white rounded hover:bg-white hover:text-black duration-200 ease-in-out" onClick={handleSubmitReceived}>Yes</button>
            <button className="bg-slate-500 border-2 border-slate-500  w-24 py-2 text-lg font-semibold text-white rounded hover:bg-white hover:text-slate-500 duration-200 ease-in-out" onClick={()=> setCompleteModal(false)}>No</button>
          </div>
        </Confirmation>
      }
      {
        successComplete &&
        <Notification color="bg-black" transitions={successComplete} success={()=> setSuccessComplete(false)}>
          Ticket Successfully Completed.
        </Notification>
      }
    </>
  )
}
