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
  idTorneo: string;
};

export type PlayerData = {
  cf: string;
  nome: string;
  cognome: string;
  dataNascita: string;
  idSquadra: string;
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
  dataInizio: Date;
  dataFine: Date;
  stato: "programmato" | "inCorso" | "terminato";
}

export type EditGironeData = {
  idGirone: string;
  nome: string;
  idSquadra: string;
  idPartita: string;
}