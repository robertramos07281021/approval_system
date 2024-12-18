/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { DashboardWrapper } from "../../components/DashboardWrapper"
import { OutletHeader } from "../../components/OutletHeader"
import { useAllTicketsQuery, useAllTicketsWithPageQuery, useMaxPagesSearchQuery, useSearchQuery, useTicketDeclinedMutation, useTicketOpenMutation, useUpdateSemiApprovalMutation } from "../../redux/api/request"
import { TicketPagination } from "../../components/TicketPagination"
import { useDispatch, useSelector } from "react-redux"
import { removeTicket, setTicket, setTickets } from "../../redux/features/ticket/ticketSlice"
import { Confirmation } from "../../components/Confirmation"
import { Notification } from "../../components/Notification"
import { StatusColor } from "../../components/StatusColor"
import { RequestInformationModal } from "../../components/RequestInformationModal"
import { Search } from "../../components/Search"


export const SemiApproverDashboard = () => {

  const {userInfo} = useSelector((state) => state.auth)
  const {data: allTickets, refetch} = useAllTicketsQuery()
  const {ticketPage, ticket, tickets, search} = useSelector((state) => state.ticket)
  const {data: allTicketWithPage, refetch:ticketPageRefetch,isLoading:allTicketLoading} = useAllTicketsWithPageQuery(ticketPage)
  const {data: searchQuery , refetch: searchRefetch,isLoading:searchLoading} = useSearchQuery({page: ticketPage, query: search})
  const [isOpen, setIsOpen] = useState(false)
  const [transition, setTransition] = useState('-translate-y-5 opacity-0')
  const dispatch = useDispatch()
  const [ticketOpen] = useTicketOpenMutation()
  const [comment, setComment] = useState("")
  const [approved, setApproved] = useState(false)
  const [updateSemiApproval] = useUpdateSemiApprovalMutation()
  const [successSemiApproval, setSuccessSemiApproval] = useState(false)
  const [ticketDeclined] = useTicketDeclinedMutation()
  const [reject, setReject] = useState(false)
  const [successReject, setSuccessReject] = useState(false)
  const [error, setError] = useState(false)
  const {data: maxPageSearch,refetch: maxPagesRefetch} = useMaxPagesSearchQuery(search)

  useEffect(()=> {
    if(search.trim() === "") {
      dispatch(setTickets(allTicketWithPage))
    } else {
      dispatch(setTickets(searchQuery))
      maxPagesRefetch()
    }
  },[allTicketWithPage,search,searchQuery,maxPageSearch])

  useEffect(()=> {
    const timer = setTimeout(()=> {
      if(search.trim() === "") {
        ticketPageRefetch()
        refetch()
      } else {
        searchRefetch()
      }
    })
    return () => clearTimeout(timer)
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
      setComment("")
      setError(false)
    },700)
  }
  
  useEffect(()=> {
    refetch()
  },[])

  //handle semi approved =========================================
  const handleApproved = () => {
    setApproved(true)
  }

  const handleSubmitApproved = async() => {
    const res = await updateSemiApproval({id: ticket._id, comment: comment})
    if(!res.error) {
      setTransition("-translate-y-5 opacity-0")
      setIsOpen(false)
      setComment("")
      dispatch(removeTicket())
      ticketPageRefetch()
      setApproved(false)
      setSuccessSemiApproval(true)
    }
  }

  //handle semi reject ==========================================
  const handleReject = ()=> {
    if(comment.trim() === "" ) {
      setError(true)
    } else {
      setError(false)
      setReject(true)
    }
  }

  const submitReject = async() => {
    const res = await ticketDeclined({id: ticket._id, comment: comment, name: userInfo.name.toUpperCase()})
    if(!res.error) {
      setTransition("-translate-y-5 opacity-0")
      setIsOpen(false)
      setComment("")
      dispatch(removeTicket())
      ticketPageRefetch()
      setReject(false)
      setSuccessReject(true)
    }
  }

  return (
    <>
      <DashboardWrapper>
        <div className="flex justify-between bg-white">
          <OutletHeader title="Dashboard"/>
        </div>
        <div className=" h-full flex flex-col pt-2 p-4">
          <Search data={allTickets} withPage={allTicketWithPage} refetchSearch={()=> searchRefetch()} refetchWithPage={()=> maxPagesRefetch()} />
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
            (!searchLoading || !allTicketLoading) ? 
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
                    <StatusColor isOpen={ticket.is_open_object.is_open_semi_approver} ticket={ticket}/>
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
                !ticket.semi_approved_details?.is_approve_semi && ticket.aom_approval_details?.is_approve_aom && !ticket.fraud_details?.is_fraud && !ticket.is_declined &&
                <>
                  <div className="flex border-b-4">
                    <div className="w-full p-3 border-r-4 font-bold">Comments :</div>
                    <textarea value={comment} onChange={(e)=> setComment(e.target.value)} className={`w-full p-3  resize-none h-44 ${error && 'border border-red-500'} `} placeholder="Write comment here...">
                          </textarea>
                  </div>
                  <div className="flex p-5 border-b-4 justify-end gap-5 ">

                    <button className="w-36 py-2 border-2 border-indigo-700 rounded-md bg-indigo-700 shadow-md shadow-black/50 font-bold hover:text-indigo-700 hover:bg-white duration-200 text-white" 
                    onClick={handleApproved}
                    >Approved</button>
            
                    <button className="w-36 py-2 border-2 border-red-500 rounded-md bg-red-500 shadow-md shadow-black/50 font-bold hover:text-red-500 hover:bg-white duration-200 text-white"
                    onClick={handleReject}
                    >Reject</button>
                  </div>
                </>
              }
              
            </RequestInformationModal>
          </div>
        </div>
      }
      { 
        approved && 
        <Confirmation color="bg-indigo-700">
           <p className="text-lg font-semibold text-center px-5">Are you sure you want to approved this ticket?</p>
          <div className="flex gap-5">
            <button className="bg-indigo-700 border-2 border-indigo-700  w-24 py-2 text-lg font-semibold text-white rounded hover:bg-white hover:text-indigo-700 duration-200 ease-in-out" onClick={handleSubmitApproved}>Yes</button>
            <button className="bg-slate-500 border-2 border-slate-500  w-24 py-2 text-lg font-semibold text-white rounded hover:bg-white hover:text-slate-500 duration-200 ease-in-out" onClick={()=> setApproved(false)}>No</button>
          </div>
        </Confirmation>
      }
      {
        successSemiApproval &&
        <Notification color="bg-indigo-700" transitions={successSemiApproval} success={()=> setSuccessSemiApproval(false)}>
          Ticket Successfully Approved
        </Notification>
      }
      { reject && 
        <Confirmation color="bg-red-500">
           <p className="text-lg font-semibold text-center px-5">Are you sure you want to approved this ticket?</p>
          <div className="flex gap-5">
            <button className="bg-red-500 border-2 border-red-500  w-24 py-2 text-lg font-semibold text-white rounded hover:bg-white hover:text-red-500 duration-200 ease-in-out" onClick={submitReject}>Yes</button>
            <button className="bg-slate-500 border-2 border-slate-500  w-24 py-2 text-lg font-semibold text-white rounded hover:bg-white hover:text-slate-500 duration-200 ease-in-out" onClick={()=> setReject(false)}>No</button>
          </div>
        </Confirmation>
      }
      {
        successReject &&
        <Notification color="bg-red-500" transitions={successReject} success={()=> setSuccessReject(false)}>
          Ticket Successfully Reject
        </Notification>
      }
    </>
  )
}
