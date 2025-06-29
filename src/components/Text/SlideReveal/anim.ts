import { Variants } from "framer-motion";

export const slideReveal: Variants = {
  initial: {
    width: "100%",
    left: 0,
  },
  enter: {
    width: 0,
    transition: {
      duration: 1.2,
      ease: [0.64, 0, 0.78, 0],
    },
  },
  exit: {
    width: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 0, 0.36, 1]
    }
  }
}