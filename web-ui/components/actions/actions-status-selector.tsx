'use client';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';

import { cn } from '@/lib/utils';
import { updateActionStatus } from '@/lib/api';
import { useState } from 'react';

const statusConfig = {
    TODO: {
        trigger: 'border-blue-500 text-blue-500 focus:ring-blue-200',
        icon: 'text-blue-500',
        content: 'border-blue-500',
        item: 'cursor-pointer focus:!accent-blue-500 focus:border focus:border-blue-500 focus:text-blue-500',
    },
    IN_PROGRESS: {
        trigger: 'border-amber-500 text-amber-500 focus:ring-amber-200',
        icon: 'text-amber-500',
        content: 'border-amber-500',
        item: 'cursor-pointer focus:border focus:border-amber-500',
    },
    DONE: {
        trigger: 'border-emerald-500 text-emerald-500 focus:ring-emerald-200',
        icon: 'text-emerald-500',
        content: 'border-emerald-500',
        item: 'cursor-pointer focus:border focus:border-emerald-500',
    },
};

export default function StatusSelector({
    feedbackId,
    actionId,
    currentStatus,
}: Readonly<{
    feedbackId: string;
    actionId: string;
    currentStatus: string | undefined;
}>) {
    const [status, setStatus] = useState(currentStatus);
    const [loading, setLoading] = useState<boolean>(false);

    const currentStyle =
        statusConfig[status as keyof typeof statusConfig] || statusConfig.TODO;

    const handleChange = async (newStatus: string) => {
        const previousStatus = status;

        setStatus(newStatus);
        setLoading(true);

        try {
            await updateActionStatus(feedbackId, actionId, newStatus);
        } catch (e) {
            setStatus(previousStatus);
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Select value={status} onValueChange={handleChange} disabled={loading}>
            <SelectTrigger
                className={cn(
                    'focus:text-accent- w-35 cursor-pointer',
                    currentStyle.trigger
                )}
                iconClassName={currentStyle.icon}
            >
                <SelectValue />
            </SelectTrigger>
            <SelectContent className={currentStyle.content}>
                <SelectItem value="TODO" className={statusConfig.TODO.item}>
                    Todo
                </SelectItem>
                <SelectItem
                    value="IN_PROGRESS"
                    className={statusConfig.IN_PROGRESS.item}
                >
                    In Progress
                </SelectItem>
                <SelectItem value="DONE" className={statusConfig.DONE.item}>
                    Done
                </SelectItem>
            </SelectContent>
        </Select>
    );
}
