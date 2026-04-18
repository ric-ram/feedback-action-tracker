'use client';

import { useEffect, useState } from 'react';

import { Action } from '@/app/types/commonTypes';
import { getActionsForFeedback } from '@/lib/api';
import { useParams } from 'next/navigation';
import { Separator } from '../ui/separator';
import ActionForm from './actions-form';
import ActionsTable from './actions-table';

export default function ActionsSection() {
    const params = useParams();
    const paramValue = params.feedbackId;
    const feedbackId: string = Array.isArray(paramValue)
        ? paramValue[0]
        : (paramValue ?? '');

    const [actions, setActions] = useState<Action[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const loadActions = async () => {
        try {
            setLoading(true);
            const resp = await getActionsForFeedback(feedbackId);
            setActions(resp);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        await loadActions();
    };

    useEffect(() => {
        const run = async () => {
            await loadActions();
        };

        run();
    }, []);

    return (
        <div>
            <ActionForm feedbackId={feedbackId} handleCreate={handleCreate} />
            <Separator className="my-6" />
            <ActionsTable data={actions} loading={loading} />
        </div>
    );
}
