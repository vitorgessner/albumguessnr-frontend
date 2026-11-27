import type { GuessRow } from "../types/GuessRow";
import { isDailyAlbum } from "./isDailyAlbum";

export const findCorrectDailyAlbum = (rows: GuessRow[]) => {
    const album = rows.find((row) => isDailyAlbum(row));
    return { album , cover_url: album?.cover_url}
}