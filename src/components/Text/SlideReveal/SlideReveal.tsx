import { ReactNode } from 'react'
import { motion, Variants } from 'framer-motion';
import { slideReveal } from './anim';

const anim = (variants: Variants) => {
  return {
    initial: "initial",
    animate: "enter",
    exit: "exit",
    variants
  }
}

interface LayoutProps {
  children: ReactNode
}
export default function Layout({ children }: LayoutProps) {
  return (
    <div className="relative inline-block p-4">
      <motion.div
        className="absolute inset-0 bg-white z-10"
        {...anim(slideReveal)}
      />
      
      {/* Content */}
      <div className="relative">
        {children}
      </div>
    </div>
  )
}