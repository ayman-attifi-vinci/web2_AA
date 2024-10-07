import { Router } from "express";

import path from "node:path";
import { Film, NewFilm } from "../types";
import { parse } from "../utils/json";

const router = Router();

const jsonDbPath = path.join(__dirname, "/../data/films.json");

const defaultFilms: Film[] = [
    {
        id: 1,
        title: "Inception",
        director: "Christopher Nolan",
        duration: 148,
        budget: 160000000,
        description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
        imageUrl: "https://example.com/inception.jpg"
      },
      {
        id: 2,
        title: "The Shawshank Redemption",
        director: "Frank Darabont",
        duration: 142,
        budget: 25000000,
        description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
        imageUrl: "https://example.com/shawshank.jpg"
      },
      {
        id: 3,
        title: "Pulp Fiction",
        director: "Quentin Tarantino",
        duration: 154,
        budget: 8500000,
        description: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
        imageUrl: "https://example.com/pulpfiction.jpg"
      }
];

router.get("/error", (_req, _res, _next) => {
  throw new Error("This is an error");
  // equivalent of next(new Error("This is an error"));
});

router.get("/", (req, res) => {
    console.log("les films");
    if (req.query.order && typeof req.query.order !== "string") {
      return res.sendStatus(400);
    }
    let dureeMin = 0;
    const films = parse(jsonDbPath, defaultFilms);
    dureeMin = Number(req.query["minimum-duration"]);
    if (!req.query["minimum-duration"]) {
      // Cannot call req.query.budget-max as "-" is an operator
      return res.json(films);
    }
    const filteredMovies = films.filter((films) => {
      return films.duration >= dureeMin;
    });
    return res.json(filteredMovies);
  });

  router.get("/:id", (req, res) => {
    const films = parse(jsonDbPath, defaultFilms);
    const id = Number(req.params.id);
    const film = films.find((film) => film.id === id);
    if (!film) {
      return res.sendStatus(404);
    }
    return res.json(film);
  });

  router.post("/", (req, res) => {
      const body: unknown = req.body;
    if (
      !body ||
      typeof body !== "object" ||
      !("title" in body) ||
      !("director" in body) ||
      !("duration" in body) ||
      !("budget" in body) ||
      typeof body.title !== "string" ||
      typeof body.director !== "string" ||
      typeof body.duration !== "number" ||
      typeof body.budget !== "number" ||
      !body.title.trim() ||
      !body.director.trim() ||
      body.duration <= 0 ||
      body.budget <= 0
    ) {
      return res.sendStatus(400);
    }

    const { title, director, duration, budget , description , imageUrl } = body as NewFilm;

    const nextId =
      defaultFilms.reduce((maxId, film) => (film.id > maxId ? film.id : maxId), 0) +
      1;
  
    const NewFilm: Film = {
      id: nextId,
      title,
      director,
      duration,
      budget,
      description,
      imageUrl,
    };
  
    defaultFilms.push(NewFilm);
    return res.json(NewFilm);
  });
export default router;
