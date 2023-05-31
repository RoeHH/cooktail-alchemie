import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { HandlerContext } from "https://deno.land/x/fresh@1.1.6/server.ts";
import { Search } from "../components/Search.tsx";
import { Drink } from "../model/drinks.ts";
import { cooktaildb } from "../utils/cooktail-db.ts";

const alphabet = "abcdefghijklmnopqrstuvwxyz"
const splashImages = [
  "https://cdn.midjourney.com/bf9cb37e-4ca6-4bad-b9d1-0ad4bc90520e/0_3.webp",
  "https://cdn.midjourney.com/bf9cb37e-4ca6-4bad-b9d1-0ad4bc90520e/0_2.png",
  "https://cdn.midjourney.com/bf9cb37e-4ca6-4bad-b9d1-0ad4bc90520e/0_0.png",
  "https://cdn.midjourney.com/b6dae96a-ba5d-4f9f-b0d2-752acf0e3581/0_3.png",
  "https://cdn.midjourney.com/b6dae96a-ba5d-4f9f-b0d2-752acf0e3581/0_2.png",
  "https://cdn.midjourney.com/b6dae96a-ba5d-4f9f-b0d2-752acf0e3581/0_1.png",
  "https://cdn.midjourney.com/b283f460-0bb8-4800-9818-60325797d244/0_3.png",
  "https://cdn.midjourney.com/b283f460-0bb8-4800-9818-60325797d244/0_1.png"
]

interface Data {
  drinks: Drink[] | null;
  letter: string;
  query: string;
  formatedQuery: string;
}

export const handler: Handlers<Data> = {
  async GET(req: Request, ctx: HandlerContext) {
    const url = new URL(req.url);
    const query = url.searchParams.get("q") || "";
    const letter = getLetter(query)
    const drinks = query ? await cooktaildb.search(query) : await cooktaildb.search(letter);
    if(drinks?.length === 1) {
      return new Response("", {
        status: 307,
        headers: { Location: "/" + drinks[0].idDrink },
      });
    }
    return ctx.render({ drinks, letter, query: query || "", formatedQuery: query.split(" ").join("") || ""});
  },
};

export default function Home({ data: { drinks, letter, query, formatedQuery }, }: PageProps<Data>) {
  drinks = drinks ? drinks : ["Not Found", "Whut", "Huh?", "Where", "Get Help", "What?"].map((d) => ({ strDrink: d, idDrink: "random" } as Drink))
 
  return (
    <>
      <Head>
        <title>Cocktail Alchemie</title>
        <link rel="stylesheet" href="book.css" />
      </Head>
      <div id="wrapper">
        <div id="container">
          <section class="open-book">
            <header>
              <h1></h1>
              <h6><Search q={query} /></h6>
            </header>
            <article>
              <div>
                <h2 class="chapter-title">Cocktail Alchemie</h2>
                <img id="splashImg" src={splashImages.at(Math.floor(Math.random() * splashImages.length))} alt="Spalsh Image" />
              </div>
              <div id="page2">
                <div class="alphabet">
                  {formatedQuery.length > 7 ? 
                    <b><a href={`/?q=${query}`}>{query}</a></b>
                  : alphabet.split("").map((l) => 
                    letter.toLocaleLowerCase() === l ? 
                    query !== "" ? (                    
                      <b><a href={`/?q=${l}`}>{formatedQuery}</a></b>
                    ) : (
                      <b><a href={`/?q=${l}`}>{l}</a></b>
                    ) : (
                      <a href={`/?q=${l}`}>{l}</a>
                  ))}
                </div>
                <ul>
                  {drinks === null ? "Not Found" : drinks.map((drink, index) => (
                    <li key={index}><a href={`/${drink.idDrink}`}>{drink.strDrink}</a></li>)
                  )}
              </ul>
              </div>
            </article>
            <footer>
                <p>1</p>
                <p>2</p>
            </footer>
          </section>
        </div>
      </div>
    </>
  );
}


function getLetter(query: string) {
  if(query === "") return getRandomLetter()
  if(query.length === 1) return query
  const q = (query.match(/[a-zA-Z]/g) || getRandomLetter()).at(0) || getRandomLetter()   
  return q
}

function getRandomLetter() {
  return alphabet[Math.floor(Math.random() * alphabet.length)]
}