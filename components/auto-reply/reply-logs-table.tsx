"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Loader2, MessageCircle, CheckCircle2, XCircle, ChevronLeft, ChevronRight } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function ReplyLogsTable() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    totalCount: 0,
    totalPages: 1,
  });

  const fetchLogs = async (page = 1) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/auto-reply/logs?page=${page}&pageSize=10`);
      if (res.ok) {
        const result = await res.json();
        setLogs(result.data);
        setPagination(result.pagination);
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchLogs(newPage);
    }
  };

  if (isLoading && logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-8 h-8 text-[#2d6a4f] animate-spin" />
        <p className="text-sm text-[#8792a2]">Collecting reply history...</p>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-[#e3e8ef] rounded-2xl bg-white">
        <div className="w-12 h-12 rounded-full bg-[#f6f9fc] flex items-center justify-center mb-4">
          <MessageCircle className="w-6 h-6 text-[#8792a2]" />
        </div>
        <h3 className="text-lg font-bold text-[#1a1f36]">No replies sent yet</h3>
        <p className="text-sm text-[#697386] max-w-sm mt-1 px-4">
          Once your auto-reply rules start triggering, you'll see a detailed log of all processed comments here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-[#e3e8ef] bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-[#f6f9fc]">
            <TableRow className="hover:bg-transparent border-b border-[#e3e8ef]">
              <TableHead className="w-[120px] font-bold text-[#697386] uppercase text-[10px] tracking-wider px-6">Platform</TableHead>
              <TableHead className="font-bold text-[#697386] uppercase text-[10px] tracking-wider px-6">Rule Name</TableHead>
              <TableHead className="font-bold text-[#697386] uppercase text-[10px] tracking-wider px-6">Comment Preview</TableHead>
              <TableHead className="font-bold text-[#697386] uppercase text-[10px] tracking-wider px-6">Reply Sent</TableHead>
              <TableHead className="w-[100px] font-bold text-[#697386] uppercase text-[10px] tracking-wider px-6 text-center">Status</TableHead>
              <TableHead className="w-[150px] font-bold text-[#697386] uppercase text-[10px] tracking-wider px-6 text-right">Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id} className="hover:bg-[#f6f9fc]/50 border-b border-[#f0f3f7] transition-colors">
                <TableCell className="px-6">
                  <Badge variant="outline" className="capitalize text-[10px] font-semibold border-[#e3e8ef] px-2 py-0.5">
                    {log.rule.platform}
                  </Badge>
                </TableCell>
                <TableCell className="px-6 font-medium text-[#3c4257]">{log.rule.name}</TableCell>
                <TableCell className="px-6 max-w-[200px] truncate text-sm text-[#697386]" title={log.commentText}>
                  {log.commentText}
                </TableCell>
                <TableCell className="px-6 max-w-[200px] truncate text-sm text-[#3c4257]" title={log.replyText}>
                  {log.replyText}
                </TableCell>
                <TableCell className="px-6 text-center">
                  {log.status === "success" ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500 mx-auto" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500 mx-auto" />
                  )}
                </TableCell>
                <TableCell className="px-6 text-right text-xs text-[#8792a2] font-medium">
                  {formatDistanceToNow(new Date(log.repliedAt), { addSuffix: true })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2 pt-2">
        <p className="text-xs font-semibold text-[#8792a2]">
          Total: <span className="text-[#3c4257]">{pagination.totalCount}</span> entries
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="h-8 w-8 p-0 border-[#e3e8ef]"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-xs font-bold text-[#697386] px-2">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            className="h-8 w-8 p-0 border-[#e3e8ef]"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
