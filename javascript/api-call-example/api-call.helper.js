const { getPokemonsByColor } = require('./api-call');

async function helperToProcessPokemons(colorName = 'yellow') {
    const res = await getPokemonsByColor(colorName);

    const pokemons = res.data.names.map(pokemon => ({
        ...pokemon,
        nameContainsEnglishCharsOnly: /^[a-zA-Z]+$/.test(pokemon.name),
    }))

    return pokemons;
}

module.exports = {
    helperToProcessPokemons
}