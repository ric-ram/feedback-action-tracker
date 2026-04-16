type EntryData = {
    id: string;
    createdAt: string;
    updatedAt: string;
};

export interface Feedback extends EntryData {
    title: string;
    description: string;
    source: string;
}

export type FeedbackPayload = {
    title: string;
    description?: string;
    source?: string;
};

export type ResponsePayload<T> = {
    success: boolean;
    message: string;
    data?: T;
    fieldErrors?: unknown;
};

export interface Action extends EntryData {
    title: string;
    description: string;
}

export type ActionPayload = {
    title: string;
    description?: string;
};
