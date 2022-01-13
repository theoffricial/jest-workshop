const mock = {
    data: {
        names: [{
            "language": {
                "name": "ja-Hrkt",
                "url": "https://pokeapi.co/api/v2/language/1/"
            },
            "name": "黄色"
        },
        {
            "language": {
                "name": "fr",
                "url": "https://pokeapi.co/api/v2/language/5/"
            },
            "name": "Jaune"
        }]
    }
}

import { helperToProcessPokemons } from "../api-call.helper";
import { getPokemonsByColor } from "../api-call";
import { createMock } from "ts-jest-mock";

jest.mock('../api-call')


describe('api-call.helper', () => {
    const mockedGetPokemonsByColor = createMock(getPokemonsByColor);
    it("happy path", async () => {
        mockedGetPokemonsByColor.mockResolvedValueOnce(mock as any);

        const result = await helperToProcessPokemons();

        // const isEnglishLetterOnly = result.map(pokemon => pokemon.nameContainsEnglishCharsOnly);

        expect(result).toStrictEqual([{
            "language": {
                "name": "ja-Hrkt",
                "url": "https://pokeapi.co/api/v2/language/1/"
            },
            "name": "黄色",
            nameContainsEnglishCharsOnly: false
        }, {
            "language": {
                "name": "fr",
                "url": "https://pokeapi.co/api/v2/language/5/",
            },
            "name": "Jaune",
            "nameContainsEnglishCharsOnly": true,
        },])
    })

    it("sad path", async () => {
        mockedGetPokemonsByColor.mockRejectedValueOnce(new Error("Http request failed"));
        const error = await getPokemonsByColor().catch(e => e);
        expect(error.message).toBe("Http request failed");
    })
})