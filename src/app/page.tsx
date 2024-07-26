import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

const Home = async () => {
  const session = await getServerSession()
  if (session?.user?.name) {
    redirect('/dashboard')
  }
  return (

    <div> 
      <h1>Coddadi</h1>
    </div>
  )
}

export default Home 
