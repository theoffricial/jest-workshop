
import axios, { AxiosRequestConfig } from 'axios';

export async function getPokemonsByColor(colorName = 'yellow') {
    const config: AxiosRequestConfig<any> = {
        method: 'get',
        url: `https://pokeapi.co/api/v2/pokemon-color/${colorName}`,
        headers: {}
    };

    const result = await axios(config)

    return result;
}
