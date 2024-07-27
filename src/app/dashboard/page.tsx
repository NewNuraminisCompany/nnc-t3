import React from 'react'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import ComboBoxDashboard from '@/components/ComboBoxDashboard';


const Dashboard = async () => {
  const session = await getServerSession();
  if (!session?.user?.name) {
    redirect('/')
  }

  return (
    <ComboBoxDashboard />
  )
}

export default Dashboard
