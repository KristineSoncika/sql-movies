import {
  ALL_RELATIONSHIP_TABLES,
  MOVIE_GENRES,
  MOVIE_KEYWORDS,
  MOVIE_ACTORS,
  MOVIE_DIRECTORS,
  MOVIE_PRODUCTION_COMPANIES,
} from "../src/table-names";
import { Database } from "../src/database";
import { tableInfo } from "../src/queries/table-info";
import { minutes, Log } from "./utils";

const CREATE_MOVIE_GENRES_TABLE = `CREATE TABLE ${MOVIE_GENRES} (
movie_id INTEGER NOT NULL,
genre_id INTEGER NOT NULL,
PRIMARY KEY(movie_id, genre_id)
FOREIGN KEY(movie_id) REFERENCES movies(id)
FOREIGN KEY(genre_id) REFERENCES genres(id)
ON DELETE CASCADE
)`;

const CREATE_MOVIE_ACTORS_TABLE = `CREATE TABLE ${MOVIE_ACTORS} (
movie_id INTEGER NOT NULL,
actor_id INTEGER NOT NULL,
PRIMARY KEY(movie_id, actor_id)
FOREIGN KEY(movie_id) REFERENCES movies(id)
FOREIGN KEY(actor_id) REFERENCES actors(id)
ON DELETE CASCADE
)`;

const CREATE_MOVIE_DIRECTORS_TABLE = `CREATE TABLE ${MOVIE_DIRECTORS} (
movie_id INTEGER NOT NULL,
director_id INTEGER NOT NULL,
PRIMARY KEY(movie_id, director_id) 
FOREIGN KEY(movie_id) REFERENCES movies(id)
FOREIGN KEY(director_id) REFERENCES directors(id)
ON DELETE CASCADE
)`;

const CREATE_MOVIE_KEYWORDS_TABLE = `CREATE TABLE ${MOVIE_KEYWORDS} (
movie_id INTEGER NOT NULL,
keyword_id INTEGER NOT NULL,
PRIMARY KEY(movie_id, keyword_id) 
FOREIGN KEY(movie_id) REFERENCES movies(id)
FOREIGN KEY(keyword_id) REFERENCES keywords(id)
ON DELETE CASCADE
)`;

const CREATE_MOVIE_PRODUCTION_COMPANIES_TABLE = `CREATE TABLE ${MOVIE_PRODUCTION_COMPANIES} (
movie_id INTEGER NOT NULL,
company_id INTEGER NOT NULL,
PRIMARY KEY(movie_id, company_id) 
FOREIGN KEY(movie_id) REFERENCES movies(id)
FOREIGN KEY(company_id) REFERENCES production_companies(id)
ON DELETE CASCADE
)`;

