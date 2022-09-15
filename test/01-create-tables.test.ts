import { Database } from "../src/database";
import {
  ALL_TABLES,
  MOVIES,
  MOVIE_RATINGS,
  ACTORS,
  KEYWORDS,
  DIRECTORS,
  GENRES,
  PRODUCTION_COMPANIES,
} from "../src/table-names";
import { tableInfo, indexList } from "../src/queries/table-info";

const CREATE_MOVIES_TABLE = `CREATE TABLE ${MOVIES} (
  id INTEGER NOT NULL PRIMARY KEY,
  imdb_id TEXT NOT NULL,
  popularity REAL NOT NULL,
  budget REAL NOT NULL,
  budget_adjusted REAL NOT NULL,
  revenue REAL NOT NULL,
  revenue_adjusted REAL NOT NULL,
  original_title TEXT NOT NULL,
  homepage TEXT,
  tagline TEXT,
  overview TEXT NOT NULL,
  runtime INTEGER NOT NULL,
  release_date TEXT NOT NULL
)`;

const CREATE_MOVIE_RATINGS_TABLE = `CREATE TABLE ${MOVIE_RATINGS} (
  user_id INTEGER NOT NULL,
  movie_id INTEGER NOT NULL,
  rating REAL NOT NULL,
  time_created TEXT NOT NULL,
  PRIMARY KEY(user_id, movie_id)
  FOREIGN KEY(movie_id) REFERENCES movies(id)
  ON DELETE CASCADE
)`;

const CREATE_ACTORS_TABLE = `CREATE TABLE ${ACTORS} (
  id INTEGER NOT NULL PRIMARY KEY,
  full_name TEXT NOT NULL
)`;

const CREATE_KEYWORDS_TABLE = `CREATE TABLE ${KEYWORDS} (
  id INTEGER NOT NULL PRIMARY KEY,
  keyword TEXT NOT NULL
)`;

const CREATE_DIRECTORS_TABLE = `CREATE TABLE ${DIRECTORS} (
  id INTEGER NOT NULL PRIMARY KEY,
  full_name TEXT NOT NULL
)`;

const CREATE_GENRES_TABLE = `CREATE TABLE ${GENRES} (
  id INTEGER NOT NULL PRIMARY KEY,
  genre TEXT NOT NULL
)`;

const CREATE_PRODUCTION_COMPANIES_TABLE = `CREATE TABLE ${PRODUCTION_COMPANIES} (
  id INTEGER NOT NULL PRIMARY KEY,
  company_name TEXT NOT NULL
)`;

const CREATE_INDEX_MOVIES_RELEASE_DATE = `CREATE INDEX movies_release_date_idx 
ON ${MOVIES}(release_date)`;

const CREATE_INDEX_MOVIE_RATINGS_TIME_CREATED = `CREATE INDEX movie_ratings_time_created_idx 
ON ${MOVIE_RATINGS}(time_created)`;

const CREATE_UNIQUE_INDEX_MOVIES_IMDB_ID = `CREATE UNIQUE INDEX movies_imdb_id_unq_idx 
ON ${MOVIES}(imdb_id)`;

const CREATE_UNIQUE_INDEX_KEYWORDS_KEYWORD = `CREATE UNIQUE INDEX keywords_keyword_unq_idx 
ON ${KEYWORDS}(keyword)`;

const CREATE_UNIQUE_INDEX_GENRES_GENRE = `CREATE UNIQUE INDEX genres_genre_unq_idx 
ON ${GENRES}(genre)`;

const CREATE_UNIQUE_INDEX_PRODUCTION_COMPANIES_COMPANY_NAME = `CREATE UNIQUE INDEX production_companies_company_name_unq_idx 
ON ${PRODUCTION_COMPANIES}(company_name)`;

