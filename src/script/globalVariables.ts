import { color, value, type } from "./globalTypes.js";

interface cardAttributes {
    colors: color[];
    values: value[];
    types: type[];
    typesWild: type[];
}

export const cardAttributes: cardAttributes = {
    colors: ["yellow", "red", "green", "blue"],
    values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    types: ["number", "skip", "reverse", "draw2"],
    typesWild: ["wild", "wild4"],
};
