export interface ChatDataType {
    isGroupChat: boolean;
    users: {
        username: string;
        name: string;
    }[];
    _id: string;
    chatName: string;
}