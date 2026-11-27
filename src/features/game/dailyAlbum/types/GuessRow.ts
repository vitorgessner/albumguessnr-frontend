import type { CellStatus } from "./CellStatus";
import type { Direction } from "./Direction";

export interface GuessRow {
    id: string;
    title: string;
    cover_url: string;
    year: { value: string | null, status: CellStatus; direction: Direction };
    artists: { status: CellStatus, values: string[] };
    genres: { status: CellStatus, values: string[] };
    rymRating: { status: CellStatus; direction: Direction, value: number | null };
    rymRanking: { status: CellStatus; direction: Direction, value: number | null };
    descriptors: { status: CellStatus, values: string[] };
    count: number
}