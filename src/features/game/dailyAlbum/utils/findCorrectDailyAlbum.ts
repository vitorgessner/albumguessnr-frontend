import type { GuessRow } from "../types/GuessRow";
import { isDailyAlbum } from "./isDailyAlbum";

export const findCorrectDailyAlbum = (rows: GuessRow[]) => {
    return rows.find((row) => isDailyAlbum(row))?.album
}