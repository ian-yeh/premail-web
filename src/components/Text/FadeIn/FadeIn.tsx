import { ReactNode, useRef } from 'react'
import { useInView, AnimatePresence, motion, Variants } from 'framer-motion';
import { fadeIn } from './anim';

const anim = (variants: Variants, inView: boolean) => {
  return {
    initial: "initial",
    animate: inView ? "enter" : "initial",
    exit: "exit",
    variants
  }
}

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const ref = useRef(null);
  const inView = useInView(ref, {
    once: true,
    margin: "-250px",
  })
  return (
    <>
      <AnimatePresence>
        <motion.div
          ref={ref}
          {...anim(fadeIn, inView)}
        >
          {children}
        </motion.div>

      </AnimatePresence>
    </>
  )
}