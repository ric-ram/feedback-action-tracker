import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

import { Action } from '@/app/types/commonTypes';
import ActionsDropdownMenu from './actions-dropdown-menu';
import { Spinner } from '../ui/spinner';
import StatusSelector from './actions-status-selector';

export default function ActionsTable(
    props: Readonly<{
        feedbackId: string;
        data: Action[];
        loading: boolean;
        onRefresh: () => void;
    }>
) {
    const transformDate = (dateString: string, toUTC?: boolean) => {
        const date = new Date(dateString);

        return toUTC ? date.toUTCString() : date.toDateString();
    };

    const renderTableRows = () => {
        if (props.loading) {
            return (
                <TableRow>
                    <TableCell colSpan={6} className="h-24">
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
                    <TableCell colSpan={6} className="text-center">
                        There are no actions yet for the current feedback
                    </TableCell>
                </TableRow>
            );
        }

        return props.data.map((a) => (
            <TableRow key={a.id}>
                <TableCell>{a.title}</TableCell>
                <TableCell>{a.description}</TableCell>
                <TableCell>
                    <StatusSelector
                        feedbackId={props.feedbackId}
                        actionId={a.id}
                        currentStatus={a.status}
                    />
                </TableCell>
                <TableCell>
                    <Tooltip>
                        <TooltipTrigger>
                            {transformDate(a.updatedAt)}
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                            {transformDate(a.updatedAt, true)}
                        </TooltipContent>
                    </Tooltip>
                </TableCell>
                <TableCell>
                    <Tooltip>
                        <TooltipTrigger>
                            {transformDate(a.createdAt)}
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                            {transformDate(a.createdAt, true)}
                        </TooltipContent>
                    </Tooltip>
                </TableCell>
                <TableCell className="text-center">
                    <ActionsDropdownMenu
                        feedbackId={props.feedbackId}
                        action={a}
                        onRefresh={props.onRefresh}
                    />
                </TableCell>
            </TableRow>
        ));
    };

    return (
        <Table>
            <TableCaption>
                A list of all actions related to the current Feedback
            </TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>{renderTableRows()}</TableBody>
        </Table>
    );
}
