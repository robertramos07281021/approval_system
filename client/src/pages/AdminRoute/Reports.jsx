/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState } from 'react'
import { DashboardWrapper } from '../../components/DashboardWrapper'
import { useAllTicketsQuery, useReportQuery } from '../../redux/api/request'
import { useDispatch, useSelector } from 'react-redux'
import {  removeTicket, setAllTicketsReports, setReports, setTicket, setTotalPeportPage } from '../../redux/features/ticket/ticketSlice'
import { ReportPagination } from '../../components/ReportPagination'
import { RequestInformationModal } from '../../components/RequestInformationModal'
import { Link } from 'react-router-dom'

export const Reports = () => {
  const [data, setData] = useState({
    branch: "",
    dept: "",
    from: "",
    to: ""
  })
  const {data: allTickets} = useAllTicketsQuery()
  const allTicketsDept = []
  const allTicketBranch = []
  const [allTicketsDepts, setAllTicketsDepts] = useState([])
  const [allTicketsBranches, setAllTicketsBranches] = useState([])
  const dispatch = useDispatch()
  const {reports,reportPage,totalReportPage,ticket,allTicketsReports } = useSelector((state)=> state.ticket)
  const [isOpen, setIsOpen] = useState(false)
  const [transition, setTransition] = useState('-translate-y-5 opacity-0')

  const isComplete = allTickets?.filter((at) => at.complete_details.is_complete === true)

  //is open
  const handleOpen = async(data) => {
    setIsOpen(true)
    setTimeout(()=> {
      setTransition("-translate-y-0 opacity-100")
    })
    dispatch(setTicket(data))
  }

  //close button
  const handleClose = ()=> {
    setTransition("-translate-y-5 opacity-0")
    setTimeout(()=> {
      setIsOpen(false);
      dispatch(removeTicket())
    },700)
  }

  useEffect(()=> {
    allTickets?.forEach((element) => {
      if(!allTicketsDept.includes(element.department)) {
        allTicketsDept.push(element.department)
      }
      setAllTicketsDepts(allTicketsDept)
    })
    
    allTickets?.forEach((element) => {
      if(!allTicketBranch.includes(element.branch)) {
        allTicketBranch.push(element.branch)
      }
      setAllTicketsBranches(allTicketBranch)
    })
  },[allTickets])

  const {data: reportsData, refetch} = useReportQuery({branch: data.branch, dept: data.dept, from: data.from, to: data.to, page: reportPage})
  

  useEffect(()=> {
    refetch()
  },[data])

  useEffect(()=> {
    dispatch(setReports(reportsData?.tickets))
    dispatch(setTotalPeportPage(reportsData?.totalPage))
    dispatch(setAllTicketsReports(reportsData?.allTicketsReports))
  },[reportsData])

  return (
    <>
      <DashboardWrapper>
        <div className='h-full relative overflow-y-auto'>
          <div className="flex flex-col sticky top-0 bg-white p-2">
            <div className='flex justify-between'>
              <div className="text-2xl font-bold">
                Reports
              </div>
              <div className='flex gap-10'>
                <select className='border-2 rounded w-52 ' onChange={(e)=> setData({...data, branch: e.target.value})}>
                  <option value="">Select Branch</option>
                  {
                    isComplete?.length > 0 &&   
                    <>
                      {
                        allTicketsBranches?.map((branch,index)=> <option key={index} value={branch}>{branch}</option>)
                      }
                    </>
                  }
                </select>
                <select className='border-2 rounded w-52 ' onChange={(e)=> setData({...data, dept: e.target.value})}>
                  <option value="">Select Department</option>
                  {
                    isComplete?.length > 0 && 
                    <>
                      {
                        allTicketsDepts?.map((dept,index)=> 
                        <option key={index} value={dept}>{dept}</option>)
                      } 
                    </>
                  }
                </select>
                <div className='flex gap-2 items-center'>
                  <label>
                    <span>From :</span>
                    <input type="date" className='border-b-2' onChange={(e)=> setData({...data, from: e.target.value})}/>
                  </label>
                  <div> - </div>
                  <label>
                    <span>To :</span>
                    <input type="date" className='border-b-2' onChange={(e)=> setData({...data, to: e.target.value})} />
                  </label>
                </div>
              </div>
            </div>
            <hr className='border border-black mt-1' />
            <div className='py-2 grid grid-cols-10 text-center divide-x divide-gray-950 font-semibold'>
              <div>Ticket No</div>
              <div>Request</div>
              <div>Qty.</div>
              <div>Request Date</div>
              <div className='col-span-2'>Employee</div>
              <div>Position</div>
              <div>Department</div>
              <div>Branch</div>
              <div>Receive Date</div>
            </div>
            <hr className='border border-black' />
          </div>
          {
            reports?.map((ticket)=> <div key={ticket._id} className="text-sm grid grid-cols-10 text-center py-1 even:bg-slate-200 border border-white hover:border-slate-500 cursor-pointer" onClick={()=> handleOpen(ticket)}>
              <div className='font-mono'> {ticket.ticket_no}</div>
              <div>{ticket.request}</div>
              <div>{ticket.qty}</div>
              <div>{(new Date(ticket.createdAt).getMonth() + 1) + "/" + new Date(ticket.createdAt).getDate() + "/" + new Date(ticket.createdAt).getFullYear()}</div>
              <div className='col-span-2'>{ticket.employee_name}</div>
              <div>{ticket.position}</div>
              <div>{ticket.department}</div>
              <div>{ticket.branch}</div>
              <div>{(new Date(ticket.complete_details.complete_date).getMonth() + 1) + "/" + new Date(ticket.complete_details.complete_date).getDate() + "/" + new Date(ticket.complete_details.complete_date).getFullYear()}</div>
            </div>)
          }
          <div className='absolute bottom-4 -translate-x-1/2 w-full left-[50%]'>
          {
            totalReportPage > 1 && 
            <ReportPagination/>
          }
          </div>
          {

          }
          { allTicketsReports?.length > 0 && 
          
            <Link to={`/print-preview?branch=${data.branch}&dept=${data.dept}&from=${data.from}&to=${data.to}`} title='Print Preview' className='absolute right-3 bottom-3 w-14 h-14 rounded-full shadow-md shadow-black/50 flex items-center justify-center bg-blue-300 hover:scale-110 duration-200 ease-in-out cursor-pointer'>
            <i className="bi bi-printer-fill text-4xl"></i>
            </Link>
          }
        </div>
      </DashboardWrapper>
      { 
        isOpen &&
        <div className="absolute left-0 top-0 bg-white/50 w-full h-full z-50 flex items-center justify-center">
          <div className={`w-6/12 h-[90%] flex flex-col rounded-md shadow-lg shadow-black/50 bg-white relative overflow-hidden transition-all duration-700 ${transition}`}>
            <div className="border-2 w-8 h-8 flex items-center justify-center border-black/20 absolute top-2 right-2 cursor-pointer rounded-full bg-white hover:bg-black hover:text-white duration-200 ease-in-out font-semibold " onClick={handleClose}>X</div>
            <RequestInformationModal ticket={ticket}/>
          </div>
        </div>
      }
    </>
  )
}
