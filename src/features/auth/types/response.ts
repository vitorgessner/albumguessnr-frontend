export type FormResponse = {
    status: string;
    message: string;
}

export type ErrorResponse = {
    status: string;
    name: string;
    message: string;
    statusCode: number;
}