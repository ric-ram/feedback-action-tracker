'use client';

import { useCallback, useEffect, useState } from 'react';

import { Action } from '@/app/types/commonTypes';
import ActionForm from './actions-form';
import ActionsTable from './actions-table';
import { Separator } from '../ui/separator';
import { getActionsForFeedback } from '@/lib/api';

export default function ActionsSection(
    props: Readonly<{
        feedbackId: string;
    }>
) {
    const [actions, setActions] = useState<Action[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const loadActions = useCallback(async () => {
        try {
            setLoading(true);
            const resp = await getActionsForFeedback(props.feedbackId);
            setActions(resp);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }, [props.feedbackId]);

    const refreshActions = async () => {
        await loadActions();
    };

    useEffect(() => {
        loadActions();
    }, [loadActions]);

    return (
        <div>
            <ActionForm
                feedbackId={props.feedbackId}
                onRefresh={refreshActions}
            />
            <Separator className="my-6" />
            <ActionsTable
                feedbackId={props.feedbackId}
                data={actions}
                loading={loading}
                onRefresh={refreshActions}
            />
        </div>
    );
}
