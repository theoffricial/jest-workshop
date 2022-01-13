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

const { helperToProcessPokemons } = require("../api-call.helper");
const { getPokemonsByColor } = require("../api-call");

jest.mock('../api-call')


describe('api-call.helper', () => {
    it("happy path", async () => {
        getPokemonsByColor.mockResolvedValueOnce(mock);

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
        getPokemonsByColor.mockRejectedValueOnce(new Error("Http request failed"));
        const error = await getPokemonsByColor().catch(e => e);
        expect(error.message).toBe("Http request failed");
    })
})