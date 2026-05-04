import type { IUserWithUsername } from "@/shared/types/user";

export type FormResponse = {
    status: string;
    message: string;
}
export type FormResponseWithUser = {
    status: string;
    message: string;
    user: IUserWithUsername;
}

export type ErrorResponse = {
    status: string;
    name: string;
    message: string;
    statusCode: number;
}