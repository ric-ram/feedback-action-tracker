import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import FeedbackSection from '@/components/feedback/feedback-section';
import { Separator } from '@/components/ui/separator';

export default function FeedbackPage() {
    return (
        <div className="w-full p-6">
            <Card className="mx-auto w-full">
                <CardHeader className="my-2">
                    <CardTitle>Feedback Dashboard</CardTitle>
                    <CardDescription>
                        All information regarding feedback
                    </CardDescription>
                </CardHeader>
                <Separator className="my-6" />
                <CardContent>
                    <FeedbackSection />
                </CardContent>
            </Card>
        </div>
    );
}
