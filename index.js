import { parseEntries } from "./src/scripts/parser.js";
import { findFavs, fillFavs } from "./src/scripts/crawler";

function foodLogger(entries){
    const entries = parseEntries(entries);
    const elements = findFavs(entries);
    fillFavs(elements);
}
