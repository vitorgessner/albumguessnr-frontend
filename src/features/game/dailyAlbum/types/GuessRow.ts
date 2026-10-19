import type { AlbumCandidate } from "./AlbumCandidate";
import type { CellStatus } from "./CellStatus";
import type { Direction } from "./Direction";

export interface GuessRow {
    album: AlbumCandidate;
    year: { value: string | null, status: CellStatus; direction: Direction };
    artists: { status: CellStatus };
    genres: { status: CellStatus, values: string[] };
    rymRating: { status: CellStatus; direction: Direction };
    rymRanking: { status: CellStatus; direction: Direction };
    descriptors: { status: CellStatus, values: string[] };
}