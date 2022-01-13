const mock = {
    data: {

        id: -12,
        name: 'yellow',
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

const { getPokemonsByColor } = require("../api-call");


jest.mock('axios', () => {
    return jest.fn((config) => (mock));
})

const axios = require("axios");

describe('api-call', () => {
    describe(getPokemonsByColor.name, () => {
        it("happy path", async () => {
            const result = await getPokemonsByColor()

            expect(result).toEqual(mock);
        })

        it("sad path", async () => {
            axios.mockRejectedValueOnce(new Error("Http request failed"));
            const error = await getPokemonsByColor().catch(e => e);
            expect(error.message).toBe("Http request failed");
        })
    })
})