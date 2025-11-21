"use client"

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  MessageSquare,
  Eye,
  RefreshCw,
  Save,
  X,
  RotateCcw,
  MoreHorizontal,
  Download,
  Zap,
  AlertTriangle,
  Shield,
  Activity,
  Terminal,
  Radio,
  Clock,
  User,
  Hash
} from 'lucide-react';
import { cn } from "~/lib/utils";

// Glowing Stats Card
const StatsCard = ({ title, value, icon: Icon, color }: any) => (
  <Card className="border-cyan-700/40 bg-gradient-to-br from-blue-900/40 via-cyan-900/30 to-blue-900/40 backdrop-blur-xl shadow-2xl hover:shadow-cyan-500/40 transition-all duration-500">
    <CardContent className="p-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-cyan-300 font-medium text-lg">{title}</p>
          <p className="text-5xl font-black text-white mt-4">{value || '—'}</p>
        </div>
        <div className={cn("p-5 rounded-2xl bg-gradient-to-br shadow-2xl", color)}>
          <Icon className="w-10 h-10 text-white" />
        </div>
      </div>
    </CardContent>
  </Card>
);

// Priority Badge with Glow
const PriorityBadge = ({ priority }: { priority: string }) => {
  const styles = {
    low: "bg-blue-500/20 text-blue-400 border-blue-500/50 shadow-blue-500/40",
    medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50 shadow-yellow-500/40",
    high: "bg-orange-500/20 text-orange-400 border-orange-500/50 shadow-orange-500/40",
    urgent: "bg-red-500/20 text-red-400 border-red-500/50 shadow-red-500/60 animate-pulse"
  };

  return (
    <Badge variant="outline" className={cn("font-bold px-4 py-1.5 border-2 shadow-lg", styles[priority] || styles.low)}>
      {priority.toUpperCase()}
    </Badge>
  );
};

// Status Badge with Pulse
const StatusBadge = ({ status }: { status: string }) => {
  const isOpen = status === 'open';
  return (
    <Badge className={cn(
      "font-bold px-4 py-1.5 shadow-lg",
      isOpen
        ? "bg-emerald-500/30 text-emerald-400 border-emerald-500/60 shadow-emerald-500/50"
        : "bg-gray-500/30 text-gray-400 border-gray-500/60"
    )}>
      <span className="flex items-center gap-2">
        {isOpen && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />}
        <span className={isOpen ? "w-2 h-2 rounded-full bg-emerald-400" : "w-2 h-2 rounded-full bg-gray-400"} />
        {status.toUpperCase()}
      </span>
    </Badge>
  );
};

