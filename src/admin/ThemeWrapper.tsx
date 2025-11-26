import React from 'react'
import '../admin/wavenation.css'

const ThemeWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div id="wavenation-admin">{children}</div>
}

export default ThemeWrapper
