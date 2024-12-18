/* eslint-disable react-hooks/exhaustive-deps */
import { useDispatch, useSelector } from "react-redux"
import { DashboardWrapper } from "../../components/DashboardWrapper"
import { OutletHeader } from "../../components/OutletHeader"
import { Search } from "../../components/Search"
import { useAllTicketsQuery, useAllTicketsWithPageQuery, useMaxPagesSearchQuery, usePurchasingNewItemMutation, usePurchasingOosMutation, usePurchasingUsedItemMutation, useSearchQuery, useTicketOosCommentUpdateMutation, useTicketOpenMutation, useUpdateFraudMutation } from "../../redux/api/request"
import { StatusColor } from "../../components/StatusColor"
import { useEffect, useState } from "react"
import { RequestInformationModal } from "../../components/RequestInformationModal"
import { removeTicket, setTicket, setTickets } from "../../redux/features/ticket/ticketSlice"
import { Confirmation } from "../../components/Confirmation"
import { Notification } from "../../components/Notification"


export const PurchasingDashboard = () => {
  const {userInfo} = useSelector((state)=> state.auth)
  const {tickets, ticket, ticketPage,search} = useSelector((state)=> state.ticket)
  const {data: searchQuery, refetch: searchRefetch,isLoading:searchLoading} = useSearchQuery({page: ticketPage, query: search})
  const {data: allTickets, refetch:allTicketsRefetch} = useAllTicketsQuery()
  const {data: allTicketsPage , refetch:allTicketPageRefetch, isLoading:allTicketPageLoading} = useAllTicketsWithPageQuery(ticketPage)
  const [ticketOpen] = useTicketOpenMutation()
  const {data: maxPageSearch,refetch: maxPagesRefetch} = useMaxPagesSearchQuery(search)
  const [isOpen, setIsOpen] = useState(false)
  const [comment, setComment] = useState("")
  const [transition, setTransition] = useState('-translate-y-5 opacity-0')
  const dispatch = useDispatch()
  const [error, setError] = useState(false)
  const [updateFraud] = useUpdateFraudMutation()
  const [fraud, setFraud] = useState(false)
  const [successFraud, setSuccessFraud] = useState(false)
  const [purchasingNewItem] = usePurchasingNewItemMutation()
  const [newItemConfirmation, setNewItemConfirmation] = useState(false)
  const [purchasingSuccess, setPurchasingSuccess] = useState(false)
  const [usedItemConfirmation, setUsedItemConfirmation] = useState(false)
  const [usedItemSuccess, setUsedItemSuccess] = useState(false)
  const [purchasingUsedItem] = usePurchasingUsedItemMutation()
  const [oosComment, setOosComment] = useState("")
  const [updateOosComment, setUpdateOosComment] = useState(false)
  const [errorOosComment, setErrorOosComment] = useState(false)
  const [submitUpdateOos, setSubmitUpdateOos] = useState(false)
  const [ticketOosCommentUpdate] = useTicketOosCommentUpdateMutation()
  const [purchasingOosConfirmation, setPurchasingOosConfirmation] = useState(false)
  const [purchasingOos] = usePurchasingOosMutation()
  const [oosSuccess, setOosSuccess] = useState(false)
  const [updatePurchasingOosComment, setUpdatePurchasingOosComment] = useState(false)

  const handleOpen = async(id, data) => {
    setIsOpen(true)
    setTimeout(()=> {
      setTransition("-translate-y-0 opacity-100")
    })
    await ticketOpen(id)
    dispatch(setTicket(data))
    allTicketPageRefetch()
  }

  useEffect(()=> {
    setOosComment(ticket?.purchasing_oos?.oos_comment)
  },[ticket])
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

  const handleClose = ()=> {
    setTransition("-translate-y-5 opacity-0")
    setTimeout(()=> {
      setIsOpen(false);
      dispatch(removeTicket())
      setUpdateOosComment(false)
    },700)
  }

  useEffect(()=> {
    if(search.trim() === "") {
      dispatch(setTickets(allTicketsPage))
      allTicketPageRefetch()
    } else {
      searchRefetch()
      dispatch(setTickets(searchQuery))
    }
  },[allTicketsPage,search,searchQuery,maxPageSearch])

  const handleNewItem = ()=> {
    setNewItemConfirmation(true)
  }

  const handleSubmitPurchasingNewItems = async()=> {
    const res = await purchasingNewItem({id: ticket._id, comment: comment})
    if(!res.error) {
      setPurchasingSuccess(true)
      setNewItemConfirmation(false)
      setComment("")
      setTransition("-translate-y-5 opacity-0")
      setIsOpen(false)
      allTicketPageRefetch()
    }
  }

  const handleUsedItem = ()=> {
    setUsedItemConfirmation(true)
  }

  const handleSubmitPurchasingUsedItems = async()=> {
    const res = await purchasingUsedItem({id: ticket._id, comment: comment})
    if(!res.error) {
      setUsedItemSuccess(true)
      setUsedItemConfirmation(false)
      setComment("")
      setTransition("-translate-y-5 opacity-0")
      setIsOpen(false)
      allTicketPageRefetch()
    }
  }

  // handle fraud
  const handleSubmitFraud = async()=> {
    const res = await updateFraud({id: ticket._id, comment: comment,name: userInfo.name + " - " + userInfo.type})
    if(!res.error) {
      setIsOpen(false)
      setSuccessFraud(true)
      setTransition("-translate-y-5 opacity-0")
      setComment("")
      setFraud(false)
      allTicketPageRefetch()
    }
  }

  const handleButtonFraud = ()=> {
    if(comment.trim() === ""){
      setError(true)
    }else {
      setError(false)
      setFraud(true)
    }
  }

  const handleOos = () => {
    if(comment.trim() === ""){
      setError(true)
    }else {
      setError(false)
      setPurchasingOosConfirmation(true)
    }
  }

  const handleSubmitOos = async()=> {
    const res = await purchasingOos({id: ticket._id, comment: comment})
    if(!res.error) {
      setErrorOosComment(false)
      setSubmitUpdateOos(false)
      setTransition("-translate-y-5 opacity-0")
      setUpdatePurchasingOosComment(true)
      setUpdateOosComment(false)
      setIsOpen(false)
      allTicketPageRefetch()
    }
  }

  const handleUpdateOosComment = () => {
    setUpdateOosComment(true)
  }
  const handleUOCModal = async()=> {
    if(oosComment.trim() === ""){
      setErrorOosComment(true)
    }else {
      setErrorOosComment(false)
      setSubmitUpdateOos(true)
    }
  }
  
  const handleSubmitOosCommentUpdate = async()=> {
    const res = await ticketOosCommentUpdate({id:ticket._id, comment: oosComment})
    if(!res.error) {
      setErrorOosComment(false)
      setSubmitUpdateOos(false)
      setTransition("-translate-y-5 opacity-0")
      setIsOpen(false)
      allTicketPageRefetch()
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
                (!searchLoading || !allTicketPageLoading) ? 
                  (
                  <>
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
                        <StatusColor isOpen={ticket.is_open_object.is_open_purchaser} ticket={ticket}/>
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
          </div>
        </div>
      </DashboardWrapper>
      {
        isOpen &&
        <div className="absolute left-0 top-0 bg-white/50 w-full h-full z-50 flex items-center justify-center">
          <div className={`xs:w-full lg:w-8/12 xl-6/12 h-[90%] flex flex-col rounded-md shadow-lg shadow-black/50 bg-white relative overflow-hidden transition-all duration-700 ${transition}`}>
            <div className="border-2 w-8 h-8 flex items-center justify-center border-black/20 absolute top-2 right-2 cursor-pointer rounded-full bg-white hover:bg-black hover:text-white duration-200 ease-in-out font-semibold " onClick={handleClose}>X</div>
            <RequestInformationModal ticket={ticket}>
              {
                ticket?.purchasing_oos?.oos && !ticket.purchasing_approval?.new_items && !ticket.purchasing_approval?.used_items && ticket.request === "HANDSET" && 
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
                          {ticket?.purchasing_oos.oos_comment}
                        </>
                      ) : (
                        <textarea className={`w-full outline-none resize-none h-full ${errorOosComment? "border border-red-500": ""}`} placeholder="Enter new comments " value={oosComment} onChange={(e)=>setOosComment(e.target.value) }></textarea>
                      )
                    }
                  </div>
                </div>
              }
              {
                !ticket.last_approval_details?.last_approval && !ticket.fraud_details?.is_fraud &&  (!ticket.purchasing_approval?.new_items && !ticket.purchasing_approval?.used_items) && ticket.request === "HANDSET" &&
                <div className="border-b-4 flex ">
                  <div className="w-full p-3  border border-r-4 font-bold">Comments :</div>
                  <textarea value={comment} onChange={(e)=> setComment(e.target.value)} className={`w-full p-3 border resize-none h-44 ${error && "border-red-500"} `} placeholder="Write comment here...">
                  </textarea>
                </div>
              }
              {
                !ticket.last_approval_details?.last_approval && (!ticket.purchasing_approval?.new_items && !ticket.purchasing_approval?.used_items) && ticket.request === "HANDSET" && (
                  <div className="flex p-5 justify-end gap-5 border-b-4 ">
                    <button className="w-36 py-2 border-2 border-lime-500 rounded-md bg-lime-500 shadow-md shadow-black/50 font-bold hover:text-lime-500 hover:bg-white duration-200 text-white" 
                    onClick={handleNewItem}
                    >New Item</button>
                    <button className="w-36 py-2 border-2 border-lime-500 rounded-md bg-lime-500 shadow-md shadow-black/50 font-bold hover:text-lime-500 hover:bg-white duration-200 text-white" 
                    onClick={handleUsedItem}
                    >Used Item</button>
                    {
                      !ticket?.purchasing_oos.oos &&
                      <button className="w-36 py-2 border-2 border-orange-500 rounded-md bg-orange-500 shadow-md shadow-black/50 font-bold hover:text-orange-500 hover:bg-white duration-200 text-white" 
                      onClick={handleOos}
                      >Out of stock</button>
                    }
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
      {
        fraud &&
        <Confirmation color="bg-orange-800">
          <p className="text-lg font-semibold text-center px-5">Do you want to reject this ticket?</p>
          <div className="flex gap-5">
            <button className="bg-orange-800 border-2 border-orange-800 w-24 py-2 text-lg font-semibold text-white rounded hover:bg-white hover:text-orange-800 duration-200 ease-in-out" onClick={handleSubmitFraud}>Yes</button>
            <button className="bg-slate-500 border-2 border-slate-500 w-24 py-2 text-lg font-semibold text-white rounded hover:bg-white hover:text-slate-500 duration-200 ease-in-out" onClick={()=> setFraud(false)}>No</button>
          </div>
        </Confirmation>
      }
      {
        successFraud &&
        <Notification color="bg-orange-800" transitions={successFraud} success={()=> setSuccessFraud(false)}>
          Ticket successfully rejected
        </Notification>
      }
      {
        newItemConfirmation &&
        <Confirmation color="bg-lime-500">
          <p className="text-lg font-semibold text-center px-5">Do you want to approved this ticket with new items?</p>
          <div className="flex gap-5">
            <button className="bg-lime-500 border-2 border-lime-500 w-24 py-2 text-lg font-semibold text-white rounded hover:bg-white hover:text-lime-500 duration-200 ease-in-out" onClick={handleSubmitPurchasingNewItems}>Yes</button>
            <button className="bg-slate-500 border-2 border-slate-500 w-24 py-2 text-lg font-semibold text-white rounded hover:bg-white hover:text-slate-500 duration-200 ease-in-out" onClick={()=> setNewItemConfirmation(false)}>No</button>
          </div>
        </Confirmation>
      }
      {
        purchasingSuccess &&
        <Notification color="bg-lime-500" transitions={purchasingSuccess} success={()=> setPurchasingSuccess(false)}>
          Ticket successfully verified
        </Notification>
      }
      {
        usedItemConfirmation &&
        <Confirmation color="bg-lime-500">
          <p className="text-lg font-semibold text-center px-5">Do you want to approved this ticket with used items?</p>
          <div className="flex gap-5">
            <button className="bg-lime-500 border-2 border-lime-500 w-24 py-2 text-lg font-semibold text-white rounded hover:bg-white hover:text-lime-500 duration-200 ease-in-out" onClick={handleSubmitPurchasingUsedItems}>Yes</button>
            <button className="bg-slate-500 border-2 border-slate-500 w-24 py-2 text-lg font-semibold text-white rounded hover:bg-white hover:text-slate-500 duration-200 ease-in-out" onClick={()=> setUsedItemConfirmation(false)}>No</button>
          </div>
        </Confirmation>
      }
      {
        usedItemSuccess &&
        <Notification color="bg-lime-500" transitions={usedItemSuccess} success={()=> setUsedItemSuccess(false)}>
          Ticket successfully verified
        </Notification>
      }
      {
        purchasingOosConfirmation &&
        <Confirmation color="bg-orange-500">
          <p className="text-lg font-semibold text-center px-5">The request item are out of stock?</p>
          <div className="flex gap-5">
            <button className="bg-orange-500 border-2 border-orange-500 w-24 py-2 text-lg font-semibold text-white rounded hover:bg-white hover:text-orange-500 duration-200 ease-in-out" onClick={handleSubmitOos}>Yes</button>
            <button className="bg-slate-500 border-2 border-slate-500 w-24 py-2 text-lg font-semibold text-white rounded hover:bg-white hover:text-slate-500 duration-200 ease-in-out" onClick={()=> setPurchasingOosConfirmation(false)}>No</button>
          </div>
        </Confirmation>
      }
      {
        oosSuccess &&
        <Notification color="bg-orange-500" transitions={oosSuccess} success={()=> setOosSuccess(false)}>
          Item Request Are Out Of Stock
        </Notification>
      }
      {
        submitUpdateOos &&
        <Confirmation color="bg-orange-500">
          <p className="text-lg font-semibold text-center px-5">Update Out of stock comment?</p>
          <div className="flex gap-5">
            <button className="bg-orange-500 border-2 border-orange-500 w-24 py-2 text-lg font-semibold text-white rounded hover:bg-white hover:text-orange-500 duration-200 ease-in-out" onClick={handleSubmitOosCommentUpdate}>Yes</button>
            <button className="bg-slate-500 border-2 border-slate-500 w-24 py-2 text-lg font-semibold text-white rounded hover:bg-white hover:text-slate-500 duration-200 ease-in-out" onClick={()=> setSubmitUpdateOos(false)}>No</button>
          </div>
        </Confirmation>
      }
      {
        updatePurchasingOosComment &&
        <Notification color="bg-orange-500" transitions={updatePurchasingOosComment} success={()=> setUpdatePurchasingOosComment(false)}>
          OOS comment successfully updated
        </Notification>
      }
    </>
  )
}
