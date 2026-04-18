'use client';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';

import { updateActionStatus } from '@/lib/api';
import { useState } from 'react';

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
            <SelectTrigger className="w-35 cursor-pointer">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="TODO" className="cursor-pointer">
                    Todo
                </SelectItem>
                <SelectItem value="IN_PROGRESS" className="cursor-pointer">
                    In Progress
                </SelectItem>
                <SelectItem value="DONE" className="cursor-pointer">
                    Done
                </SelectItem>
            </SelectContent>
        </Select>
    );
}
