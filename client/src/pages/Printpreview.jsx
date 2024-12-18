/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router"


export const Printpreview = () => {
  const {allTicketsReports} = useSelector((state)=> state.ticket)
  const location = useLocation()
  const locationNew = location.search.split("&")
  const year = []
  const [yearData, setYearData] = useState([])
  const navigate = useNavigate()

  useEffect(()=> {
    Array.from(allTicketsReports).forEach((element)=> {
      if(!year.includes(new Date(element.createdAt).getFullYear())) {
        year.push(new Date(element.createdAt).getFullYear())
      }
    })
    setYearData(year.sort())
  },[allTicketsReports])

  useEffect(()=> {
    if(allTicketsReports.length < 1) {
      navigate('/reports')
    }
  },[allTicketsReports])

  const handlePrint = ()=> {
    window.print()
  }

  return (
    <div className="relative min-h-screen">
      <div className="flex gap-2 sticky top-0">
        <img src="/bernalesLogo.png" alt="logo" className="w-56"/>
        <div className="flex items-center flex-col pt-5 w-full">
          {
            (locationNew[0].length === locationNew[0].indexOf("=") + 1)
            ? (<h1 className="text-3xl font-bold">All Branches</h1>) : 
            (
              <h1 className="text-3xl font-bold">
                {locationNew[0].slice(locationNew[0].indexOf("=") + 1, locationNew[0].length)}
              </h1>
            )
          }
          {
            (locationNew[1].length === locationNew[1].indexOf("=") + 1) ?
            (<h1 className="text-xl font-semi">All Departments</h1>) : 
            (<h1 className="text-xl font-semi">{locationNew[1].slice(locationNew[1].indexOf("=") + 1, locationNew[1].length)}</h1>)
          }
          {
            (locationNew[2].length === locationNew[2].indexOf("=") + 1) &&
            (locationNew[3].length === locationNew[3].indexOf("=") + 1) ?
            (<h1>
              {
                yearData?.length > 1 ? `${yearData[0]} - ${yearData[yearData?.length - 1]}` : `${yearData[0]}`
              }
            </h1>) : 
            (<h1>
              {
                (locationNew[2].length !== locationNew[2].indexOf("=") + 1) &&
                (locationNew[3].length === locationNew[3].indexOf("=") + 1) ? `${locationNew[2].slice(locationNew[2].indexOf("=") + 1, locationNew[2].length)}` : ""
              }
              {
                (locationNew[2].length === locationNew[2].indexOf("=") + 1) &&
                (locationNew[3].length !== locationNew[3].indexOf("=") + 1) ? `${locationNew[3].slice(locationNew[3].indexOf("=") + 1, locationNew[3].length)}` : ""
              }
              {
                (locationNew[2].length !== locationNew[2].indexOf("=") + 1) &&
                (locationNew[3].length !== locationNew[3].indexOf("=") + 1) ? ` ${locationNew[2].slice(locationNew[2].indexOf("=") + 1, locationNew[2].length)} - ${locationNew[3].slice(locationNew[3].indexOf("=") + 1, locationNew[3].length)}` : ""
              }
            </h1>)
          }
        </div>
      </div>
      <div className=" w-full">
        <hr className='border border-black mt-1' />
        <div className='py-2 grid grid-cols-10 text-center divide-x divide-gray-950 font-semibold text-sm'>
          <div>Ticket No</div>
          <div>Request</div>
          <div>Qty.</div>
          <div>Request Date</div>
          <div className='col-span-2'>Employee</div>
          <div>Position</div>
          <div>Dept</div>
          <div>Branch</div>
          <div>Receive Date</div>
        </div>
        <hr className='border border-black' />
        {allTicketsReports?.map((ticket)=> 
          <div key={ticket._id} className="py-2 grid grid-cols-10 text-center font-semibold text-xs  border-b-2">
          <div className="font-mono">{ticket.ticket_no}</div>
          <div>{ticket.request}</div>
          <div>{ticket.qty}</div>
          <div>{(new Date(ticket.createdAt).getMonth() + 1) + "/" + new Date(ticket.createdAt).getDate() + "/" + new Date(ticket.createdAt).getFullYear()}</div>
          <div className='col-span-2'>{ticket.employee_name}</div>
          <div>{ticket.position}</div>
          <div>{ticket.department}</div>
          <div>{ticket.branch}</div>
          <div>{(new Date(ticket.complete_details.complete_date).getMonth() + 1) + "/" + new Date(ticket.complete_details.complete_date).getDate() + "/" + new Date(ticket.complete_details.complete_date).getFullYear()}</div>
          </div>
        )}

        
        </div>

        <div title='Print' id="printPageButton" className='absolute right-3 bottom-3 w-14 h-14 rounded-full shadow-md shadow-black/50 flex items-center justify-center bg-blue-300 hover:scale-110 duration-200 ease-in-out cursor-pointer print:hidden' onClick={handlePrint}>
            <i className="bi bi-printer-fill text-4xl"></i>
        </div>
    </div>
  )
}
