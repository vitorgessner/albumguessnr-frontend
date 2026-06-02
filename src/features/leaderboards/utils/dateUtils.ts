export const getStartOfWeek = (date: Date = new Date()) => {
    const dayOfWeek = date.getDay();
    const year = date.getFullYear();
    const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();

    return new Date(
        new Date(`${year}-${month}-${day}T00:00:00`).setDate(date.getDate() - dayOfWeek)
    );
};

export const getEndOfWeek = (date: Date = new Date()) => {
    const dayOfWeek = date.getDay();
    const year = date.getFullYear();
    const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();

    return new Date(
        new Date(`${year}-${month}-${day}T00:00:00`).setDate(date.getDate() + (6 - dayOfWeek))
    );
};