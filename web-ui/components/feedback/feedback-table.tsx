import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../ui/table';

import { Feedback } from '@/app/types/commonTypes';
import { Spinner } from '../ui/spinner';

export default function FeedbackTable(
    props: Readonly<{ data: Feedback[]; loading: boolean }>
) {
    return (
        <Table>
            <TableCaption>A list of all existing feedback</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Submit Date</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {props.loading ? (
                    <TableRow>
                        <TableCell colSpan={4} className="text-center">
                            <Spinner className="size-8" />
                        </TableCell>
                    </TableRow>
                ) : props.data.length > 0 ? (
                    props.data.map((f) => (
                        <TableRow key={f.id}>
                            <TableCell>{f.title}</TableCell>
                            <TableCell>{f.source}</TableCell>
                            <TableCell>{f.description}</TableCell>
                            <TableCell>{f.createdAt}</TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={4} className="text-center">
                            There are no feedback messages submitted yet.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
