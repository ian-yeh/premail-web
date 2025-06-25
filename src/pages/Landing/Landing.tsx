import { useNavigate } from "react-router-dom"

export function Landing() {
  const  navigate = useNavigate();
  const handleLogin = () => {
    navigate("/login");
  }

  return (
    <div className=" bg-white w-full flex items-center justify-center" style={{ height: 'calc(100vh - 136px)'}}>
      <div className="items-center justify-center p-8 text-center">
        <h1 className="tracking-tighter font-instrument text-8xl text-[#7B7B7B]">An easier way to</h1>
        <h1 className="tracking-tighter font-instrument text-8xl mb-4">send emails later.</h1>
        <h3 className="font-inter text-3xl font-extralight mb-8">Email scheduling made simple.</h3>
        <button onClick={handleLogin} className="bg-blue-700 text-white px-6 py-2 rounded-[15px] w-80 h-20 text-xl">Log in</button>
      </div>
    </div>
  )
}