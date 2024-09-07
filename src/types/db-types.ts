export type TeamData = {
  nome: string;
  colore: string;
  cellulare: string;
  statoAccettazione: boolean;
  idTorneo: string;
};

export type EditTeamData = {
  idSquadra: string;
  nome: string;
  colore: string;
  cellulare: string;
  statoAccettazione: boolean;
  idTorneo: string | null;
};

export type PlayerData = {
  cf: string;
  nome: string;
  cognome: string;
  dataNascita: string;
  idSquadra: string;
  idGiocatore: string;
};

export type PlayerData2 = {
  cf: string;
  nome: string;
  cognome: string;
  dataNascita: Date;
  idSquadra: string;
  idGiocatore: string;
};

export type EditPlayerData = {
  cf: string;
  nome: string;
  cognome: string;
  dataNascita: string;
};

export type TorneoData = {
  idTorneo: string;
  nome: string;
  descrizione: string,
  dataInizio: Date;
  dataFine: Date;
  stato: "programmato" | "inCorso" | "terminato";
}

export type EditTorneoData = {
  idTorneo: string;
  nome: string;
  descrizione: string,
  dataInizio: Date;
  dataFine: Date;
  stato: "programmato" | "inCorso" | "terminato";
}

export type PartitaData = {
  idPartita: string;
  idSquadra1: string;
  idSquadra2: string;
  risultatoSquadra1: number;
  risultatoSquadra2: number;
  dataOra: Date;
  girone: "gironeA" | "gironeB" | "gironeSemi" | "gironeFinali";
};

export type AvvenimentoData = {
  idPartita: string,
  idGiocatore: string,
  idAvvenimento: string;
  tipo: "Goal" | "Espulsione" | "Ammonizione";
  minuto: number;
  nomeGiocatore: string;
}

