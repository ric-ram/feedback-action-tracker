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
        setLoading(true);
        const list = await getFeedback();
        setFeedbacks(list);
        setLoading(false);
    };

    const handleCreate = async () => {
        await loadFeedback();
    };

    useEffect(() => {
        loadFeedback();
    }, []);

    return (
        <div>
            <FeedBackForm handleCreate={handleCreate} />
            <Separator className="my-6" />
            <FeedbackTable data={feedbacks} loading={loading} />
        </div>
    );
}
