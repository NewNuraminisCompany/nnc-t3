"use server";

import { db } from "@/server/db"; // Import your Drizzle ORM setup
import { avvenimenti, gap, giocatori, partite, squadre, tornei } from "@/server/db/schema"; // Import the schema
import type {
    AvvenimentoData,
    EditPlayerData,
    EditTeamData,
    PartitaData,
    PlayerData,
    TeamData,
    TorneoData
} from "@/types/db-types";
export async function getTornei() {
  const result = await db.select().from(tornei);
  return result;
}

import { createId } from "@paralleldrive/cuid2";
import { eq } from "drizzle-orm";

export async function addGiocatori({
  idSquadra,
  giocatori: players,
}: {
  idSquadra: string;
  giocatori: PlayerData[];
}) {
  try {
    const newGiocatori = await db
      .insert(giocatori)
      .values(
        players.map((player) => ({
          idGiocatore: createId(),
          idSquadra,
          cf: player.cf,
          nome: player.nome,
          cognome: player.cognome,
          dataNascita: player.dataNascita,
        })),
      )
      .returning();

    return { success: true, giocatori: newGiocatori };
  } catch (error) {
    console.error("Error in addGiocatori:", error);
    return { success: false, error: "Failed to add giocatori" };
  }
}

export async function updateGiocatore(giocatore: PlayerData) {
  try {
    await db
      .update(giocatori)
      .set({
        nome: giocatore.nome,
        cf: giocatore.cf,
        cognome: giocatore.cognome,
        dataNascita: giocatore.dataNascita,
      })
      .where(eq(squadre.idSquadra, giocatore.idSquadra));
    return { success: true };
  } catch (error) {
    console.error("Error in updateSquadra:", error);
    return { success: false, error: "Failed to update squadra" };
  }
}

export async function updateSquadra(squadra: EditTeamData) {
  try {
    await db
      .update(squadre)
      .set({
        nome: squadra.nome,
        colore: squadra.colore,
        cellulare: squadra.cellulare,
        statoAccettazione: squadra.statoAccettazione,
      })
      .where(eq(squadre.idSquadra, squadra.idSquadra));
    return { success: true };
  } catch (error) {
    console.error("Error in updateSquadra:", error);
    return { success: false, error: "Failed to update squadra" };
  }
}

export async function deleteSquadra(squadra: EditTeamData) {
  try {
    await db.delete(squadre).where(eq(squadre.idSquadra, squadra.idSquadra));
    return { success: true };
  } catch (error) {
    console.error("Error in deleteSquadra:", error);
    return { success: false, error: "Failed to delete squadra" };
  }
}

export async function fetchPlayers(squadraId: string) {
  try {
    const players = await db.query.giocatori.findMany({
      where: eq(giocatori.idSquadra, squadraId),
      with: {
        squadra: true,
      },
    });
    return players;
  } catch (error) {
    console.error("Error fetching players:", error);
    throw new Error("Failed to fetch players");
  }
}
export async function fetchPlayers2(TorneoID: string) {
  try {
    const players = await db
    .selectDistinctOn([giocatori.nome],{/*da cambiare, si dovrebbe selectDistinctOn Codice Fiscale*/
      nome: giocatori.nome,
      cognome: giocatori.cognome,
      idSquadra: giocatori.idSquadra,
      idGiocatore: giocatori.idGiocatore,
      cf: giocatori.cf,
      dataNascita: giocatori.dataNascita
    })
    .from(giocatori)
    .leftJoin(squadre, eq(squadre.idSquadra, giocatori.idSquadra))
    .leftJoin(tornei, eq(tornei.idTorneo, squadre.idSquadra));
    return players;
  } catch (error) {
    console.error("Error fetching players:", error);
    throw new Error("Failed to fetch players");
  }
}

export async function submitTeamAndPlayers({
  team,
  players,
}: {
  team: TeamData;
  players: EditPlayerData[];
  idTorneo: string;
}) {
  try {
    const [insertedTeam] = await db
      .insert(squadre)
      .values({
        idSquadra: createId(),
        nome: team.nome,
        colore: team.colore,
        cellulare: team.cellulare,
        idTorneo: team.idTorneo,
        statoAccettazione: false,
      })
      .returning();

    if (!insertedTeam) {
      throw new Error("Failed to insert team data");
    }

    await db.insert(giocatori).values(
      players.map((player) => ({
        ...player,
        idSquadra: insertedTeam.idSquadra,
      })),
    );

    return { success: true };
  } catch (error) {
    console.error("Error in submitTeamAndPlayers:", error);
    return { success: false, error: "Failed to submit team and players" };
  }
}

export async function submitTorneo({
  nome,
  descrizione,
  dataInizio,
  dataFine,
  imagePath,
}: {
  nome: string;
  descrizione: string;
  dataInizio: string;
  dataFine: string;
  imagePath: string;
}) {
  try {
    await db.insert(tornei).values({
      idTorneo: createId(),
      nome,
      descrizione,
      dataInizio,
      dataFine,
      stato: "programmato", // Initial state
      imagePath,
    });
    return { success: true };
  } catch (error) {
    console.error("Error in submitTorneo:", error);
    return { success: false, error: "Failed to submit tournament" };
  }
}

