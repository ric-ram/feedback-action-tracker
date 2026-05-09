'use client';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
} from '../ui/alert-dialog';

import { Action } from '@/app/types/commonTypes';
import { Spinner } from '../ui/spinner';
import { Trash2Icon } from 'lucide-react';
import { deleteAction } from '@/lib/api';
import { useState } from 'react';

export function ActionsDeleteDialog({
    open,
    onOpenChange,
    feedbackId,
    currAction,
    onRefresh,
}: Readonly<{
    open: boolean;
    onOpenChange: (open: boolean) => void;
    feedbackId: string;
    currAction: Action;
    onRefresh: () => void;
}>) {
    const [loading, setLoading] = useState<boolean>(false);

    const handleDelete = async () => {
        setLoading(true);

        try {
            await deleteAction(feedbackId, currAction.id);
            onRefresh();
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent size="sm">
                <AlertDialogHeader>
                    <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                        <Trash2Icon />
                    </AlertDialogMedia>
                    <AlertDialogTitle>Delete action?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently delete this action.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="cursor-pointer">
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        variant="destructive"
                        className="cursor-pointer"
                        onClick={() => handleDelete()}
                    >
                        {loading ? (
                            <Spinner data-icon="inline-center" />
                        ) : (
                            'Delete'
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
