export type FormResponse = {
    status: string;
    message: string;
}
export type FormResponseWithUsername = {
    status: string;
    message: string;
    username: string;
}

export type ErrorResponse = {
    status: string;
    name: string;
    message: string;
    statusCode: number;
}