import { useDispatch, useSelector } from 'react-redux'
import { setReportPage } from '../redux/features/ticket/ticketSlice'

export const ReportPagination = () => {
  const dispatch = useDispatch()
  const {totalPage,reportPage} = useSelector((state)=> state.ticket)
  

  const handlePrevPage = () => {
    if((reportPage -1 ) > 0) {
      dispatch(setReportPage(reportPage - 1))
    }
  }

  const handleNextPage = () => {
    if((reportPage +1 ) <= totalPage) {
      dispatch(setReportPage(reportPage+1))
    }
  }

  return (
    <div className="flex justify-center p-2 gap-5">
    <div>
      <i className="bi bi-caret-left-fill text-3xl cursor-pointer hover:scale-110 duration-200 ease-in-out hover:text-white hover:bg-black" onClick={handlePrevPage}></i>
    </div>
    <div className="flex gap-5 w-5/12 justify-center">
      {
        (reportPage === totalPage && reportPage - 4 > 0) &&
          <div className="w-10 border-slate-300 text-center cursor-pointer flex items-center justify-center" onClick={()=> {dispatch(setReportPage(reportPage-4))}} >
            {reportPage - 4}
          </div>
      }
      {
        (((reportPage === (totalPage - 1)) || (reportPage === totalPage)) && reportPage - 3 > 0)  &&
          <div className="w-10 border-slate-300 text-center cursor-pointer flex items-center justify-center" onClick={()=> {dispatch(setReportPage(reportPage-3))}} >
            {reportPage - 3}
          </div>
      }
      {
        ((reportPage - 2  > totalPage) || (reportPage - 2 > 0))  &&
          <div className="w-10 border-slate-300 text-center cursor-pointer flex items-center justify-center" onClick={()=> {dispatch(setReportPage(reportPage-2))}}>
            {reportPage - 2}
          </div>
      }
      {
        (reportPage - 1) > 0 && 
        <div onClick={()=> {dispatch(setReportPage(reportPage-1))}} className="w-10  border-slate-300 text-center cursor-pointer flex items-center justify-center">{reportPage - 1}</div>
      }
        <div className="bg-blue-300 w-10 flex items-center justify-center rounded shadow-md shadow-black/50 font-black border-slate-300 text-center cursor-pointer">
          {reportPage}
        </div>
      {
        (reportPage + 1) <= totalPage && 
        <div onClick={()=> {dispatch(setReportPage(reportPage+1))}} className="w-10  border-slate-300 text-center cursor-pointer flex items-center justify-center">{reportPage + 1}</div>
      }
      {
        (reportPage + 2) <= totalPage && 
        <div onClick={()=> {dispatch(setReportPage(reportPage+2))}} className="w-10  border-slate-300 text-center cursor-pointer flex items-center justify-center">{reportPage + 2}</div>
      }
      {
        (reportPage + 3) <= totalPage && 
        <div onClick={()=> {dispatch(setReportPage(reportPage+3))}} className="w-10  border-slate-300 text-center cursor-pointer flex items-center justify-center">{reportPage + 3}</div>
      }
      {
        (reportPage + 4) <= totalPage && 
        <div onClick={()=> {dispatch(setReportPage(reportPage+4))}} className="w-10  border-slate-300 text-center cursor-pointer flex items-center justify-center">{reportPage + 4}</div>
      }
    </div>
     <i className="bi bi-caret-right-fill text-3xl cursor-pointer hover:scale-110 duration-200 ease-in-out hover:text-white hover:bg-black" onClick={handleNextPage}></i>
  </div>
  )
}