// View Ticket – Full Cyberpunk Mode
const ViewTicketDialog = ({ isOpen, onClose, ticketId, onStatusChange }: any) => {
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: ticket, refetch } = useQuery({
    queryKey: ['ticket', ticketId],
    queryFn: async () => {
      const res = await fetch(`/api/tickets/${ticketId}`);
      return res.json();
    },
    enabled: !!ticketId
  });

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetch(`/api/tickets/${ticketId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: replyContent })
      });
      setReplyContent('');
      refetch();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!ticket) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl bg-gradient-to-br from-blue-950/90 via-cyan-950/90 to-blue-950/90 border-2 border-cyan-500/60 backdrop-blur-2xl shadow-2xl shadow-cyan-500/60">
        <DialogHeader>
          <div className="flex justify-between items-center gap-6">
            <Terminal className="w-10 h-10 text-cyan-400" />
            <div>
              <DialogTitle className="text-3xl font-black text-cyan-300">
                {ticket.subject}
              </DialogTitle>
              <p className="text-cyan-400 font-mono text-lg mt-2">#{ticket.id.slice(0, 8)}</p>
            </div>
            <div className="flex gap-4 ml-auto">
              <PriorityBadge priority={ticket.priority} />
              <StatusBadge status={ticket.status} />
            </div>
          </div>
        </DialogHeader>

        <div className="py-6 max-h-96 overflow-y-auto space-y-6">
          {ticket.messages.map((msg: any, i: number) => (
            <div
              key={i}
              className={cn(
                "rounded-xl p-5 border",
                msg.isStaff
                  ? "bg-gradient-to-r from-cyan-900/50 to-blue-900/50 border-cyan-700/60 ml-12"
                  : "bg-gradient-to-l from-blue-900/50 to-cyan-900/50 border-blue-700/60 mr-12"
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <Badge variant={msg.isSystem ? "outline" : msg.isStaff ? "default" : "secondary"}>
                  {msg.isSystem ? 'SYSTEM' : msg.isStaff ? 'STAFF' : 'USER'}
                </Badge>
                <span className="text-xs text-cyan-400 font-mono">
                  {new Date(msg.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="text-cyan-100 leading-relaxed whitespace-pre-wrap">{msg.content}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmitReply} className="space-y-6 border-t border-cyan-800/50 pt-6">
          <Textarea
            value={replyContent}
            onChange={e => setReplyContent(e.target.value)}
            placeholder="Enter your response..."
            className="min-h-32 bg-black/40 border-cyan-700/60 text-cyan-200 placeholder:text-cyan-600 font-medium"
          />
          <div className="flex justify-between items-center">
            <Button
              type="button"
              size="lg"
              variant={ticket.status === 'open' ? "destructive" : "default"}
              onClick={() => onStatusChange(ticket.id, ticket.status === 'open' ? 'closed' : 'open')}
            >
              {ticket.status === 'open' ? (
                <>Close Ticket</>
              ) : (
                <>Reopen Ticket</>
              )}
            </Button>
            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Reply"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Priority Update Dialog
const UpdatePriorityDialog = ({ isOpen, onClose, ticketId, onUpdate }: any) => {
  const [priority, setPriority] = useState('low');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-blue-950/90 to-cyan-950/90 border-cyan-500/60 backdrop-blur-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-cyan-300">Update Threat Level</DialogTitle>
        </DialogHeader>
        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger className="bg-cyan-900/40 border-cyan-600/60 text-cyan-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
          </SelectContent>
        </Select>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => { onUpdate(ticketId, priority); onClose(); }}>
            Apply Threat Level
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// MAIN SUPPORT COMMAND CENTER
export default function AdminSupportDashboard() {
  const [filters, setFilters] = useState({
    search: '',
    priority: 'all',
    category: 'all',
    status: 'all'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [priorityUpdateTicketId, setPriorityUpdateTicketId] = useState<string | null>(null);
  const perPage = 12;

  const { data: stats } = useQuery({
    queryKey: ['ticket-stats'],
    queryFn: () => fetch('/api/tickets/stats').then(r => r.json())
  });

  const { data: tickets, refetch: refetchTickets } = useQuery({
    queryKey: ['tickets'],
    queryFn: () => fetch('/api/tickets/all').then(r => r.json())
  });

  const filteredTickets = tickets?.filter((t: any) => {
    if (filters.search && !t.subject.toLowerCase().includes(filters.search.toLowerCase()) &&
        !t.user.username.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.priority !== 'all' && t.priority !== filters.priority) return false;
    if (filters.category !== 'all' && t.category !== filters.category) return false;
    if (filters.status !== 'all' && t.status !== filters.status) return false;
    return true;
  }) || [];

  const paginatedTickets = filteredTickets.slice((currentPage - 1) * perPage, currentPage * perPage);

  const handleStatusChange = async (id: string, status: string) => {
    await fetch(`/api/tickets/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    refetchTickets();
  };

  const handlePriorityUpdate = async (id: string, priority: string) => {
    await fetch(`/api/tickets/${id}/priority`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priority })
    });
    refetchTickets();
  };

  const exportTickets = async () => {
    const res = await fetch('/api/tickets/export');
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vizora-support-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-cyan-950 to-indigo-950 p-8">
      <div className="max-w-screen-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-6xl font-black bg-gradient-to-r from-cyan-300 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
              SUPPORT COMMAND
            </h1>
            <p className="text-cyan-300/80 text-xl mt-4">Real-time customer support operations center</p>
          </div>
          <Button size="lg" onClick={exportTickets}>
            <Download className="w-6 h-6 mr-3" />
            Export All Tickets
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-6 mb-10">
          <StatsCard title="Total Tickets" value={stats?.total} icon={MessageSquare} color="from-cyan-500 to-blue-600" />
          <StatsCard title="Open Tickets" value={stats?.open} icon={AlertTriangle} color="from-emerald-500 to-teal-600" />
          <StatsCard title="Avg Response" value={stats?.averageResponseTime ? `${Math.round(stats.averageResponseTime / 60000)}m` : '—'} icon={Clock} color="from-amber-500 to-orange-amber-600" />
          <StatsCard title="Last 7 Days" value={stats?.ticketsLastWeek} icon={Activity} color="from-purple-500 to-pink-600" />
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-8 flex-wrap">
          <Input
            placeholder="Search tickets..."
            value={filters.search}
            onChange={e => setFilters(p => ({ ...p, search: e.target.value }))}
            className="w-96 bg-cyan-900/40 border-cyan-600/60 text-cyan-200"
          />
          {['priority', 'category', 'status'].map(key => (
            <Select
              key={key}
              value={filters[key as keyof typeof filters] as string}
              onValueChange={v => setFilters(p => ({ ...p, [key]: v }))}
            >
              <SelectTrigger className="w-48 bg-cyan-900/40 border-cyan-600/60 text-cyan-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(key === 'priority' ? ['all', 'low', 'medium', 'high', 'urgent'] :
                 key === 'status' ? ['all', 'open', 'closed'] :
                 ['all', 'technical', 'billing', 'general', 'abuse']).map(v => (
                  <SelectItem key={v} value={v}>
                    {v === 'all' ? `All ${key.charAt(0).toUpperCase() + key.slice(1)}` : v.charAt(0).toUpperCase() + v.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
        </div>

        {/* Tickets Table */}
        <Card className="border-cyan-700/50 bg-gradient-to-br from-blue-900/40 via-cyan-900/30 to-blue-900/40 backdrop-blur-xl shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-cyan-800/50">
                  <th className="text-left p-6 text-cyan-300 font-bold">Ticket</th>
                  <th className="text-left p-6 text-cyan-300 font-bold">Client</th>
                  <th className="text-left p-6 text-cyan-300 font-bold">Category</th>
                  <th className="text-left p-6 text-cyan-300 font-bold">Threat Level</th>
                  <th className="text-left p-6 text-cyan-300 font-bold">Status</th>
                  <th className="text-center p-6 text-cyan-300 font-bold">Control</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTickets.map((ticket: any) => (
                  <tr key={ticket.id} className="border-b border-cyan-800/30 hover:bg-cyan-900/20 transition-all">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <Hash className="w-5 h-5 text-cyan-500" />
                        <div>
                          <div className="text-lg font-bold text-white">{ticket.subject}</div>
                          <div className="text-cyan-400 font-mono">#{ticket.id.slice(0, 8)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-cyan-500" />
                        <div>
                          <div className="text-white font-medium">{ticket.user.username}</div>
                          <div className="text-cyan-400 text-sm">{ticket.user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <Badge variant="outline" className="bg-cyan-900/50 border-cyan-600/60 text-cyan-300">
                        {ticket.category.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="p-6"><PriorityBadge priority={ticket.priority} /></td>
                    <td className="p-6"><StatusBadge status={ticket.status} /></td>
                    <td className="p-6">
                      <div className="flex justify-center gap-3">
                        <Button variant="ghost" size="icon" onClick={() => setSelectedTicketId(ticket.id)}>
                          <Eye className="w-5 h-5 text-cyan-400" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setPriorityUpdateTicketId(ticket.id)}>
                          <MoreHorizontal className="w-5 h-5 text-cyan-400" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleStatusChange(ticket.id, ticket.status === 'open' ? 'closed' : 'open')}
                        >
                          {ticket.status === 'open' ? (
                            <X className="w-5 h-5 text-red-400" />
                          ) : (
                            <RotateCcw className="w-5 h-5 text-emerald-400" />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center p-6 border-t border-cyan-800/40">
            <p className="text-cyan-400">
              Showing {(currentPage - 1) * perPage + 1} to {Math.min(currentPage * perPage, filteredTickets.length)} of {filteredTickets.length} tickets
            </p>
            <div className="flex gap-2">
              <Button variant="outline" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
                Previous
              </Button>
              <Button variant="default">{currentPage}</Button>
              <Button variant="outline" disabled={currentPage === Math.ceil(filteredTickets.length / perPage)} onClick={() => setCurrentPage(p => p + 1)}>
                Next
              </Button>
            </div>
          </div>
        </Card>

        <ViewTicketDialog
          isOpen={!!selectedTicketId}
          onClose={() => setSelectedTicketId(null)}
          ticketId={selectedTicketId}
          onStatusChange={handleStatusChange}
        />

        <UpdatePriorityDialog
          isOpen={!!priorityUpdateTicketId}
          onClose={() => setPriorityUpdateTicketId(null)}
          ticketId={priorityUpdateTicketId}
          onUpdate={handlePriorityUpdate}
        />
      </div>
    </div>
  );
}
