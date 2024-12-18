/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { OutletHeader } from "../../components/OutletHeader"
import { useDispatch, useSelector } from "react-redux"
import { useAllTicketsQuery, useAllTicketsWithPageQuery, useMaxPagesSearchQuery, useSearchQuery, useTicketOpenMutation, useUpdateFraudMutation, useUpdateLastApprovalMutation } from "../../redux/api/request"
import { removeTicket, setTicket, setTickets } from "../../redux/features/ticket/ticketSlice"

import { TicketPagination } from "../../components/TicketPagination"
import { Confirmation } from "../../components/Confirmation"
import { Notification } from "../../components/Notification"
import { DashboardWrapper } from "../../components/DashboardWrapper"
import { StatusColor } from "../../components/StatusColor"
import { RequestInformationModal } from "../../components/RequestInformationModal"
import { Search } from "../../components/Search"


export const ApproverDashboard = () => {
  const {userInfo} = useSelector((state)=> state.auth)
  const {tickets, ticket, ticketPage,search} = useSelector((state)=> state.ticket)
  const {data: searchQuery, refetch: searchRefetch, isLoading:searchLoading} = useSearchQuery({page: ticketPage, query: search})
  const {data: allTickets, refetch:allTicketsRefetch} = useAllTicketsQuery()
  const {data: allTicketsPage , refetch:allTicketPageRefetch,isLoading:allTicketsPageLoading } = useAllTicketsWithPageQuery(ticketPage)
  const [ticketOpen] = useTicketOpenMutation()
  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState(false)
  const [comment, setComment] = useState('')
  const [transition, setTransition] = useState('-translate-y-5 opacity-0')
  const {data: maxPageSearch,refetch: maxPagesRefetch} = useMaxPagesSearchQuery(search)
  
  useEffect(()=> {
    if(search.trim() === "") {
      dispatch(setTickets(allTicketsPage))
      allTicketPageRefetch()
    } else {
      searchRefetch()
      dispatch(setTickets(searchQuery))
    }
  },[allTicketsPage,search,searchQuery,maxPageSearch])

  useEffect(()=> {
    const timer = setTimeout(()=> {
      if(search.trim() === "") {
        allTicketsRefetch()
        allTicketPageRefetch()
      } else {
        searchRefetch()
      }
    })
    return ()=> clearTimeout(timer)
  })

  useEffect(()=> {
    const timer = setTimeout(()=> {
      if(search.trim() === "") {
        allTicketPageRefetch()
      } else {
        searchRefetch()
      }
    })
    return ()=> clearTimeout(timer)
  },[ticketPage])

  //isopen open modal
  const handleOpen = async(id, data) => {
    setIsOpen(true)
    setTimeout(()=> {
      setTransition("-translate-y-0 opacity-100")
    })
    await ticketOpen(id)
    dispatch(setTicket(data))
    allTicketPageRefetch()
  }

  //isopen close modal
  const handleClose = ()=> {
    setTransition("-translate-y-5 opacity-0")
    setTimeout(()=> {
      setIsOpen(false);
      dispatch(removeTicket())
    
    },700)
  }

  const [error, setError] = useState(false)
  const [fraud, setFraud] = useState(false)
  const [successFraud, setSuccessFraud] = useState(false)
  const [updateFraud] = useUpdateFraudMutation()
  const [updateLastApproval] = useUpdateLastApprovalMutation()
  const [approvalModal, setApprovalModal] = useState(false)
  const [successApproval, setSuccessApproval] = useState(false)

  //handle button fraud
  const handleButtonFraud = ()=> {
    if(comment.trim() === ""){
      setError(true)
    }else {
      setError(false)
      setFraud(true)
    }
  }

  // handle fraud
  const handleSubmitFraud = async()=> {
    const res = await updateFraud({id: ticket._id, comment: comment,name: userInfo.name + " - " + userInfo.type})
    if(!res.error) {
      setIsOpen(false)
      setSuccessFraud(true)
      setTransition("-translate-y-5 opacity-0")
      setFraud(false)
      allTicketPageRefetch()
    }
  }
  // for approval
  const handleApproval = async()=> {
    setApprovalModal(true)
  }

  const handleSubmitApproval = async()=> {
    const res = await updateLastApproval({id: ticket._id, comment: comment, name: userInfo.name + " - " + userInfo.type})
    if(!res.error){
      setSuccessApproval(true)
      setApprovalModal(false)
      allTicketPageRefetch()
      setComment("")
      setTransition("-translate-y-5 opacity-0")
      setIsOpen(false)
    }
  }
  
  return (
    <>
      <DashboardWrapper>
        <div className="flex justify-between bg-white">
          <OutletHeader title="Dashboard"/>
        </div>
        <div className=" h-full flex flex-col pt-2 lg:p-4">
          <Search data={allTickets} withPage={allTicketsPage} refetchSearch={()=> searchRefetch()} refetchWithPage={()=> maxPagesRefetch()}/>
          <hr  className="border border-black mt-1"/>
          <div className="h-full  ">
            <div className="mt-1 h-full flex flex-col">
              <div className="grid xs:grid-cols-7 lg:grid-cols-6 lg:px-2 xs:text-[0.6em] lg:text-base text-center border-b-2 py-2 font-bold border-black mb-1">
                <div >Ticket No.</div>
                <div className="xs:col-span-2 lg:col-span-1" >Employee Name</div>
                <div >Department</div>
                <div>Request</div>
                <div>Quantity</div>
                <div>Status</div>
              </div>
              {
                (!searchLoading || !allTicketsPageLoading) ? 
                (<>
                  {tickets?.map((ticket)=> 
                    <div key={ticket._id} className="even:bg-slate-200 xs:p-1 lg:p-2 xs:grid-cols-7 grid xs:py-2  lg:grid-cols-6 text-center hover:border-slate-500 cursor-pointer border border-white xs:text-[9px] lg:text-base"
                    onClick={()=> handleOpen(ticket._id,ticket)}
                    >
                      <div  className="font-mono">
                        {ticket.ticket_no}
                      </div>
                      <div className="xs:col-span-2 lg:col-span-1">
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
                      <StatusColor isOpen={ticket.is_open_object.is_open_approver} ticket={ticket}/>
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
          ((Math.ceil(allTickets?.length/10) > 1 && search.trim() === "") || (search.trim() !== "" && Math.ceil(maxPageSearch/10) > 1 )) &&
          <div className="w-full">
            <TicketPagination/>
          </div>
        }
      </DashboardWrapper>
      {
        isOpen && 
        <div className="absolute left-0 top-0 bg-white/50 w-full h-full z-50 flex items-center justify-center">
          <div className={`xs:w-full lg:w-8/12 xl-6/12 h-[90%] flex flex-col rounded-md shadow-lg shadow-black/50 bg-white relative overflow-hidden transition-all duration-700 ${transition}`}>
            <div className="border-2 w-8 h-8 flex items-center justify-center border-black/20 absolute top-2 right-2 cursor-pointer rounded-full bg-white hover:bg-black hover:text-white duration-200 ease-in-out font-semibold " onClick={handleClose}>X</div>
            <RequestInformationModal ticket={ticket}>
              {
                !ticket.last_approval_details?.last_approval && !ticket.fraud_details?.is_fraud && (ticket.verified_details?.is_verified || ticket.purchasing_approval?.new_items || ticket.purchasing_approval?.used_items ) &&
                <div className="border-b-4 flex ">
                  <div className="w-full p-3  border border-r-4 font-bold">Comments :</div>
                  <textarea value={comment} onChange={(e)=> setComment(e.target.value)} className={`w-full p-3 border resize-none h-44 ${error && "border-red-500"} `} placeholder="Write comment here...">
                  </textarea>
                </div>
              }
              {
                !ticket.last_approval_details?.last_approval && (ticket.verified_details?.is_verified || ticket.purchasing_approval?.new_items || ticket.purchasing_approval?.used_items) && (
                  <div className="flex p-5 justify-end gap-5 border-b-4 ">
                    <button className="w-36 py-2 border-2 border-blue-500 rounded-md bg-blue-500 shadow-md shadow-black/50 font-bold hover:text-blue-500 hover:bg-white duration-200 text-white" 
                    onClick={handleApproval}
                    >Approved</button>
                    <button className="w-36 py-2 border-2 border-orange-800 rounded-md bg-orange-800 shadow-md shadow-black/50 font-bold hover:text-orange-800 hover:bg-white text-white  duration-200" 
                    onClick={handleButtonFraud}
                    >Reject</button>
                  </div>
                )
              }
            </RequestInformationModal>
          </div>
        </div>
      }
      {fraud &&
        <Confirmation color="bg-orange-800">
            <p className="text-lg font-semibold text-center px-5">Do you want to reject this ticket?</p>
          <div className="flex gap-5">
            <button className="bg-orange-800 border-2 border-orange-800 w-24 py-2 text-lg font-semibold text-white rounded hover:bg-white hover:text-orange-800 duration-200 ease-in-out" onClick={handleSubmitFraud}>Yes</button>
            <button className="bg-slate-500 border-2 border-slate-500 w-24 py-2 text-lg font-semibold text-white rounded hover:bg-white hover:text-slate-500 duration-200 ease-in-out" onClick={()=> setFraud(false)}>No</button>
          </div>
        </Confirmation>
      }
      {successFraud &&
      <Notification color="bg-orange-800" transitions={successFraud} success={()=> setSuccessFraud(false)}>
        Ticket successfully rejected
      </Notification>
      }
      {approvalModal &&
         <Confirmation color="bg-blue-500">
             <p className="text-lg font-semibold text-center px-5">Do you want to approved this ticket?</p>
           <div className="flex gap-5">
             <button className="bg-blue-500 border-2 border-blue-500  w-24 py-2 text-lg font-semibold text-white rounded hover:bg-white hover:text-blue-500 duration-200 ease-in-out" onClick={handleSubmitApproval}>Yes</button>
             <button className="bg-slate-500 border-2 border-slate-500  w-24 py-2 text-lg font-semibold text-white rounded hover:bg-white hover:text-slate-500 duration-200 ease-in-out" onClick={()=> setApprovalModal(false)}>No</button>
           </div>
         </Confirmation>
       }
       {successApproval &&
        <Notification color="bg-blue-500" transitions={successApproval} success={()=> setSuccessApproval(false)}>
          Ticket successfully approved
        </Notification>
      }
    </>
  )
}
