import { BasicDrink  } from "../model/drinks.ts";

async function callEndpoint(endpoint: string) {
    return fetch("https://www.thecocktaildb.com/api/json/v1/1"+endpoint)
        .then(res => res.json())
        .catch(err => console.log(err))
}

  

export const cooktaildb = {
    getList: async (): Promise<BasicDrink[]> => {
        return ((await callEndpoint("search.php?s")).drinks as BasicDrink[])
    }
}

console.log(await cooktaildb.getList());
