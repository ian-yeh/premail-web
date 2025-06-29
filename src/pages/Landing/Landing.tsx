import { ArrowRight, Calendar, Clock, BarChart, Mail } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

//import SlideReveal from "../../components/Text/SlideReveal/SlideReveal";
import FadeIn from "../../components/Text/FadeIn/FadeIn";

import { motion } from 'framer-motion';

function Feature({ icon: Icon, heading, text }: { icon: LucideIcon, heading: string, text: string }) {
  return (
    <div
      className="border-[0.5px] border-gray-300 rounded-2xl w-80 h-60 p-6 flex flex-col items-center text-center"
    >
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
  const navigation = useNavigate();

  const handleLogin = () => {
    navigation("/login");
  }

  return (
    <div className="bg-white w-full flex flex-col">
      <div className="flex justify-center">
        <div className="flex flex-col items-center p-8 text-center w-4/5">
          <FadeIn>
            <h1 className="mt-4 tracking-tight font-inter text-[90px] font-extrabold mb-2 leading-none">An easier way to</h1>
            <h1 className="tracking-tight font-inter text-[90px] font-extrabold leading-none">send emails <span className="text-blue-700">later.</span></h1>
            <h3 className="font-inter text-2xl mt-8 mb-8 w-6/8 mr-auto ml-auto">
              Schedule emails to send at the perfect time, whether you're working across time zones or just want to catch people when they're most likely to respond.
            </h3>
            <motion.button
              onClick={handleLogin}
              className="ml-auto mr-auto bg-blue-500 font-semibold text-white px-12 py-2 rounded-full text-xl flex items-center justify-center gap-2 mb-12"
              whileHover={{
                scale: 1.05,
                backgroundColor: "#2563eb",
                boxShadow: "0 10px 25px rgba(37, 99, 235, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <motion.span>Log in</motion.span>
              <motion.div
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <ArrowRight size={24} />
              </motion.div>
            </motion.button>
          </FadeIn>
          <FadeIn>
            <img src="/assets/blueCity.jpg" alt="Blue city" className="w-full object-cover rounded-lg mt-8 mb-8" />
          </FadeIn>
          <div className="flex flex-col items-center rounded-lg bg-[#f7fbfc] p-6 w-full">
            <FadeIn>
              <h1 className="mt-4 tracking-tight font-inter text-[42px] font-bold mb-12 mt-8 leading-none">The newest way to stay on time</h1>
            </FadeIn>
            <FadeIn>
              <div className="grid grid-cols-2 gap-8 justify-items-center mb-8">
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
            </FadeIn>
          </div>
        </div>
      </div>

    </div>
  )
}