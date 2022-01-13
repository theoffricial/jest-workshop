import { getPokemonsByColor } from './api-call';

export async function helperToProcessPokemons(colorName = 'yellow') {
    const res = await getPokemonsByColor(colorName);

    const pokemons = res.data.names.map((pokemon: any) => ({
        ...pokemon,
        nameContainsEnglishCharsOnly: /^[a-zA-Z]+$/.test(pokemon.name),
    }))

    return pokemons;
}