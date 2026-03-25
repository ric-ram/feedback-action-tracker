'use client';

import { useEffect, useState } from 'react';

import FeedBackForm from './feedback-form';
import { Feedback } from '@/app/types/commonTypes';
import FeedbackTable from './feedback-table';
import { Separator } from '../ui/separator';
import { getFeedback } from '@/lib/api';

export default function FeedbackSection() {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const loadFeedback = async () => {
        try {
            setLoading(true);
            const response = await getFeedback();
            setFeedbacks(response);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        await loadFeedback();
    };

    useEffect(() => {
        const run = async () => {
            await loadFeedback();
        };

        run();
    }, []);

    return (
        <div>
            <FeedBackForm handleCreate={handleCreate} />
            <Separator className="my-6" />
            <FeedbackTable data={feedbacks} loading={loading} />
        </div>
    );
}
