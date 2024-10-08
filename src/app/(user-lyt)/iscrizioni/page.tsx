import React, { Suspense } from 'react';
import IscrizioniSquadre from '@/components/IscrizioniSquadre';

export default function Iscrizioni() {
  return (
    <div className="flex flex-col w-full">
      <h1 className="text-4xl font-bold my-4">Iscrizioni</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <IscrizioniSquadre />
      </Suspense>
    </div>
  );
}
