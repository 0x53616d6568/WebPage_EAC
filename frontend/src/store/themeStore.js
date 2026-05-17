import { create } from 'zustand'

export const useThemeStore = create((set) => {
  // Load theme from localStorage
  const savedTheme = localStorage.getItem('theme') || 'light'
  
  return {
    isDarkMode: savedTheme === 'dark',
    setDarkMode: (isDark) => {
      set({ isDarkMode: isDark })
      localStorage.setItem('theme', isDark ? 'dark' : 'light')
    },
    toggleDarkMode: () => {
      set((state) => {
        const newIsDark = !state.isDarkMode
        localStorage.setItem('theme', newIsDark ? 'dark' : 'light')
        return { isDarkMode: newIsDark }
      })
    },
  }
})
