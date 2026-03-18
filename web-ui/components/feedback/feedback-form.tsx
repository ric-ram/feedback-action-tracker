'use client';

import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from '../ui/field';
import { FormEvent, useState } from 'react';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Spinner } from '../ui/spinner';
import { Textarea } from '../ui/textarea';
import { createFeedback } from '@/lib/api';

export default function FeedBackForm(
    props: Readonly<{
        handleCreate: () => void;
    }>
) {
    const [title, setTitle] = useState<string>('');
    const [source, setSource] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    const [submitMessage, setSubmitMessage] = useState<string>('');

    const cleanState = () => {
        setTitle('');
        setSource('');
        setDescription('');
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            const resp = await createFeedback({
                title,
                source,
                description,
            });

            if (resp.success) {
                setSuccess(true);
                setSubmitMessage('New feedback submitted successfully!');
                cleanState();
                props.handleCreate();
            } else {
                setSuccess(false);
                setSubmitMessage('Error submitting feedback!');
            }
        } catch (e) {
            console.log(e);
            setSuccess(false);
            setSubmitMessage('Error submitting feedback!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <FieldGroup>
                <FieldSet>
                    <FieldLegend>Feedback Form</FieldLegend>
                    <FieldDescription>
                        Please provide your feedback, it will turn into an
                        action.
                    </FieldDescription>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="title">Title</FieldLabel>
                            <Input
                                id="title"
                                name="title"
                                placeholder="Great product"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="source">Source</FieldLabel>
                            <Input
                                id="source"
                                name="source"
                                placeholder="Email"
                                value={source}
                                onChange={(e) => setSource(e.target.value)}
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="description">
                                Description
                            </FieldLabel>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="Please let us know more"
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
