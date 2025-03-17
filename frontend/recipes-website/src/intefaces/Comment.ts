import {Owner} from "./Pots";

export interface Comment {
    _id: string;
    user: Owner;
    message: string;
    date: Date;
    postId: string;
}
