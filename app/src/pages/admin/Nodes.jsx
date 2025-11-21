"use client"

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Server,
  HardDrive,
  Cpu,
  MemoryStick,
  Network,
  Terminal,
  Settings,
  AlertCircle,
  ChevronRight,
  Info,
  Activity,
  Zap,
  Globe,
  Shield
} from 'lucide-react';
import axios from 'axios';

// VIZORA HOST Node Status Badge
function NodeStatusBadge({ status }: { status: string }) {
  const styles = {
    online: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-emerald-500/30",
    offline: "bg-red-500/20 text-red-400 border-red-500/40 shadow-red-500/30",
    maintenance: "bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-amber-500/30",
    installing: "bg-blue-500/20 text-blue-400 border-blue-500/40 shadow-blue-500/30"
  };

  const label = status?.charAt(0).toUpperCase() + status?.slice(1) || "Unknown";

  return (
    <Badge variant="outline" className={cn(
      "font-bold px-3 py-1 border-2 shadow-lg backdrop-blur-sm",
      styles[status?.toLowerCase() as keyof typeof styles] || styles.offline
    )}>
      <span className="relative flex items-center gap-2">
        <span className={cn(
          "w-2 h-2 rounded-full animate-pulse",
          status === "online" && "bg-emerald-400",
          status === "offline" && "bg-red-400",
          status === "maintenance" && "bg-amber-400",
          status === "installing" && "bg-blue-400"
        )} />
        {label}
      </span>
    </Badge>
  );
}

