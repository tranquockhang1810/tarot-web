import React from 'react'
import Screen from '@/components/layout/Screen'

const LayoutSidebar = ({
  children
}: {
  children: React.ReactNode
}) => {
  return (
    <Screen>
      {children}
    </Screen>
  )
}

export default LayoutSidebar