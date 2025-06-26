import { useNavigate } from "react-router-dom"
import { ArrowRight, Calendar, Clock, BarChart, Mail } from "lucide-react";
import { LucideIcon } from "lucide-react";

function Feature({ icon: Icon, heading, text }: {icon: LucideIcon, heading: string, text: string}) {
 return (
   <div className="border-[0.5px] border-gray-600 rounded-2xl w-80 h-60 p-6 flex flex-col items-center text-center">
     <div className="text-4xl mb-4">
        <Icon size={32} />
     </div>
     <h3 className="font-inter font-bold text-xl mb-3">
       {heading}
     </h3>
     <p className="font-inter text-gray-600 text-sm leading-relaxed">
       {text}
     </p>
   </div>
 )
}

export function Landing() {
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate("/login");
  }
  return (
    <div className="bg-white w-full flex justify-center" style={{ height: 'calc(100vh - 136px)' }}>
      <div className="flex flex-col items-center p-8 text-center w-4/5">
        <h1 className="mt-4 tracking-tight font-inter text-[90px] font-extrabold mb-2 leading-none">An easier way to</h1>
        <h1 className="tracking-tight font-inter text-[90px] font-extrabold leading-none">send emails <span className="text-blue-700">later.</span></h1>
        <h3 className="font-inter text-2xl mt-8 mb-8 w-6/8 mr-auto ml-auto">
          Schedule emails to send at the perfect time, whether you're working across time zones or just want to catch people when they're most likely to respond.
        </h3>
        <button onClick={handleLogin} className="bg-blue-500 font-semibold text-white px-12 py-2 rounded-full text-xl flex items-center justify-center gap-2 mb-12">
          Log in <ArrowRight size={24} />
        </button>
        <img src="/assets/blueCity.jpg" alt="Blue city" className="w-full object-cover rounded-lg mt-8 mb-8" />

        <div className="flex flex-col items-center rounded-lg bg-[#FAFEFF] p-6 w-full">
          <h1 className="mt-4 tracking-tight font-inter text-[42px] font-bold mb-12 mt-8 leading-none">The newest way to stay on time</h1>

          <div className="grid grid-cols-2 gap-8 justify-items-center">
            <Feature
              icon={Calendar}
              heading="Smart Scheduling"
              text="Schedule emails to send at the perfect time, whether it's tomorrow morning or next month"
            />

            <Feature
              icon={Clock}
              heading="Time Zone Magic"
              text="Automatically detect recipients' time zones and deliver emails when they're most active"
            />

            <Feature
              icon={Mail}
              heading="Email Templates"
              text="Save time with pre-written templates for common scenarios like follow-ups and reminders"
            />

            <Feature
              icon={BarChart}
              heading="Send Analytics"
              text="Track open rates and engagement to find the best times to reach your contacts"
            />
          </div>

        </div>

      </div>
    </div>
  )
}