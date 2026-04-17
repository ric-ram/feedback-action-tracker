import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import ActionForm from '@/components/actions/action-form';
import { Separator } from '@/components/ui/separator';

export default function ActionPage() {
    return (
        <div className="w-full p-6">
            <Card className="mx-auto w-full">
                <CardHeader className="my-2">
                    <CardTitle>Actions Dashboard</CardTitle>
                    <CardDescription>
                        All information regarding actions
                    </CardDescription>
                </CardHeader>
                <Separator className="my-6" />
                <CardContent>
                    <ActionForm />
                </CardContent>
            </Card>
        </div>
    );
}