export async function getSquadreLogo(idSquadra: string) {
  try {
    console.log("Fetching data from squadre, tornei, and gironi tables...");
    const result = await db
      .select({
        logoPath: squadre.logoPath,
      })
      .from(squadre).where(eq(squadre.idSquadra, idSquadra));
      return result;
  } catch (error) {
    console.error("Error fetching squadre:", error);
    throw new Error(
      `Failed to fetch squadre: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

export async function fetchSquadre() {
  try {
    console.log("Fetching data from squadre, tornei, and gironi tables...");
    const result = await db
      .select({
        idSquadra: squadre.idSquadra,
        nome: squadre.nome,
        colore: squadre.colore,
        cellulare: squadre.cellulare,
        statoAccettazione: squadre.statoAccettazione,
        idTorneo: squadre.idTorneo,
        nomeTorneo: tornei.nome,
      })
      .from(squadre)
      .leftJoin(tornei, eq(squadre.idTorneo, tornei.idTorneo));
    console.log(`Fetched ${result.length} records from squadre table.`);

    if (result.length === 0) {
      console.log("No records found in the squadre table.");
      return [];
    }

    return result.map((record) => ({
      idSquadra: record.idSquadra,
      nome: record.nome,
      colore: record.colore,
      cellulare: record.cellulare,
      statoAccettazione: record.statoAccettazione ?? false,
      idTorneo: record.idTorneo,
      nomeTorneo: record.nomeTorneo ?? "Torneo sconosciuto",
    }));
  } catch (error) {
    console.error("Error fetching squadre:", error);
    throw new Error(
      `Failed to fetch squadre: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

export async function fetchTorneo() {
  try {
    console.log("Attempting to fetch data from tornei table...");
    const result = await db.select().from(tornei);

    console.log(`Fetched ${result.length} records from tornei table.`);

    if (result.length === 0) {
      console.log("No records found in the tornei table.");
      return [];
    }

    return result.map((torneo) => ({
      idTorneo: torneo.idTorneo,
      nome: torneo.nome,
      descrizione: torneo.descrizione,
      dataInizio: new Date(torneo.dataInizio),
      dataFine: new Date(torneo.dataFine),
      stato: torneo.stato ?? "programmato", // Provide a default value if stato is null
      imagePath: torneo.imagePath,
    }));
  } catch (error) {
    console.error("Error fetching tornei:", error);
    throw new Error(
      `Failed to fetch tornei: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

export async function deleteTorneo(Torneo: TorneoData) {
  try {
    await db.delete(tornei).where(eq(tornei.idTorneo, Torneo.idTorneo));
    return { success: true };
  } catch (error) {
    console.error("Error in deleteTorneo:", error);
    return { success: false, error: "Failed to delete torneo" };
  }
}

export async function updateTorneo(torneo: TorneoData) {
  try {
    const result = await db
      .update(tornei)
      .set({
        nome: torneo.nome,
        descrizione: torneo.descrizione,
        dataInizio: new Date(torneo.dataInizio).toISOString(),
        dataFine: new Date(torneo.dataFine).toISOString(),
        stato: torneo.stato,
      })
      .where(eq(tornei.idTorneo, torneo.idTorneo))
      .returning();

    if (result.length === 0) {
      return { success: false, error: "Torneo non trovato" };
    }

    return { success: true, updatedTorneo: result[0] };
  } catch (error) {
    console.error("Errore durante la modifica del torneo:", error);
    return { success: false, error: "Failed to update torneo" };
  }
}

export async function submitPartita({
  idSquadra1,
  idSquadra2,
  risultatoSquadra1,
  risultatoSquadra2,
  dataOra,
  girone,
}: {
  idSquadra1: string;
  idSquadra2: string;
  risultatoSquadra1: number;
  risultatoSquadra2: number;
  dataOra: Date;
  girone: "gironeA" | "gironeB" | "gironeSemi" | "gironeFinali";
}) {
  try {
    await db.insert(partite).values({
      idPartita: createId(),
      idSquadra1,
      idSquadra2,
      risultatoSquadra1,
      risultatoSquadra2,
      dataOra,
      girone,
    });
    return { success: true };
  } catch (error) {
    console.error("Error in submitPartita:", error);
    return { success: false, error: "Failed to create match" };
  }
}

export async function fetchPartite(idTorn: string) {
  try {
    console.log("Attempting to fetch data from partite table...");
    console.log("id torneo: ", idTorn);
    const result = await db
      .select({
        idPartita: partite.idPartita,
        idSquadra1: partite.idSquadra1,
        idSquadra2: partite.idSquadra2,
        risultatoSquadra1: partite.risultatoSquadra1,
        risultatoSquadra2: partite.risultatoSquadra2,
        dataOra: partite.dataOra,
        girone: partite.girone,
      })
      .from(partite)
      .innerJoin(squadre, eq(partite.idSquadra1, squadre.idSquadra))
      .where(eq(squadre.idTorneo, idTorn));

    for (const result3 of result) {
      const nomeSqd1 = await db
        .select({ nome: squadre.nome })
        .from(squadre)
        .where(eq(squadre.idSquadra, result3.idSquadra1));
      if (nomeSqd1[0]) {
        result3.idSquadra1 = nomeSqd1[0].nome;
      }
      const nomeSqd2 = await db
        .select({ nome: squadre.nome })
        .from(squadre)
        .where(eq(squadre.idSquadra, result3.idSquadra2));
      if (nomeSqd2[0]) {
        result3.idSquadra2 = nomeSqd2[0].nome;
      }
    }

    console.log(`Fetched ${result.length} records from tornei table.`);

    if (result.length === 0) {
      console.log("No records found in the partite table.");
      return [];
    }

    return result.map((partite) => ({
      idPartita: partite.idPartita,
      idSquadra1: partite.idSquadra1,
      idSquadra2: partite.idSquadra2,
      risultatoSquadra1: partite.risultatoSquadra1,
      risultatoSquadra2: partite.risultatoSquadra2,
      dataOra: new Date(partite.dataOra),
      girone: partite.girone,
    }));
  } catch (error) {
    console.error("Error fetching partite:", error);
    throw new Error(
      `Failed to fetch partite: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

export async function fetchPartite2(idTorn : string) {
  try {
    console.log("Attempting to fetch data from partite table...");
    console.log("id torneo: ",idTorn);
    const result = await db
    .select({
      idPartita: partite.idPartita,
      idSquadra1: partite.idSquadra1,
      idSquadra2: partite.idSquadra2,
      risultatoSquadra1: partite.risultatoSquadra1,
      risultatoSquadra2: partite.risultatoSquadra2,
      dataOra: partite.dataOra,
      girone: partite.girone
    } )
    .from(partite)
    .innerJoin(squadre, eq(partite.idSquadra1, squadre.idSquadra))
    .where(eq(squadre.idTorneo,idTorn));

    if (result.length === 0) {
      console.log("No records found in the partite table.");
      return [];
    }

    return result.map((partite) => ({
      idPartita: partite.idPartita,
      idSquadra1: partite.idSquadra1,
      idSquadra2: partite.idSquadra2,
      risultatoSquadra1: partite.risultatoSquadra1,
      risultatoSquadra2: partite.risultatoSquadra2,
      dataOra: new Date(partite.dataOra),
      girone: partite.girone,
    }));
  } catch (error) {
    console.error("Error fetching partite:", error);
    throw new Error(
      'Failed to fetch partite: ${error instanceof Error ? error.message : String(error)}',
    );
  }
}


export async function updatePartita(partita: PartitaData) {
  try {
    const result = await db
      .update(partite)
      .set({
        idSquadra1: partita.idSquadra1,
        idSquadra2: partita.idSquadra2,
        dataOra: partita.dataOra,
        girone: partita.girone,
      })
      .where(eq(partite.idPartita, partita.idPartita))
      .returning();

    if (result.length === 0) {
      return { success: false, error: "Partita non trovata" };
    }

    return { success: true, updatedPartita: result[0] };
  } catch (error) {
    console.error("Error in updatePartita:", error);
    return { success: false, error: "Failed to update partita" };
  }
}

export async function insertAvvenimento(avvenimento: AvvenimentoData) {
  try {
    const result = await db
      .insert(avvenimenti)
      .values({
        idAvvenimento: avvenimento.idAvvenimento,
        tipo: avvenimento.tipo,
        minuto: avvenimento.minuto,
      })
      .returning();
      console.log("idAvvenimento: ",avvenimento.idAvvenimento);
      const result2 = await db
      .insert(gap)
      .values({
        idAvvenimento: avvenimento.idAvvenimento,
        idGiocatore: avvenimento.idGiocatore,
        idPartita: avvenimento.idPartita,
      })
      .returning();
    if (result.length === 0 || result2.length === 0) {
      return { success: false, error: "avvenimento non inserito" };
    }

    return { success: true};
  } catch (error) {
    console.error("Error in insertAvvenimento:", error);
    return { success: false, error: "Failed to insert Avvenimento" };
  }
}

export async function deletePartita(partita: PartitaData) {
  try {
    await db.delete(partite).where(eq(partite.idPartita, partita.idPartita));
    return { success: true };
  } catch (error) {
    console.error("Error in deletePartita:", error);
    return { success: false, error: "Failed to delete partita" };
  }
}

export async function fetchNomiTutteSquadre(idTorn: string) {
  try {
    console.log("Fetching data from squadre, tornei, and gironi tables...");
    console.log("id torneo: ", idTorn);
    const result = await db
      .select({ nome: squadre.nome, idSquadra: squadre.idSquadra })
      .from(squadre)
      .where(eq(squadre.idTorneo, idTorn));
    console.log(`Fetched ${result.length} records from squadre table.`);

    if (result.length === 0) {
      console.log("No records found in the squadre table.");
      return [];
    }

    return result.map((record) => ({
      nome: record.nome,
      idSquadra: record.idSquadra,
    }));
  } catch (error) {
    console.error("Error fetching squadre:", error);
    throw new Error(
      `Failed to fetch squadre: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}
