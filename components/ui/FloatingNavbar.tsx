"use client";
import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { Link as ScrollLink } from "react-scroll";

interface FloatingNavProps extends React.HTMLAttributes<HTMLDivElement> {
  items: {
    href: string;
    text: string;
  }[];
}

export default function FloatingNav({
  className,
  items,
  ...props
}: FloatingNavProps) {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [prevScrollY, setPrevScrollY] = useState(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const currentScrollY = latest;
    const isScrollingUp = currentScrollY < prevScrollY;
    
    if (currentScrollY < 100) {
      setVisible(true);
    } else {
      setVisible(isScrollingUp);
    }
    
    setPrevScrollY(currentScrollY);
  });

  return (
    <div className="fixed top-8 inset-x-0 mx-auto z-[9999] flex justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          initial={{
            opacity: 1,
            y: -100,
          }}
          animate={{
            y: visible ? 0 : -100,
            opacity: visible ? 1 : 0,
          }}
          transition={{
            duration: 0.2,
          }}
          className={cn(
            "relative md:relative",
            className
          )}
        >
          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden relative inline-flex h-12 overflow-hidden rounded-lg p-[1px] focus:outline-none"
          >
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#FF6B6B_0%,#9400D3_50%,#FF6B6B_100%)]" />
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-slate-950 px-3 py-1 backdrop-blur-3xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </span>
          </button>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ type: "spring", damping: 20 }}
                className="fixed top-0 right-0 h-screen w-64 bg-white/80 dark:bg-slate-950 backdrop-blur-3xl relative"
              >
                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#FF6B6B_0%,#9400D3_50%,#FF6B6B_100%)]" />
                <div className="flex flex-col p-4 relative z-10">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="self-end p-2 mb-4 text-gray-900 dark:text-white"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                  {items.map((item, index) => (
                    <ScrollLink
                      key={item.href}
                      to={item.href}
                      spy={true}
                      smooth={true}
                      offset={-100}
                      duration={100}
                      className="px-4 py-3 text-base hover:text-[#FF6B6B] rounded-lg cursor-pointer transition-colors text-gray-900 dark:text-white"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.text}
                    </ScrollLink>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <div className="relative inline-flex h-12 overflow-hidden rounded-lg p-[1px] focus:outline-none">
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#FF6B6B_0%,#9400D3_50%,#FF6B6B_100%)]" />
              <div className="inline-flex h-full cursor-pointer items-center justify-center rounded-lg bg-white/80 dark:bg-slate-950 px-3 py-1 text-sm font-medium text-gray-900 dark:text-white backdrop-blur-3xl">
                <div className="flex items-center gap-2 px-4">
                  {items.map((item, index) => (
                    <ScrollLink
                      key={item.href}
                      to={item.href}
                      spy={true}
                      smooth={true}
                      offset={-100}
                      duration={100}
                      className="px-4 py-2 text-base hover:text-[#FF6B6B] transition-colors cursor-pointer text-gray-900 dark:text-white"
                    >
                      {item.text}
                    </ScrollLink>
                  ))}
                </div>
              </div>
            </div>
          </nav>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