describe("Tables", () => {
  let db: Database;

  beforeAll(async () => (db = await Database.fromExisting("00", "01")));

  const selectTableInfo = async (table: string) => {
    return db.selectMultipleRows(tableInfo(table));
  };

  const selectIndexList = async (table: string) => {
    return db.selectMultipleRows(indexList(table));
  };

  it("should create tables", async (done) => {
    const queries = [
      CREATE_MOVIES_TABLE,
      CREATE_MOVIE_RATINGS_TABLE,
      CREATE_ACTORS_TABLE,
      CREATE_KEYWORDS_TABLE,
      CREATE_DIRECTORS_TABLE,
      CREATE_GENRES_TABLE,
      CREATE_PRODUCTION_COMPANIES_TABLE,
    ];

    for (const query of queries) {
      await db.createTable(query);
    }

    for (const table of ALL_TABLES) {
      const exists = await db.tableExists(table);
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

    const movies = (await selectTableInfo(MOVIES)).map(mapFn);
    expect(movies).toEqual([
      { name: "id", type: "INTEGER" },
      { name: "imdb_id", type: "TEXT" },
      { name: "popularity", type: "REAL" },
      { name: "budget", type: "REAL" },
      { name: "budget_adjusted", type: "REAL" },
      { name: "revenue", type: "REAL" },
      { name: "revenue_adjusted", type: "REAL" },
      { name: "original_title", type: "TEXT" },
      { name: "homepage", type: "TEXT" },
      { name: "tagline", type: "TEXT" },
      { name: "overview", type: "TEXT" },
      { name: "runtime", type: "INTEGER" },
      { name: "release_date", type: "TEXT" },
    ]);

    const movieRatings = (await selectTableInfo(MOVIE_RATINGS)).map(mapFn);
    expect(movieRatings).toEqual([
      { name: "user_id", type: "INTEGER" },
      { name: "movie_id", type: "INTEGER" },
      { name: "rating", type: "REAL" },
      { name: "time_created", type: "TEXT" },
    ]);

    const actors = (await selectTableInfo(ACTORS)).map(mapFn);
    expect(actors).toEqual([
      { name: "id", type: "INTEGER" },
      { name: "full_name", type: "TEXT" },
    ]);

    const keywords = (await selectTableInfo(KEYWORDS)).map(mapFn);
    expect(keywords).toEqual([
      { name: "id", type: "INTEGER" },
      { name: "keyword", type: "TEXT" },
    ]);

    const directors = (await selectTableInfo(DIRECTORS)).map(mapFn);
    expect(directors).toEqual([
      { name: "id", type: "INTEGER" },
      { name: "full_name", type: "TEXT" },
    ]);

    const genres = (await selectTableInfo(GENRES)).map(mapFn);
    expect(genres).toEqual([
      { name: "id", type: "INTEGER" },
      { name: "genre", type: "TEXT" },
    ]);

    const productionCompanies = (await selectTableInfo(
      PRODUCTION_COMPANIES
    )).map(mapFn);
    expect(productionCompanies).toEqual([
      { name: "id", type: "INTEGER" },
      { name: "company_name", type: "TEXT" },
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

    const movies = (await selectTableInfo(MOVIES)).map(mapFn);
    expect(movies).toEqual([
      { name: "id", primaryKey: true },
      { name: "imdb_id", primaryKey: false },
      { name: "popularity", primaryKey: false },
      { name: "budget", primaryKey: false },
      { name: "budget_adjusted", primaryKey: false },
      { name: "revenue", primaryKey: false },
      { name: "revenue_adjusted", primaryKey: false },
      { name: "original_title", primaryKey: false },
      { name: "homepage", primaryKey: false },
      { name: "tagline", primaryKey: false },
      { name: "overview", primaryKey: false },
      { name: "runtime", primaryKey: false },
      { name: "release_date", primaryKey: false },
    ]);

    const movieRatings = (await selectTableInfo(MOVIE_RATINGS)).map(mapFn);
    expect(movieRatings).toEqual([
      { name: "user_id", primaryKey: true },
      { name: "movie_id", primaryKey: true },
      { name: "rating", primaryKey: false },
      { name: "time_created", primaryKey: false },
    ]);

    const actors = (await selectTableInfo(ACTORS)).map(mapFn);
    expect(actors).toEqual([
      { name: "id", primaryKey: true },
      { name: "full_name", primaryKey: false },
    ]);

    const keywords = (await selectTableInfo(KEYWORDS)).map(mapFn);
    expect(keywords).toEqual([
      { name: "id", primaryKey: true },
      { name: "keyword", primaryKey: false },
    ]);

    const directors = (await selectTableInfo(DIRECTORS)).map(mapFn);
    expect(directors).toEqual([
      { name: "id", primaryKey: true },
      { name: "full_name", primaryKey: false },
    ]);

    const genres = (await selectTableInfo(GENRES)).map(mapFn);
    expect(genres).toEqual([
      { name: "id", primaryKey: true },
      { name: "genre", primaryKey: false },
    ]);

    const productionCompanies = (await selectTableInfo(
      PRODUCTION_COMPANIES
    )).map(mapFn);
    expect(productionCompanies).toEqual([
      { name: "id", primaryKey: true },
      { name: "company_name", primaryKey: false },
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

    const movies = (await selectTableInfo(MOVIES)).map(mapFn);
    expect(movies).toEqual([
      { name: "id", notNull: true },
      { name: "imdb_id", notNull: true },
      { name: "popularity", notNull: true },
      { name: "budget", notNull: true },
      { name: "budget_adjusted", notNull: true },
      { name: "revenue", notNull: true },
      { name: "revenue_adjusted", notNull: true },
      { name: "original_title", notNull: true },
      { name: "homepage", notNull: false },
      { name: "tagline", notNull: false },
      { name: "overview", notNull: true },
      { name: "runtime", notNull: true },
      { name: "release_date", notNull: true },
    ]);

    const movieRatings = (await selectTableInfo(MOVIE_RATINGS)).map(mapFn);
    expect(movieRatings).toEqual([
      { name: "user_id", notNull: true },
      { name: "movie_id", notNull: true },
      { name: "rating", notNull: true },
      { name: "time_created", notNull: true },
    ]);

    const actors = (await selectTableInfo(ACTORS)).map(mapFn);
    expect(actors).toEqual([
      { name: "id", notNull: true },
      { name: "full_name", notNull: true },
    ]);

    const keywords = (await selectTableInfo(KEYWORDS)).map(mapFn);
    expect(keywords).toEqual([
      { name: "id", notNull: true },
      { name: "keyword", notNull: true },
    ]);

    const directors = (await selectTableInfo(DIRECTORS)).map(mapFn);
    expect(directors).toEqual([
      { name: "id", notNull: true },
      { name: "full_name", notNull: true },
    ]);

    const genres = (await selectTableInfo(GENRES)).map(mapFn);
    expect(genres).toEqual([
      { name: "id", notNull: true },
      { name: "genre", notNull: true },
    ]);

    const productionCompanies = (await selectTableInfo(
      PRODUCTION_COMPANIES
    )).map(mapFn);
    expect(productionCompanies).toEqual([
      { name: "id", notNull: true },
      { name: "company_name", notNull: true },
    ]);

    done();
  });

  it("should have indices", async (done) => {
    const mapFn = (row: any) => {
      return {
        name: row.name,
        unique: row.unique === 1,
      };
    };

    await db.createIndex(CREATE_INDEX_MOVIES_RELEASE_DATE);

    const movies = (await selectIndexList(MOVIES)).map(mapFn);
    expect(movies).toEqual([
      {
        name: "movies_release_date_idx",
        unique: false,
      },
    ]);

    await db.createIndex(CREATE_INDEX_MOVIE_RATINGS_TIME_CREATED);

    const movieRatings = (await selectIndexList(MOVIE_RATINGS)).map(mapFn);
    expect(movieRatings).toEqual([
      { name: "movie_ratings_time_created_idx", unique: false },
      { name: "sqlite_autoindex_movie_ratings_1", unique: true },
    ]);

    done();
  });

  it("should have unique indices", async (done) => {
    const mapFn = (row: any) => {
      return {
        name: row.name,
        unique: row.unique === 1,
      };
    };

    const uniqueOnly = (row: any) => row.unique === 1;

    await db.createIndex(CREATE_UNIQUE_INDEX_MOVIES_IMDB_ID);

    const movies = (await selectIndexList(MOVIES))
      .filter(uniqueOnly)
      .map(mapFn);
    expect(movies).toEqual([
      {
        name: "movies_imdb_id_unq_idx",
        unique: true,
      },
    ]);

    await db.createIndex(CREATE_UNIQUE_INDEX_KEYWORDS_KEYWORD);

    const keywords = (await selectIndexList(KEYWORDS))
      .filter(uniqueOnly)
      .map(mapFn);
    expect(keywords).toEqual([
      {
        name: "keywords_keyword_unq_idx",
        unique: true,
      },
    ]);

    await db.createIndex(CREATE_UNIQUE_INDEX_GENRES_GENRE);

    const genres = (await selectIndexList(GENRES))
      .filter(uniqueOnly)
      .map(mapFn);
    expect(genres).toEqual([
      {
        name: "genres_genre_unq_idx",
        unique: true,
      },
    ]);

    await db.createIndex(CREATE_UNIQUE_INDEX_PRODUCTION_COMPANIES_COMPANY_NAME);

    const productionCompanies = (await selectIndexList(PRODUCTION_COMPANIES))
      .filter(uniqueOnly)
      .map(mapFn);
    expect(productionCompanies).toEqual([
      {
        name: "production_companies_company_name_unq_idx",
        unique: true,
      },
    ]);

    done();
  });
});
