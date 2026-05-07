import { useState } from "react";
import { format } from "date-fns";
import { Eye, MoreHorizontal, Trash2 } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export interface SubmissionRow {
  id: string;
  applicant_name: string | null;
  applicant_email: string | null;
  advisor_name: string | null;
  status: string;
  current_step: number;
  created_at: string;
}

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-800",
  submitted: "bg-blue-100 text-blue-800",
  in_review: "bg-yellow-100 text-yellow-800",
  reviewed: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
};

const formatStatus = (s: string) => s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

interface Props<T extends SubmissionRow> {
  rows: T[];
  totalSteps?: number;
  onView: (row: T) => void;
  onDelete: (id: string) => void;
  emptyText?: string;
}

export function SubmissionsTable<T extends SubmissionRow>({
  rows, totalSteps, onView, onDelete, emptyText = "No submissions found.",
}: Props<T>) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  if (rows.length === 0) {
    return <div className="text-center py-12 text-muted-foreground">{emptyText}</div>;
  }

  return (
    <>
      <div className="rounded-lg border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Applicant</TableHead>
              <TableHead>Advisor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Step</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} className="hover:bg-muted/30">
                <TableCell className="font-mono text-xs">{row.id.slice(0, 8).toUpperCase()}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{row.applicant_name || "N/A"}</div>
                    <div className="text-xs text-muted-foreground">{row.applicant_email || "No email"}</div>
                  </div>
                </TableCell>
                <TableCell><div className="text-sm">{row.advisor_name || "—"}</div></TableCell>
                <TableCell>
                  <Badge variant="secondary" className={statusColors[row.status] || ""}>
                    {formatStatus(row.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{row.current_step}{totalSteps ? ` / ${totalSteps}` : ""}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(row.created_at), "MMM d, yyyy")}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onView(row)} title="View Details">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onView(row)}>
                          <Eye className="h-4 w-4 mr-2" />View Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => setDeleteId(row.id)}>
                          <Trash2 className="h-4 w-4 mr-2" />Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Submission</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this submission? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => { if (deleteId) { onDelete(deleteId); setDeleteId(null); } }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
