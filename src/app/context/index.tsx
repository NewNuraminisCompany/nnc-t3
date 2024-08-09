'use client'

import { fetchNomiTutteSquadre } from '@/components/actions';
import {createContext, useContext } from 'react';

const Context = createContext({});

export async function SquadreContextProvider(idTorn: string, {children} : {children: React.ReactNode} ) {
    const squadre = await fetchNomiTutteSquadre(idTorn);
    return <Context.Provider value={squadre}>{children}</Context.Provider>;
}

export function useSquadreContext() {
    return useContext(Context);
}