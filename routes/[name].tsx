import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { JSX } from "preact/jsx-runtime";
import { Drink } from "../model/drinks.ts";
import { cooktaildb } from "../utils/cooktail-db.ts";

export const handler: Handlers<Drink> = {
  async GET(req, ctx) {
    const drink = await cooktaildb.getDrink(ctx.params.name);

    if (!drink)
      return ctx.renderNotFound();
    return ctx.render(drink);
  },
};

export default function Home({ data: drink }: PageProps<Drink>) {
  const wordDefinition = wordDefinitons.at(Math.floor(Math.random() * wordDefinitons.length));
  function retrun(arg0: JSX.Element) {
    throw new Error("Function not implemented.");
  }

  return (
    <>
      <Head>
        <title>{drink.strDrink}</title>
        <link rel="stylesheet" href="book.css" />
      </Head>
      <div id="wrapper">
        <div id="container">

          <section class="open-book">
            <header>
              <h1>{drink.strCategory}</h1>
              <h6>{drink.strAlcoholic}</h6>
            </header>
            <article>
              <h2 class="chapter-title">{drink.strDrink}</h2>
              <p>
                {drink.strInstructions}
              </p>
              <div id="spacer"></div>
              <div id="spacer"></div>
              <div id="spacer"></div>
              <h2><s>Inhaltsstoffakkumulationen</s><sup>Zutaten</sup></h2>
              <div>
                {cooktaildb.getIngredients(drink).map((ingredient, index) => (
                  <li key={index}><mark class={markColors.at(Math.floor(Math.random() * markColors.length))}>{ingredient.strIngredient}</mark>    {ingredient.strMeasure}</li>
                ))}
              </div>
              {drink.strInstructions.length < 1200 ? <>
                <div id="spacer"></div><img id="img" src={drink.strDrinkThumb} alt="Drink" /><div id="spacer"></div><dl>
                  <dt><strong dangerouslySetInnerHTML={{ __html: wordDefinition?.word || "" }}></strong> -- <em>noun</em></dt>
                  <dd>
                    <div dangerouslySetInnerHTML={{ __html: wordDefinition?.definition || "" }}></div>
                  </dd>
                </dl>
              </> : null}
            </article>
            <footer>
              <ol id="page-numbers">
                <li>{drink.idDrink}</li>
                <li>{Number(drink.idDrink) + 1}</li>
              </ol>
            </footer>
          </section>

        </div>
      </div>
    </>
  );
}


const wordDefinitons = [
  { word: "cock&bull;tail", definition: "Any of various mixed drinks, consisting typically of gin, whiskey, rum, vodka, or brandy, with different admixtures, as vermouth, fruit juices, or flavorings, usually chilled and frequently sweetened." },
  { word: "drink", definition: `Something that your wives keep count of when you are at a party. For example, after a couple of hours laughing and joking with the men, your wife will slide up to you and say in a very accusing tone of voice "That's your fourth drink, you know".` },
  { word: "bev&bull;er&bull;age", definition: "Any liquid suitable for drinking." },
]

const markColors = [
  "",
  "pink",
  "blue",
  "green",
  "orange"
]