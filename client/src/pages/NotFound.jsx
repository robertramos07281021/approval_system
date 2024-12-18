

const NotFound = () => {
  const query = window.location.search
  return (
    <div className="h-screen  relative w-full flex overflow-x-hidden bg-no-repeat bg-cover items-center justify-center" style={{backgroundImage: `url(/001.jpg)`}}>
       <div className="absolute w-full h-full bg-blue-500/60 backdrop-blur-sm z-10">
       </div>
        <div className="w-8/12 h-5/6 mt-10 bg-white z-20  flex rounded-md shadow-md shadow-black/50 items-center justify-center text-center">
          
          
          {query === "?error=Danger" ? (
            <p className="xs:text-3xl lg:text-7xl font-black">You Dont Have Authorize To Do That!</p>
          ) : (

            <p className="xs:text-3xl lg:text-7xl font-black">ERROR: 404, PAGE NOT FOUND </p>
          )}
        </div>
    </div>
  )
}

export default NotFound