import type { AlbumCandidate } from "./AlbumCandidate";
import type { CellStatus } from "./CellStatus";
import type { Direction } from "./Direction";

export interface GuessRow {
    album: AlbumCandidate;
    year: { status: CellStatus; direction: Direction };
    artists: { status: CellStatus };
    genres: { status: CellStatus };
    rymRating: { status: CellStatus; direction: Direction };
    rymRanking: { status: CellStatus; direction: Direction };
    descriptors: { status: CellStatus };
}