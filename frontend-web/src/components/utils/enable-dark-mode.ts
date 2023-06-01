export const generateColorMode = (isDarkMode: string): string => {
  return isDarkMode === "dark" ? "dark" : "light"
}

export const generateIconColorMode = (isDarkMode: string): string => {
  //return isDarkMode === "dark" ? "#dcdcdc" : "#4A4A4A"
  return isDarkMode === "dark" ? "white" : "#202225"
}

export const generateLinkColorMode = (isDarkMode: string): string => {
  return isDarkMode === "dark" ? "white" : "#202225"
}

export const generateClassName = (isDarkMode: string): string => {
  return isDarkMode === "dark" ? "dark-t" : "light-t"
}