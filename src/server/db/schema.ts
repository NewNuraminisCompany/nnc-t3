import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTableCreator,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
  date,
  boolean,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";
import { createId } from '@paralleldrive/cuid2';


/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `nnc-sito-t3_${name}`);

export const posts = createTable(
  "post",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    createdById: varchar("created_by", { length: 255 })
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    ),
  },
  (example) => ({
    createdByIdIdx: index("created_by_idx").on(example.createdById),
    nameIndex: index("name_idx").on(example.name),
  })
);

export const users = createTable("user", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("email_verified", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  image: varchar("image", { length: 255 }),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

export const accounts = createTable(
  "account",
  {
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 255,
    }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_user_id_idx").on(account.userId),
  })
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("session_token", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_user_id_idx").on(session.userId),
  })
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verification_token",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

// Nuove definizioni di tabelle

export const tornei = createTable("torneo", {
  idTorneo: varchar("id_torneo").primaryKey().$defaultFn(() => createId()),
  nome: varchar("nome").notNull(),
  descrizione: varchar("descrizione").notNull(),
  dataInizio: date("data_inizio").notNull(),
  dataFine: date("data_fine").notNull(),
  stato: varchar('stato', {enum: ["programmato", "inCorso", "terminato"] })
});

export const squadre = createTable("squadre", {
  idSquadra: varchar("id_squadra").primaryKey().$defaultFn(() => createId()),
  nome: varchar("nome").notNull(),
  colore: varchar("colore").notNull(),
  cellulare: varchar("cellulare", {length: 11}).notNull(),
  statoAccettazione: boolean('statoAccettazione'),
  idTorneo: varchar("id_torneo").notNull().references(() => tornei.idTorneo)
});


export const giocatori = createTable("giocatori", {
  cf: varchar("cf").primaryKey(),
  nome: varchar("nome").notNull(),
  cognome: varchar("cognome").notNull(),
  dataNascita: date("data_nascita").notNull(),
  idSquadra: varchar("id_squadra").notNull().references(() => squadre.idSquadra),
});

export const partite = createTable("partite", {
  idPartita: varchar("id_partita").primaryKey(),
  idSquadra1: varchar("id_squadra1").notNull().references(() => squadre.idSquadra),
  idSquadra2: varchar("id_squadra2").notNull().references(() => squadre.idSquadra),
  risultatoSquadra1: integer("risultato_squadra1").notNull(),
  risultatoSquadra2: integer("risultato_squadra2").notNull(),
  dataOra: timestamp("data_ora", { withTimezone: true }).notNull(),
});

export const avvenimenti = createTable("avvenimento", {
  tipo: varchar("tipo").notNull(),
  minuto: integer("minuto").notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.tipo, table.minuto] }),
}));

export const gap = createTable("gap", {
  cf: varchar("cf").notNull().references(() => giocatori.cf),
  minuto: integer("minuto").notNull(),
  tipo: varchar("tipo").notNull(),
  idPartita: varchar("id_partita").notNull().references(() => partite.idPartita),
}, (table) => ({
  pk: primaryKey({ columns: [table.cf, table.minuto, table.tipo, table.idPartita] }),
}));

// Relazioni per le nuove tabelle

export const giocatoriRelations = relations(giocatori, ({ one }) => ({
  squadra: one(squadre, {
    fields: [giocatori.idSquadra],
    references: [squadre.idSquadra],
  }),
}));

export const partiteRelations = relations(partite, ({ one }) => ({
  squadra1: one(squadre, {
    fields: [partite.idSquadra1],
    references: [squadre.idSquadra],
  }),
  squadra2: one(squadre, {
    fields: [partite.idSquadra2],
    references: [squadre.idSquadra],
  }),
}));

export const gapRelations = relations(gap, ({ one }) => ({
  giocatore: one(giocatori, {
    fields: [gap.cf],
    references: [giocatori.cf],
  }),
  partita: one(partite, {
    fields: [gap.idPartita],
    references: [partite.idPartita],
  }),
  avvenimento: one(avvenimenti, {
    fields: [gap.tipo, gap.minuto],
    references: [avvenimenti.tipo, avvenimenti.minuto],
  }),
}));

