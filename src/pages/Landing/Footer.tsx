import { ArrowRight } from "lucide-react";
import FadeIn from "../../components/Text/FadeIn/FadeIn.tsx";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  const handleJoin = () => {
    navigate('/');
  }

  return (
    <FadeIn>
      <footer className="w-full h-100 bg-blue-700 flex flex-col items-center justify-center font-inter gap-8">
        <h1 className="text-white text-4xl font-bold">
          Start saying connected today.
        </h1>
        <button 
          className="bg-white text-blue-700 font-semibold px-8 py-3 rounded-full text-lg flex items-center gap-2 transition-all duration-300 hover:bg-blue-50 hover:scale-105 hover:shadow-lg group"
          onClick={handleJoin}
        >
          Join Us
          <ArrowRight
            size={20}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </button>

      </footer>
    </FadeIn>
  );
}