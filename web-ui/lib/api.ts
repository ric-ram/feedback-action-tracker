import {
    Feedback,
    FeedbackPayload,
    ResponsePayload,
} from '@/app/types/commonTypes';

import { FeedbackFormSchema } from '@/components/feedback/definitions';

export async function getFeedback(): Promise<Feedback[]> {
    try {
        const resp = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_FEEDBACK_ENDPOINT}`
        );

        if (!resp.ok) {
            console.log(resp.ok);
            return [];
        }
        const feedback = await resp.json();

        return feedback;
    } catch (e) {
        console.log(e);
        return [];
    }
}

export async function createFeedback(
    payload: FeedbackPayload
): Promise<ResponsePayload<Feedback>> {
    const validPayload = FeedbackFormSchema.safeParse({
        title: payload.title,
        description: payload.description,
        source: payload.source,
    });

    if (!validPayload.success) {
        return {
            success: false,
            message: validPayload.error.message,
            fieldErrors: validPayload.error,
        };
    }

    try {
        const resp = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_FEEDBACK_ENDPOINT}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(validPayload.data),
            }
        );

        if (!resp.ok) {
            return {
                success: false,
                message: 'Failed to create feedback',
                fieldErrors: resp.status,
            };
        }

        const data: Feedback = await resp.json();
        return {
            success: true,
            data: data,
            message: 'Feedback submitted successfully',
        };
    } catch (e) {
        console.log(e);
        return {
            success: false,
            message: 'Submitting new feedback failed!',
            fieldErrors: e,
        };
    }
}
