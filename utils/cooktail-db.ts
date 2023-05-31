import { Drink } from "../model/drinks.ts";

async function callEndpoint(endpoint: string) {    
    return await fetch("https://www.thecocktaildb.com/api/json/v1/1/"+endpoint)
        .then(res => res.json())
        .catch(err => console.log(err))
}

  

export const cooktaildb = {
    getList: async (): Promise<Drink[]> => {
        return (await callEndpoint("search.php?s"))?.drinks as Drink[]
    },
    getDrink: async (id: string): Promise<Drink> => {
        if(id === "random") return await cooktaildb.getRandomDrink()
        return (await callEndpoint("lookup.php?i="+id))?.drinks[0] as Drink
    },
    getRandomDrink: async (): Promise<Drink> => {
        return (await callEndpoint("random.php"))?.drinks[0] as Drink
    },
    getIngredients: (drink: Drink): { strIngredient: string | null; strMeasure: string | null }[] => {
        const ingredients: { strIngredient: string | null; strMeasure: string | null }[] = [];

        for (let i = 1; i <= 15; i++) {
          const ingredientKey = `strIngredient${i}`;
          const measureKey = `strMeasure${i}`;
      
          if (drink[ingredientKey] || drink[measureKey]) {
            ingredients.push({
              strIngredient: drink[ingredientKey],
              strMeasure: drink[measureKey]
            });
          }
        }
      
        return ingredients;
    },
    search: async (query: string): Promise<Drink[]> => {
      if(query === "") return await cooktaildb.getList()
      if(query.length === 1) return (await callEndpoint("search.php?f="+query))?.drinks as Drink[]
      return (await callEndpoint("search.php?s="+query))?.drinks as Drink[]
    }
}
