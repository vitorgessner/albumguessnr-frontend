import type { Album } from "../types/albumTypes";

const shuffle = (arr: Array<Album>) => {
    let currentIndex = arr.length;

    while (currentIndex !== 0) {
        const randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];
    }
}

export default shuffle;