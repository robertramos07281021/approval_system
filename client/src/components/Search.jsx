/* eslint-disable react/prop-types */
import {  useState } from "react"
import { useDispatch } from "react-redux"
import { setSearch, setTicketPage, setTickets } from "../redux/features/ticket/ticketSlice"


export const Search = ({data, withPage,refetchSearch,refetchWithPage}) => {
  const dispatch = useDispatch()
  const [searchData, setSearchData] = useState("")
  const [searchStatus, setSearchStatus] = useState("")

  const handleSearch = (e)=> {

    setSearchData(e.target.value)
    setSearchStatus("")
    if(e.target.value.trim() === "") {
      dispatch(setTickets(withPage))
    } else {
      dispatch(setTickets(data.filter((t)=> t.ticket_no.includes(e.target.value))))
   
    }
  }

  const handleSearchStatus = (e) => {
    dispatch(setTicketPage(1))
    setSearchStatus(e.target.value)
    setSearchData('')
    if(e.target.value.trim() !== "") {
      refetchSearch()
      dispatch(setSearch(e.target.value))
    } else {
      refetchWithPage()
      dispatch(setSearch(""))
    }
  }

  return (
    <div className=" flex justify-end mt-1 gap-5">
      <label >
        <input type="text" list="search" placeholder="Search" value={searchData} onChange={handleSearch} className="border-2 rounded py-1 px-2 xs:text-[0.5em] lg:text-base xs:w-32 lg:w-48" />
      </label>
      <datalist id="search">
        {
          data?.map((d,index)=> <option key={index} value={d.ticket_no}>{d.ticket_no}</option>)
        }
      </datalist>
      <label >
        <select className="border-2 rounded py-1 px-2 xs:text-[0.5em] lg:text-base xs:w-32 lg:w-48" value={searchStatus} onChange={handleSearchStatus}>
          <option value="" >Select</option>
          <option value="aom_approval">AOM Approval</option>
          <option value="semi_approval">Ms Wendy Approval</option>
          <option value="verify">For Verification</option>
          <option value="purchasing">Purchasing Ver</option>
          <option value="oos">Out Of Stock</option>
          <option value="last_approval">Ms Ethel Approval</option>
          <option value="receiving">For Receiving</option>
          <option value="complete">Complete</option>
          <option value="reject">Reject</option>
          <option value="fraud">Fraud</option>
        </select>
      </label>
    </div>
  )
}
