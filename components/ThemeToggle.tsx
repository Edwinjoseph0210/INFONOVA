'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiSun, FiMoon } from 'react-icons/fi'

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className="relative h-10 w-10 rounded-lg overflow-hidden border border-gray-200 dark:border-white/20 bg-white/80 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-all z-10 flex items-center justify-center group"
      aria-label="Toggle theme"
    >
      <div className="relative w-full h-full flex items-center justify-center">
        <motion.div
          initial={false}
          animate={{
            scale: resolvedTheme === 'dark' ? 1 : 0,
            opacity: resolvedTheme === 'dark' ? 1 : 0,
          }}
          transition={{ duration: 0.2 }}
          className="absolute"
        >
          <FiSun className="w-5 h-5 text-yellow-400" />
        </motion.div>
        <motion.div
          initial={false}
          animate={{
            scale: resolvedTheme === 'dark' ? 0 : 1,
            opacity: resolvedTheme === 'dark' ? 0 : 1,
          }}
          transition={{ duration: 0.2 }}
          className="absolute"
        >
          <FiMoon className="w-5 h-5 text-gray-900" />
        </motion.div>
      </div>
      <div className="absolute inset-0 rounded-lg transition-opacity duration-300 opacity-0 group-hover:opacity-10 bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500" />
    </motion.button>
  )
} 