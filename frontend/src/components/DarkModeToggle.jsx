import React, { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark'
  )

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev)
  }

  return (
    <button
      onClick={toggleDarkMode}
      className="fixed top-5 right-5 z-50 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-105 transition-all"
    >
      {darkMode ? <Sun className="text-yellow-400" /> : <Moon className="text-gray-800" />}
    </button>
  )
}

export default DarkModeToggle
