
const axios = require('axios');

async function getPokemonsByColor(colorName = 'yellow') {
    const config = {
        method: 'get',
        url: `https://pokeapi.co/api/v2/pokemon-color/${colorName}`,
        headers: {}
    };

    const result = await axios(config)

    return result;
}




module.exports = {
    getPokemonsByColor,
}