describe("Insert Combined Data", () => {
  let db: Database;

  beforeAll(async () => {
    db = await Database.fromExisting("03", "04");
  }, minutes(3));

  const selectTableInfo = async (table: string) => {
    return db.selectMultipleRows(tableInfo(table));
  };

  it("should create tables to manage relationships", async (done) => {
    const queries = [
      CREATE_MOVIE_GENRES_TABLE,
      CREATE_MOVIE_ACTORS_TABLE,
      CREATE_MOVIE_DIRECTORS_TABLE,
      CREATE_MOVIE_KEYWORDS_TABLE,
      CREATE_MOVIE_PRODUCTION_COMPANIES_TABLE,
    ];

    for (const query of queries) {
      await db.createTable(query);
    }

    for (const table of ALL_RELATIONSHIP_TABLES) {
      const exists = await db.tableExists(table);
      Log.info(`Checking '${table}'`);
      expect(exists).toBeTruthy();
    }

    done();
  });

  it("should have correct columns and column types", async (done) => {
    const mapFn = (row: any) => {
      return {
        name: row.name,
        type: row.type,
      };
    };

    const genres = (await selectTableInfo(MOVIE_GENRES)).map(mapFn);
    expect(genres).toEqual([
      { name: "movie_id", type: "INTEGER" },
      { name: "genre_id", type: "INTEGER" },
    ]);

    const actors = (await selectTableInfo(MOVIE_ACTORS)).map(mapFn);
    expect(actors).toEqual([
      { name: "movie_id", type: "INTEGER" },
      { name: "actor_id", type: "INTEGER" },
    ]);

    const directors = (await selectTableInfo(MOVIE_DIRECTORS)).map(mapFn);
    expect(directors).toEqual([
      { name: "movie_id", type: "INTEGER" },
      { name: "director_id", type: "INTEGER" },
    ]);

    const keywords = (await selectTableInfo(MOVIE_KEYWORDS)).map(mapFn);
    expect(keywords).toEqual([
      { name: "movie_id", type: "INTEGER" },
      { name: "keyword_id", type: "INTEGER" },
    ]);

    const productionCompanies = (await selectTableInfo(
      MOVIE_PRODUCTION_COMPANIES
    )).map(mapFn);
    expect(productionCompanies).toEqual([
      { name: "movie_id", type: "INTEGER" },
      { name: "company_id", type: "INTEGER" },
    ]);

    done();
  });

  it("should have primary keys", async (done) => {
    const mapFn = (row: any) => {
      return {
        name: row.name,
        primaryKey: row.pk > 0,
      };
    };

    const genres = (await selectTableInfo(MOVIE_GENRES)).map(mapFn);
    expect(genres).toEqual([
      { name: "movie_id", primaryKey: true },
      { name: "genre_id", primaryKey: true },
    ]);

    const actors = (await selectTableInfo(MOVIE_ACTORS)).map(mapFn);
    expect(actors).toEqual([
      { name: "movie_id", primaryKey: true },
      { name: "actor_id", primaryKey: true },
    ]);

    const directors = (await selectTableInfo(MOVIE_DIRECTORS)).map(mapFn);
    expect(directors).toEqual([
      { name: "movie_id", primaryKey: true },
      { name: "director_id", primaryKey: true },
    ]);

    const keywords = (await selectTableInfo(MOVIE_KEYWORDS)).map(mapFn);
    expect(keywords).toEqual([
      { name: "movie_id", primaryKey: true },
      { name: "keyword_id", primaryKey: true },
    ]);

    const productionCompanies = (await selectTableInfo(
      MOVIE_PRODUCTION_COMPANIES
    )).map(mapFn);
    expect(productionCompanies).toEqual([
      { name: "movie_id", primaryKey: true },
      { name: "company_id", primaryKey: true },
    ]);

    done();
  });

  it("should have not null constraints", async (done) => {
    const mapFn = (row: any) => {
      return {
        name: row.name,
        notNull: row.notnull === 1,
      };
    };

    const genres = (await selectTableInfo(MOVIE_GENRES)).map(mapFn);
    expect(genres).toEqual([
      { name: "movie_id", notNull: true },
      { name: "genre_id", notNull: true },
    ]);

    const actors = (await selectTableInfo(MOVIE_ACTORS)).map(mapFn);
    expect(actors).toEqual([
      { name: "movie_id", notNull: true },
      { name: "actor_id", notNull: true },
    ]);

    const directors = (await selectTableInfo(MOVIE_DIRECTORS)).map(mapFn);
    expect(directors).toEqual([
      { name: "movie_id", notNull: true },
      { name: "director_id", notNull: true },
    ]);

    const productionCompanies = (await selectTableInfo(
      MOVIE_PRODUCTION_COMPANIES
    )).map(mapFn);
    expect(productionCompanies).toEqual([
      { name: "movie_id", notNull: true },
      { name: "company_id", notNull: true },
    ]);

    const keywords = (await selectTableInfo(MOVIE_KEYWORDS)).map(mapFn);
    expect(keywords).toEqual([
      { name: "movie_id", notNull: true },
      { name: "keyword_id", notNull: true },
    ]);

    done();
  });
});
