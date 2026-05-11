'use client';

import { Action, ActionPayload } from '@/app/types/commonTypes';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog';
import { Field, FieldGroup, FieldLabel } from '../ui/field';
import { FormEvent, useEffect, useState } from 'react';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Spinner } from '../ui/spinner';
import { Textarea } from '../ui/textarea';
import { updateAction } from '@/lib/api';

export function ActionsEditDialog({
    open,
    onOpenChange,
    feedbackId,
    currAction,
    setCurrAction,
    onRefresh,
}: Readonly<{
    open: boolean;
    onOpenChange: (open: boolean) => void;
    feedbackId: string;
    currAction: Action;
    setCurrAction: (a: Action) => void;
    onRefresh: () => void;
}>) {
    const [updatedActionFields, setUpdatedActionFields] =
        useState<ActionPayload>({
            title: currAction.title,
            description: currAction.description,
        });
    const [loading, setLoading] = useState<boolean>(false);

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
    }, [open, onOpenChange]);

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
            onOpenChange(false);
            onRefresh();
        } catch (e) {
            console.error(e);
            setCurrAction(previousAction);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
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
