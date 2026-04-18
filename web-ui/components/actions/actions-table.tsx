import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../ui/table';

import { Action } from '@/app/types/commonTypes';
import { Spinner } from '../ui/spinner';

export default function ActionsTable(
    props: Readonly<{ data: Action[]; loading: boolean }>
) {
    const renderTableRows = () => {
        if (props.loading) {
            return (
                <TableRow>
                    <TableCell colSpan={5} className="h-24">
                        <div className="flex items-center justify-center">
                            <Spinner className="size-8" />
                        </div>
                    </TableCell>
                </TableRow>
            );
        }

        if (props.data.length === 0) {
            return (
                <TableRow>
                    <TableCell colSpan={5} className="text-center">
                        There are no actions yet for the current feedback
                    </TableCell>
                </TableRow>
            );
        }

        return props.data.map((a) => (
            <TableRow key={a.id}>
                <TableCell>{a.title}</TableCell>
                <TableCell>{a.description}</TableCell>
                <TableCell>{a.status}</TableCell>
                <TableCell>{a.updatedAt}</TableCell>
                <TableCell>{a.createdAt}</TableCell>
            </TableRow>
        ));
    };

    return (
        <Table>
            <TableCaption>
                A list of all actions related to Feedback
            </TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Created At</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>{renderTableRows()}</TableBody>
        </Table>
    );
}
