/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { OutletHeader } from "../../components/OutletHeader"
import { useAomTicketApprovalMutation, useAomTicketsPageQuery, useAomTicketsQuery, useMaxPagesSearchQuery, useSearchQuery, useTicketDeclinedMutation, useTicketOpenMutation } from "../../redux/api/request"
import { useDispatch, useSelector } from "react-redux"
import { TicketPagination } from "../../components/TicketPagination"
import { removeTicket, setAllTickets, setTicket, setTickets } from "../../redux/features/ticket/ticketSlice"
import { Confirmation } from "../../components/Confirmation"
import { Notification } from "../../components/Notification"
import { DashboardWrapper } from "../../components/DashboardWrapper"
import { StatusColor } from "../../components/StatusColor"
import { RequestInformationModal } from "../../components/RequestInformationModal"
import { Search } from "../../components/Search"



export const AOMDashboard = () => {
  const {userInfo} = useSelector((state) => state.auth)
  const { tickets, ticketPage,ticket, search} = useSelector((state)=> state.ticket)
  const {data: aomTicketData, refetch: aomTicketsRefetch} = useAomTicketsQuery()
  const {data:searchQuery, refetch: searchRefetch,isLoading:searchLoading} = useSearchQuery({page: ticketPage, query: search})
  const [ticketOpen] = useTicketOpenMutation()
  const {data: aomTicketDataWithPage, refetch: aomTicketPageRefetch, isLoading:aomTicketPageLoading} = useAomTicketsPageQuery(ticketPage)
  const dispatch = useDispatch()
  const [comment, setComment] = useState("")
  const [aomTicketDeclined] = useTicketDeclinedMutation()
  const [declinedError, setDeclinedError] = useState(false)
  const [declinedConfirmation, setDeclinedConfirmation] = useState(false)
  const [successfully, setSuccessfully] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [transition, setTransition] = useState('-translate-y-5 opacity-0')
  const [aomTicketApproval] = useAomTicketApprovalMutation()
  const [approvalConfirmation, setApprovalConfirmation] = useState(false)
  const [successApproval, setSuccessApproval] = useState(false)
  const {data: maxPageSearch,refetch: maxPagesRefetch} = useMaxPagesSearchQuery(search)
  
  
  //for search======================================================


  //dispatching all tickets and tickets=============================
  useEffect(()=> {
    if(search.trim() === "") {
      dispatch(setAllTickets(aomTicketData))
      dispatch(setTickets(aomTicketDataWithPage))
    } else {
      searchRefetch()
      dispatch(setTickets(searchQuery))
    }
  },[aomTicketData,aomTicketDataWithPage,search,searchQuery,maxPageSearch])


  //refetching tiket and ticket page =======================================
  useEffect(()=> {
    const timer = setTimeout(()=> {
      if(search.trim() === ""){
        aomTicketsRefetch()
        aomTicketPageRefetch()
      } else {
        searchRefetch()
      }
    })
    return ()=> clearTimeout(timer)
  })


  useEffect(()=> {
    const timer = setTimeout(()=> {
      if(search.trim() === "") {
        aomTicketPageRefetch()
      } else {
        searchRefetch()
      }
    })
    return ()=> clearTimeout(timer)
  },[ticketPage])
  

  // for open modal
  const handleOpen = async(id,data)=> {
    setIsOpen(true)
    setTimeout(()=> {
      setTransition("-translate-y-0 opacity-100")
    })
    await ticketOpen(id)
    dispatch(setTicket(data))
    aomTicketPageRefetch()
  }

  // for closing modal 
  const handleClose = () => {
    setTransition("-translate-y-5 opacity-0")
    setTimeout(()=> {
      setIsOpen(false);
      dispatch(removeTicket())
      setDeclinedError(false)
      setComment("")
    },700)
  }


  //ticket declined button ==================================================
  const handleDeclined = async() => {
    if(comment === "") {
      setDeclinedError(true)
    } else {
      setDeclinedError(false)
      setDeclinedConfirmation(true)
    }
  }

  const handleSubmitDeclined = async()=> {
    const res = await aomTicketDeclined({id: ticket?._id,comment: comment,name: userInfo.name + " - (" + userInfo.department + " - " + userInfo.type + ")"})
    if(!res?.error) {
      setTransition("-translate-y-5 opacity-0")
      setIsOpen(false);
      dispatch(removeTicket())
      setDeclinedConfirmation(false)
      setComment("")
      setSuccessfully(true)
    }
  }

  //ticket approval button ===================================================
  const handleApproval = async() => {
    setApprovalConfirmation(true)
  }

  const handleSubmitApproval = async()=> {
    const res = await aomTicketApproval({id: ticket?._id, comment: comment})
    if(!res?.error) {
      setTransition("-translate-y-5 opacity-0")
      setIsOpen(false);
      dispatch(removeTicket())
      setApprovalConfirmation(false)
      setSuccessApproval(true)
    }
  }

  return (
    <>
      <DashboardWrapper>
        <div className="flex justify-between bg-white">
          <OutletHeader title="Dashboard"/>
        </div>
        <div className=" h-full flex flex-col pt-2 p-4">
          <Search data={aomTicketData} withPage={aomTicketDataWithPage} refetchSearch={()=> searchRefetch()} refetchWithPage={()=> maxPagesRefetch()}/>
          <hr  className="border border-black mt-1"/>
          <div className="h-full  ">
            <div className="mt-1 h-full flex flex-col">
              <div className="grid grid-cols-7 px-2 text-center border-b-2 py-2 font-bold border-black mb-1">
                <div >Ticket No.</div>
                <div className='col-span-2'>Employee Name</div>
                <div>Position</div>
                <div>Request</div>
                <div>Quantity</div>
                <div>Status</div>
              </div>
              {
                ( !searchLoading || !aomTicketPageLoading) ? 
                (<>
                  {tickets?.map((ticket)=> 
                  <div key={ticket._id} className="even:bg-slate-200 py-2 px-2 grid grid-cols-7 text-center hover:border-slate-500 cursor-pointer border border-white" onClick={()=> handleOpen(ticket._id,ticket)}>
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
                    <StatusColor isOpen={ticket.is_open_object.is_open_aom} ticket={ticket}/>
                  </div>
                  )}
                </>) :
                (
                  <div className="w-full h-full flex-col flex items-center justify-center">
                    <h1 className="font-black animate-pulse text-2xl">Loading</h1>
                    <div className="border-8 border-dotted border-black w-16 h-16 rounded-full animate-spin"></div>
                  </div>
                )
              }
            </div>
          </div>
        </div>
        {
          ((Math.ceil(aomTicketData?.length/10) > 1 && search.trim() === "") || (search.trim() !== "" && Math.ceil(maxPageSearch/10) > 1 )) &&
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
                !ticket.is_declined && !ticket.aom_approval_details?.is_approve_aom &&
                <div className="border-b-4 flex ">
                  <div className="w-full p-3 border-r-4 font-bold">Comments :</div>
                  <textarea value={comment} onChange={(e)=> setComment(e.target.value)} className={`w-full p-3 resize-none h-44 ${declinedError && "border border-red-500"}`} placeholder="Write comment here...">
                        </textarea>
                </div>
              }
              {
                (ticket.is_declined && !ticket.aom_approval_details?.is_approve_aom) || !ticket.aom_approval_details?.is_approve_aom &&
                <div className="p-2 text-sm flex justify-end">
                  <p><span className="font-bold">Note:</span> On rejecting ticket please add comments.</p>
                </div>
              }
              {
                !ticket.is_declined && !ticket.aom_approval_details?.is_approve_aom && (
                  <div className="flex p-5 justify-end gap-5 border-b-4 ">
            
                    <button className="w-36 py-2 border-2 border-cyan-500 rounded-md bg-cyan-500 shadow-md shadow-black/50 font-bold hover:text-cyan-500 hover:bg-white duration-200 text-white" onClick={handleApproval}>Approved</button>
                    <button className="w-36 py-2 border-2 border-red-500 rounded-md bg-red-500 shadow-md shadow-black/50 font-bold hover:text-red-500 hover:bg-white text-white  duration-200" onClick={handleDeclined}>Declined</button>
              
                  </div>
                )
              }
            </RequestInformationModal>
        </div>
      
      </div>
      }
      { 
        declinedConfirmation &&
        <Confirmation color="bg-red-500">
          <p className="text-lg font-semibold text-center px-5">Are you sure you want to reject the request ticket?</p>
          <div className="flex gap-5">
            <button className="bg-red-500 border-2 border-red-500  w-24 py-2 text-lg font-semibold text-white rounded hover:bg-white hover:text-red-500 duration-200 ease-in-out" onClick={handleSubmitDeclined}>Yes</button>
            <button className="bg-slate-500 border-2 border-slate-500  w-24 py-2 text-lg font-semibold text-white rounded hover:bg-white hover:text-slate-500 duration-200 ease-in-out" onClick={()=> setDeclinedConfirmation(false)}>No</button>
          </div>
        </Confirmation>
      }
      { 
        approvalConfirmation &&
        <Confirmation color="bg-cyan-500">
          <p className="text-lg font-semibold text-center px-5">Are you sure you want to approved this ticket?</p>
          <div className="flex gap-5">
            <button className="bg-cyan-500 border-2 border-cyan-500  w-24 py-2 text-lg font-semibold text-white rounded hover:bg-white hover:text-cyan-500 duration-200 ease-in-out" onClick={handleSubmitApproval}>Yes</button>
            <button className="bg-slate-500 border-2 border-slate-500  w-24 py-2 text-lg font-semibold text-white rounded hover:bg-white hover:text-slate-500 duration-200 ease-in-out" onClick={()=> setApprovalConfirmation(false)}>No</button>
          </div>   
        </Confirmation>
      }
      { 
      successfully &&
        <Notification color="bg-red-500" transitions={successfully} success={()=> setSuccessfully(false)}>
          Ticket Successfully Rejected
        </Notification>
      }
      { successApproval &&
        <Notification color="bg-cyan-500" transitions={successApproval} success={()=> setSuccessApproval(false)}>
          Ticket Is Successfully Approved
        </Notification>
      }
    </>

  )
}