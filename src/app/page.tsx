import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { Bento } from '@/components/Bento'

const Home = async () => {
  const session = await getServerSession()
  if (session?.user?.name) {
    redirect('/dashboard')
  }
  return (

    <div> 
      <Bento />
    </div>
  )
}

export default Home 