// Node Details Modal – Cyberpunk Edition
function NodeDetailsModal({ node, isOpen, onClose }: { node: any; isOpen: boolean; onClose: () => void }) {
  const { data: nodeConfig, isLoading: loadingConfig } = useQuery({
    queryKey: ['nodeConfig', node?.attributes?.id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/nodes/${node?.attributes?.id}/configuration`);
      return data;
    },
    enabled: isOpen && !!node?.attributes?.id
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl bg-gradient-to-br from-blue-950/90 via-cyan-950/90 to-blue-950/90 border-2 border-cyan-500/50 backdrop-blur-2xl shadow-2xl shadow-cyan-500/50">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent flex items-center gap-3">
            <Server className="w-8 h-8 text-cyan-400" />
            {node?.attributes?.name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 mt-6">
          {/* Status & Location */}
          <div className="flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border border-cyan-700/50">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <Globe className="w-6 h-6 text-cyan-400" />
                <span className="text-lg font-medium text-cyan-200">{node?.attributes?.location?.city || "Unknown"}, {node?.attributes?.location?.country || "??"}</span>
              </div>
              <NodeStatusBadge status={node?.attributes?.status} />
            </div>
            <div className="text-sm text-cyan-400 font-mono">{node?.attributes?.fqdn}</div>
          </div>

          {/* Resource Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border-cyan-700/50 backdrop-blur-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-cyan-300 flex items-center gap-2">
                  <MemoryStick className="w-5 h-5" /> Memory
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{(node?.attributes?.memory / 1024).toFixed(1)} GB</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border-cyan-700/50 backdrop-blur-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-cyan-300 flex items-center gap-2">
                  <HardDrive className="w-5 h-5" /> Storage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{(node?.attributes?.disk / 1024).toFixed(1)} TB</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border-cyan-700/50 backdrop-blur-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-cyan-300 flex items-center gap-2">
                  <Activity className="w-5 h-5" /> Uptime
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">99.99%</div>
              </CardContent>
            </Card>
          </div>

          {/* Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Terminal className="w-5 h-5" /> Daemon Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingConfig ? (
                <div className="space-y-3">
                  {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-4 w-full rounded-lg" />)}
                </div>
              ) : (
                <ScrollArea className="h-96 rounded-lg border border-cyan-800/50 p-4 bg-black/40">
                  <pre className="text-xs font-mono text-cyan-300 leading-relaxed">
                    {JSON.stringify(nodeConfig, null, 2)}
                  </pre>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Main Nodes Admin Page – VIZORA HOST Edition
export default function NodesPage() {
  const [search, setSearch] = useState('');
  const [perPage, setPerPage] = useState('10');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNode, setSelectedNode] = useState<any>(null);

  const { data: nodes, isLoading } = useQuery({
    queryKey: ['nodes'],
    queryFn: async () => {
      const { data } = await axios.get('/api/nodes');
      return data.data;
    }
  });

  const filteredNodes = nodes?.filter((node: any) =>
    node.attributes.name.toLowerCase().includes(search.toLowerCase()) ||
    node.attributes.fqdn.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const paginatedNodes = filteredNodes.slice(
    (currentPage - 1) * parseInt(perPage),
    currentPage * parseInt(perPage)
  );

  const totalPages = Math.ceil(filteredNodes.length / parseInt(perPage));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-cyan-950 to-indigo-950 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-5xl font-black bg-gradient-to-r from-cyan-300 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
            Node Control Center
          </h1>
          <p className="text-cyan-300/80 mt-3 text-lg">Monitor and manage all VIZORA HOST infrastructure nodes</p>
        </div>

        <Card className="border-cyan-700/50 bg-gradient-to-br from-blue-900/40 via-cyan-900/30 to-blue-900/40 backdrop-blur-xl shadow-2xl shadow-cyan-500/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Shield className="w-8 h-8 text-cyan-400" />
                <CardTitle className="text-2xl font-bold text-cyan-200">Infrastructure Nodes</CardTitle>
                <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/40 px-3">
                  {filteredNodes.length} Active
                </Badge>
              </div>

              <div className="flex gap-4">
                <Input
                  placeholder="Search by name or FQDN..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-80 bg-cyan-900/40 border-cyan-600/60 text-cyan-200 placeholder:text-cyan-500 focus:ring-cyan-400"
                />
                <Select value={perPage} onValueChange={setPerPage}>
                  <SelectTrigger className="w-40 bg-cyan-900/40 border-cyan-600/60 text-cyan-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 per page</SelectItem>
                    <SelectItem value="25">25 per page</SelectItem>
                    <SelectItem value="50">50 per page</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-cyan-800/50">
                  <TableHead className="text-cyan-300 font-bold">Node</TableHead>
                  <TableHead className="text-cyan-300 font-bold">Location</TableHead>
                  <TableHead className="text-cyan-300 font-bold">Memory</TableHead>
                  <TableHead className="text-cyan-300 font-bold">Storage</TableHead>
                  <TableHead className="text-cyan-300 font-bold">Status</TableHead>
                  <TableHead className="text-right text-cyan-300 font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [...Array(6)].map((_, i) => (
                    <TableRow key={i} className="border-cyan-800/30">
                      <TableCell><Skeleton className="h-8 w-64" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-28" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-16 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : paginatedNodes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-cyan-400">
                      <Server className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>No nodes found matching your search.</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedNodes.map((node: any) => (
                    <TableRow key={node.attributes.id} className="border-cyan-800/30 hover:bg-cyan-900/20 transition-all">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center">
                            <Server className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="font-bold text-white">{node.attributes.name}</div>
                            <div className="text-sm text-cyan-400 font-mono">{node.attributes.fqdn}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-cyan-300">
                        {node.attributes.location?.city || "Unknown"}
                      </TableCell>
                      <TableCell className="text-white font-bold">
                        {(node.attributes.memory / 1024).toFixed(1)} GB
                      </TableCell>
                      <TableCell className="text-white font-bold">
                        {(node.attributes.disk / 1024).toFixed(1)} TB
                      </TableCell>
                      <TableCell>
                        <NodeStatusBadge status={node.attributes.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-800/50"
                          onClick={() => setSelectedNode(node)}
                        >
                          <Info className="w-5 h-5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-8">
              <p className="text-sm text-cyan-400">
                Showing {(currentPage - 1) * parseInt(perPage) + 1} to {Math.min(currentPage * parseInt(perPage), filteredNodes.length)} of {filteredNodes.length} nodes
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="border-cyan-600/60 text-cyan-300 hover:bg-cyan-900/40"
                >
                  Previous
                </Button>
                {[...Array(totalPages)].map((_, i) => (
                  <Button
                    key={i}
                    variant={currentPage === i + 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(i + 1)}
                    className={currentPage === i + 1 ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white" : "border-cyan-600/60 text-cyan-300 hover:bg-cyan-900/40"}
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="border-cyan-600/60 text-cyan-300 hover:bg-cyan-900/40"
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <NodeDetailsModal
        node={selectedNode}
        isOpen={!!selectedNode}
        onClose={() => setSelectedNode(null)}
      />
    </div>
  );
}
