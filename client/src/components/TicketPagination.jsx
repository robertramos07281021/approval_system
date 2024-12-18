/* eslint-disable react-hooks/exhaustive-deps */
import { useDispatch, useSelector } from "react-redux"
import { useAllTicketsQuery, useAomTicketsQuery, useMaxPagesSearchQuery, useUserTicketsQuery } from "../redux/api/request"
import { setTicketPage } from "../redux/features/ticket/ticketSlice"
import { useEffect, useState } from "react"


export const TicketPagination = () => {
  const {userInfo} = useSelector((state)=> state.auth)
  const {ticketPage,search} = useSelector((state)=> state.ticket)
  const {data: userTickets} = useUserTicketsQuery()
  const {data: aomTIckets} = useAomTicketsQuery() 
  const {data: allTickets} = useAllTicketsQuery()
  const dispatch = useDispatch()
  const [totalPage, setTotalPage] = useState(0)
  const {data: maxPageSearch, refetch:maxPageSearchRefetch} = useMaxPagesSearchQuery(search)

  useEffect(()=> {
    if(userInfo?.type === "USER" && search.trim() === "") {
      setTotalPage(Math.ceil(userTickets?.length / 10))
    } else if(userInfo?.type === "AOM" && search.trim() === "") {
      setTotalPage(Math.ceil(aomTIckets?.length / 10))
    } else if(userInfo?.type !== "AOM" && userInfo?.type !== "USER"  && search.trim() === ""){
      setTotalPage(Math.ceil(allTickets?.length / 10))
    } else {
      setTotalPage(Math.ceil(maxPageSearch/10))
    }
  },[userInfo,search,maxPageSearch])

  useEffect(()=> {
    maxPageSearchRefetch()

  },[search,maxPageSearch,totalPage])

  const handlePrevPage = () => {
    if((ticketPage -1 ) > 0) {
      dispatch(setTicketPage(ticketPage - 1))
    }
  }

  const handleNextPage = () => {
    if((ticketPage +1 ) <= totalPage) {
      dispatch(setTicketPage(ticketPage+1))
    }
  }


  return (
    <div className="flex justify-center p-2 gap-5">
      <div>
        <i className="bi bi-caret-left-fill text-3xl cursor-pointer hover:scale-110 duration-200 ease-in-out hover:text-white hover:bg-black" onClick={handlePrevPage}></i>
      </div>
      <div className="flex gap-5 w-5/12 justify-center">
        {
          (ticketPage === totalPage && ticketPage - 4 > 0) &&
            <div className="w-10 border-slate-300 text-center cursor-pointer flex items-center justify-center" onClick={()=> {dispatch(setTicketPage(ticketPage-4))}} >
              {ticketPage - 4}
            </div>
        }
        {
          (((ticketPage === (totalPage - 1)) || (ticketPage === totalPage)) && ticketPage - 3 > 0)  &&
            <div className="w-10 border-slate-300 text-center cursor-pointer flex items-center justify-center" onClick={()=> {dispatch(setTicketPage(ticketPage-3))}} >
              {ticketPage - 3}
            </div>
        }
        {
          ((ticketPage - 2  > totalPage) || (ticketPage - 2 > 0))  &&
            <div className="w-10 border-slate-300 text-center cursor-pointer flex items-center justify-center" onClick={()=> {dispatch(setTicketPage(ticketPage-2))}}>
              {ticketPage - 2}
            </div>
        }
        {
          (ticketPage - 1) > 0 && 
          <div onClick={()=> {dispatch(setTicketPage(ticketPage-1))}} className="w-10  border-slate-300 text-center cursor-pointer flex items-center justify-center">{ticketPage - 1}</div>
        }
          <div className="bg-blue-300 w-10 flex items-center justify-center rounded shadow-md shadow-black/50 font-black border-slate-300 text-center cursor-pointer">
            {ticketPage}
          </div>
        {
          (ticketPage + 1) <= totalPage && 
          <div onClick={()=> {dispatch(setTicketPage(ticketPage+1))}} className="w-10  border-slate-300 text-center cursor-pointer flex items-center justify-center">{ticketPage + 1}</div>
        }
        {
          (ticketPage + 2) <= totalPage && 
          <div onClick={()=> {dispatch(setTicketPage(ticketPage+2))}} className="w-10  border-slate-300 text-center cursor-pointer flex items-center justify-center">{ticketPage + 2}</div>
        }
        {
          (ticketPage + 3) <= totalPage && 
          <div onClick={()=> {dispatch(setTicketPage(ticketPage+3))}} className="w-10  border-slate-300 text-center cursor-pointer flex items-center justify-center">{ticketPage + 3}</div>
        }
        {
          (ticketPage + 4) <= totalPage && 
          <div onClick={()=> {dispatch(setTicketPage(ticketPage+4))}} className="w-10  border-slate-300 text-center cursor-pointer flex items-center justify-center">{ticketPage + 4}</div>
        }
      </div>
       <i className="bi bi-caret-right-fill text-3xl cursor-pointer hover:scale-110 duration-200 ease-in-out hover:text-white hover:bg-black" onClick={handleNextPage}></i>
    </div>
  )
}
