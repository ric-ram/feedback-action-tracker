import {
    Action,
    ActionPayload,
    Feedback,
    FeedbackPayload,
    ResponsePayload,
} from '@/app/types/commonTypes';

import { ActionsFormSchema } from '@/components/actions/definitions';
import { FeedbackFormSchema } from '@/components/feedback/definitions';

export async function getFeedback(): Promise<Feedback[]> {
    try {
        const resp = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_FEEDBACK_ENDPOINT}`
        );

        if (!resp.ok) {
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

export async function getFeedbackById(
    feedbackId: string
): Promise<ResponsePayload<Feedback>> {
    try {
        const resp = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_FEEDBACK_ENDPOINT}/${feedbackId}`
        );

        if (!resp.ok) {
            return {
                success: false,
                message: resp.statusText,
                fieldErrors: resp.status,
            };
        }

        const feedback = await resp.json();

        return {
            success: true,
            message: `Feedback with id ${feedbackId} successfully retrieved!`,
            data: feedback,
        };
    } catch (e) {
        return {
            success: false,
            message: `Retrieving feedback with id: ${feedbackId} failed!`,
            fieldErrors: e,
        };
    }
}

export async function getActionsForFeedback(
    feedbackId: string
): Promise<Action[]> {
    try {
        const resp = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_FEEDBACK_ENDPOINT}/${feedbackId}/actions`
        );

        if (!resp.ok) {
            return [];
        }

        const actions = await resp.json();

        return actions;
    } catch (e) {
        console.log(e);
        return [];
    }
}

export async function createActionForFeedback(
    payload: ActionPayload,
    feedbackId: string
): Promise<ResponsePayload<Action>> {
    const validPayload = ActionsFormSchema.safeParse({
        title: payload.title,
        description: payload.description,
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
            `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_FEEDBACK_ENDPOINT}/${feedbackId}/actions`,
            {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(validPayload.data),
            }
        );

        if (!resp.ok) {
            return {
                success: false,
                message: `Failed to create action for feedback ${feedbackId}`,
                fieldErrors: resp.status,
            };
        }

        const data: Action = await resp.json();
        return {
            success: true,
            data: data,
            message: 'Action submitted successfully',
        };
    } catch (e) {
        console.log(e);
        return {
            success: false,
            message: `Submitting new action for feedback ${feedbackId} failed!`,
            fieldErrors: e,
        };
    }
}

export async function updateActionStatus(
    feedbackId: string,
    actionId: string,
    newStatus: string
): Promise<void> {
    const resp = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_FEEDBACK_ENDPOINT}/${feedbackId}/actions/${actionId}/status`,
        {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus }),
        }
    );

    if (!resp.ok) {
        const message = await resp.json();
        throw new Error(message || 'Failed to update action status');
    }

    return await resp.json();
}
