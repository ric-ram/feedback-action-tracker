'use client';

import { Action, ActionPayload } from '@/app/types/commonTypes';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Field, FieldGroup, FieldLabel } from '../ui/field';
import { FormEvent, useEffect, useState } from 'react';
import { deleteAction, updateAction } from '@/lib/api';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { MoreHorizontalIcon } from 'lucide-react';
import { Spinner } from '../ui/spinner';
import { Textarea } from '../ui/textarea';

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
    const [updatedActionFields, setUpdatedActionFields] =
        useState<ActionPayload>({
            title: currAction.title,
            description: currAction.description,
        });
    const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);

    const reset = () => {
        setUpdatedActionFields({
            title: currAction.title,
            description: currAction.description,
        });
    };

    useEffect(() => {
        if (!open) {
            reset();
        }
    }, [open, setOpen]);

    const handleEdit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const previousAction = currAction;

        setCurrAction({
            ...currAction,
            title: updatedActionFields.title,
            description: updatedActionFields.description,
        });
        setLoading(true);

        try {
            await updateAction(feedbackId, currAction.id, updatedActionFields);
            setOpen(false);
            onRefresh();
        } catch (e) {
            console.error(e);
            setCurrAction(previousAction);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (e: Event) => {
        e.preventDefault();
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
        <Dialog open={open} onOpenChange={setOpen}>
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
                    <DialogTrigger asChild>
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onSelect={(e) => e.preventDefault()}
                        >
                            Edit
                        </DropdownMenuItem>
                    </DialogTrigger>
                    <DropdownMenuItem disabled>Duplicate</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        variant="destructive"
                        className="cursor-pointer"
                        onSelect={(e) => handleDelete(e)}
                    >
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Action</DialogTitle>
                    <DialogDescription>
                        Make changes to the select action here. Click save when
                        you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleEdit}>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="title">Title</FieldLabel>
                            <Input
                                id="title"
                                name="title"
                                placeholder="Do something..."
                                value={updatedActionFields.title}
                                onChange={(e) =>
                                    setUpdatedActionFields({
                                        ...updatedActionFields,
                                        title: e.target.value,
                                    })
                                }
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="description">
                                Description
                            </FieldLabel>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="What to do..."
                                className="resize-none"
                                value={updatedActionFields.description}
                                onChange={(e) =>
                                    setUpdatedActionFields({
                                        ...updatedActionFields,
                                        description: e.target.value,
                                    })
                                }
                            />
                        </Field>
                        <Field orientation="horizontal">
                            <Button
                                type="submit"
                                className="cursor-pointer"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Spinner data-icon="inline-start" />
                                        Submitting...
                                    </>
                                ) : (
                                    'Save'
                                )}
                            </Button>
                        </Field>
                    </FieldGroup>
                </form>
            </DialogContent>
        </Dialog>
    );
}
