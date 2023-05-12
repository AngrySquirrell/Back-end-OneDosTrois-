import { color, type, value } from "../script/globalTypes.js";
import { cardAttributes } from "../script/globalVariables.js";

const { colors, types, typesWild, values } = cardAttributes;

export class Card {
    color: color;
    value: value;
    type: type;
    constructor() {
        if (Math.floor(Math.random() * 100) >= 7) {
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.type = types[Math.floor(Math.random() * types.length)];
            this.value =
                this.type !== "number"
                    ? -1
                    : values[Math.floor(Math.random() * values.length)];
        } else {
            this.color = "wild";
            this.value = -1;
            this.type = typesWild[Math.floor(Math.random() * types.length)];
        }
    }
}
