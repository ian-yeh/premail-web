import { Variants } from "framer-motion"

export const fadeIn: Variants = {
  initial: {
    opacity: 0,
    y: 25,
  },
  enter: {
    opacity: 1,
    y: 0,
  },
  exit: {
    transition: {
      duration: 1.2,
    }
  }
}