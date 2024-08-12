"use server";

import {
  fetchAvvenimenti,
  fetchPartitaa,
  fetchTorneoFromPartita,
} from "@/components/actions";
import AvvenimentiTimeline from "@/components/AvvenimentiTimeline";

interface Params {
  idPartita: string;
}

const Avvenimenti = async ({ params }: { params: Params }) => {
  const { idPartita } = params;
  console.log("idPartita: ", idPartita);
  const data = await fetchAvvenimenti(idPartita);
  const torneoData = await fetchTorneoFromPartita(idPartita);

  const torneoId = torneoData?.[0]?.idTorneo;

  if (torneoId) {
    const partiteData = await fetchPartitaa(torneoId,idPartita);
    if (data && partiteData) {
      return (
        <div className="flex w-full flex-col">
          <h1 className="my-4 text-3xl font-bold md:text-4xl">
            Risultati Partita
          </h1>
          <div className="mx-auto flex w-full max-w-xl flex-col items-center justify-between space-y-2 pt-8 text-center text-lg font-bold sm:flex-row sm:space-y-0 sm:text-left sm:text-xl md:text-2xl">
            <div className="flex w-full justify-center sm:w-auto sm:justify-start">
              <span>{partiteData[0]?.idSquadra1}</span>
            </div>
            <div className="flex items-center justify-center text-3xl font-extrabold sm:text-4xl md:text-5xl">
              <span>{partiteData[0]?.risultatoSquadra1}</span>
              <span className="mx-2">:</span>
              <span>{partiteData[0]?.risultatoSquadra2}</span>
            </div>
            <div className="flex w-full justify-center sm:w-auto sm:justify-end">
              <span>{partiteData[0]?.idSquadra2}</span>
            </div>
          </div>
          <div className="mx-auto mt-8 w-full max-w-md">
            <AvvenimentiTimeline avvenimenti={data} />
          </div>
        </div>
      );
    }
  }
  return null;
};

export default Avvenimenti;
