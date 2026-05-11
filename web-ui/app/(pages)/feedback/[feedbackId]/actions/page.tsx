import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import ActionsSection from '@/components/actions/actions-section';
import { Separator } from '@/components/ui/separator';
import { getFeedbackById } from '@/lib/api';

export default async function ActionPage({
    params,
}: Readonly<{
    params: Promise<{ feedbackId: string }>;
}>) {
    const { feedbackId } = await params;

    const feedback = await getFeedbackById(feedbackId);

    return (
        <div className="w-full p-6">
            <Card className="mx-auto w-full">
                <CardHeader className="my-2">
                    <CardTitle>Actions Dashboard</CardTitle>
                    <CardDescription>
                        All information regarding the actions for:{' '}
                        <strong>{feedback.data?.title}</strong>
                    </CardDescription>
                </CardHeader>
                <Separator className="my-6" />
                <CardContent>
                    <ActionsSection feedbackId={feedbackId} />
                </CardContent>
            </Card>
        </div>
    );
}
