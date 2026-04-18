'use client';

import { FormEvent, useState } from 'react';
import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from '../ui/field';

import { createActionForFeedback } from '@/lib/api';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Spinner } from '../ui/spinner';
import { Textarea } from '../ui/textarea';

export default function ActionForm(
    props: Readonly<{
        feedbackId: string;
        handleCreate: () => void;
    }>
) {
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    const [submitMessage, setSubmitMessage] = useState<string>('');

    const cleanState = () => {
        setTitle('');
        setDescription('');
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            const resp = await createActionForFeedback(
                {
                    title,
                    description,
                },
                props.feedbackId
            );

            if (resp.success) {
                setSuccess(true);
                setSubmitMessage('New action submitted successfully!');
                cleanState();
                props.handleCreate();
            } else {
                setSuccess(false);
                setSubmitMessage('Error submitting feedback!');
            }
        } catch (e) {
            console.log(e);
            setSuccess(false);
            setSubmitMessage('Error submitting action¬');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <FieldGroup>
                <FieldSet>
                    <FieldLegend>Actions Form</FieldLegend>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="title">Title</FieldLabel>
                            <Input
                                id="title"
                                name="title"
                                placeholder="Do something..."
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
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
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </Field>
                    </FieldGroup>
                </FieldSet>
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
                            'Submit'
                        )}
                    </Button>
                    <p className={success ? 'text-green-500' : 'text-red-500'}>
                        {submitMessage}
                    </p>
                </Field>
            </FieldGroup>
        </form>
    );
}
