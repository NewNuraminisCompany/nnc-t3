import { Suspense } from 'react'
import dynamic from 'next/dynamic'

const IscrizioniSquadre = dynamic(() => import("@/components/IscrizioniSquadre"), { ssr: false })

export default function Iscrizioni() {
  return (
    <div className="flex flex-col w-full ">
      <h1 className="text-4xl font-bold my-4">Iscrizioni</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <IscrizioniSquadre />
      </Suspense>
    </div>
  )
}