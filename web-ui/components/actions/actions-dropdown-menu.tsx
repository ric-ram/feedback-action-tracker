'use client';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';

import { Action } from '@/app/types/commonTypes';
import { ActionsDeleteDialog } from './actions-delete-dialog';
import { ActionsEditDialog } from './actions-edit-dialog';
import { Button } from '../ui/button';
import { MoreHorizontalIcon } from 'lucide-react';
import { useState } from 'react';

export default function ActionsDropdownMenu({
    feedbackId,
    action,
    onRefresh,
}: Readonly<{
    feedbackId: string;
    action: Action;
    onRefresh: () => void;
}>) {
    const [currAction, setCurrAction] = useState<Action>(action);
    const [showEdit, setShowEdit] = useState<boolean>(false);
    const [showDelete, setShowDelete] = useState<boolean>(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 cursor-pointer"
                    >
                        <MoreHorizontalIcon />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem
                        className="cursor-pointer"
                        onSelect={() => setShowEdit(true)}
                    >
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled>Duplicate</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        variant="destructive"
                        className="cursor-pointer"
                        onSelect={() => setShowDelete(true)}
                    >
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <ActionsEditDialog
                open={showEdit}
                onOpenChange={setShowEdit}
                feedbackId={feedbackId}
                currAction={currAction}
                setCurrAction={setCurrAction}
                onRefresh={onRefresh}
            />

            <ActionsDeleteDialog
                open={showDelete}
                onOpenChange={setShowDelete}
                feedbackId={feedbackId}
                currAction={currAction}
                onRefresh={onRefresh}
            />
        </>
    );
}
