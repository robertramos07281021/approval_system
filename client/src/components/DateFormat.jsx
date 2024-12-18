/* eslint-disable react/prop-types */


export const DateFormat = ({date}) => {
  const month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"]
  const hrTime = [1,2,3,4,5,6,7,8,9,10,11,12,1,2,3,4,5,6,7,8,9,10,11,12]
  return (
    <div>
      {
        month[new Date(date).getMonth()] + " " + new Date(date).getDate() + ', ' + new Date(date).getFullYear() + " - " + hrTime[new Date(date).getHours() - 1] + ":" + ((new Date(date).getMinutes() < 9) ? ("0" + new Date(date).getMinutes()) : (new Date(date).getMinutes())) + " " + ((new Date(date).getHours() > 12) ? "PM" : "AM")
      }
    </div>
  )
}
