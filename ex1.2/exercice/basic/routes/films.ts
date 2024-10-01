import { Router } from "express";

import path from "node:path";
import { Film } from "../types";
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
  
    const orderByTitle =
      typeof req.query.order === "string" && req.query.order.includes("title")
        ? req.query.order
        : undefined;
  
    let orderedFilms: Film[] = [];
    const films = parse(jsonDbPath, defaultFilms);
    if (orderByTitle)
      orderedFilms = [...films].sort((a, b) => a.title.localeCompare(b.title));
  
    if (orderByTitle === "-title") orderedFilms = orderedFilms.reverse();
  
    return res.json(orderedFilms.length === 0 ? films : orderedFilms);
  });

router.get('/filmDetail',(req,res) =>{
  const idFilm=req.query.id
})
export default router;
