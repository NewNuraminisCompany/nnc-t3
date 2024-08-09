"use client"

import React, { createContext, useContext } from 'react';

const TorneoContext = createContext<string>("");

export const useTorneo = () => useContext(TorneoContext);

export const TorneoProvider = ({ idTorneo, children }: { idTorneo: string; children: React.ReactNode }) => {
  return <TorneoContext.Provider value={idTorneo}>{children}</TorneoContext.Provider>;
};
