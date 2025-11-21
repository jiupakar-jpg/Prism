"use client"

import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  Plus,
  Settings,
  AlertCircle,
  Trash,
  RefreshCw,
  Server,
  Webhook,
  Activity,
  Check,
  X,
  Shield,
  Info,
  Zap,
  Radio,
  AlertTriangle,
  Brain,
  Target
} from 'lucide-react';
import axios from 'axios';
import { cn } from "~/lib/utils";

// Enhanced Status Badge with Pulse
function StatusBadge({ status }: { status: string }) {
  const isOnline = status === 'online';
  return (
    <Badge
      variant="outline"
      className={cn(
        "font-bold px-4 py-1.5 border-2 shadow-lg backdrop-blur-sm relative overflow-hidden",
        isOnline
          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-emerald-500/40"
          : "bg-red-500/20 text-red-400 border-red-500/50 shadow-red-500/40"
      )}
    >
      <span className="flex items-center gap-2">
        <span className={cn(
          "w-2.5 h-2.5 rounded-full relative",
          isOnline ? "bg-emerald-400" : "bg-red-400"
        )}>
          {isOnline && (
            <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping" />
          )}
        </span>
        {status || 'unknown'}
      </span>
    </Badge>
  );
}

// Node Form – VIZORA HOST Style
function NodeForm({ node, onSubmit, isSubmitting }: any) {
  const [formData, setFormData] = useState({
    name: node?.name || '',
    fqdn: node?.fqdn || '',
    port: node?.port || '8080',
    webhookUrl: node?.webhookUrl || ''
  });

  return (
    <div className="grid gap-6 py-6">
      <div className="space-y-5">
        <div className="space-y-2">
          <label className="text-cyan-300 font-semibold">Node Designation</label>
          <Input
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            placeholder="NEPTUNE-01"
            className="bg-cyan-900/40 border-cyan-600/60 text-cyan-200 placeholder:text-cyan-500"
          />
        </div>
        <div className="space-y-2">
          <label className="text-cyan-300 font-semibold">Target FQDN / IP</label>
          <Input
            value={formData.fqdn}
            onChange={e => setFormData({ ...formData, fqdn: e.target.value })}
            placeholder="radar-01.vizora.host"
            className="font-mono bg-cyan-900/40 border-cyan-600/60 text-cyan-200"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-cyan-300 font-semibold">Port</label>
            <Input
              type="number"
              value={formData.port}
              onChange={e => setFormData({ ...formData, port: e.target.value })}
              placeholder="8080"
              className="bg-cyan-900/40 border-cyan-600/60 text-cyan-200"
            />
          </div>
          <div className="space-y-2">
            <label className="text-cyan-300 font-semibold flex items-center gap-2">
              <Webhook className="w-4 h-4" /> Alert Webhook
            </label>
            <Input
              value={formData.webhookUrl}
              onChange={e => setFormData({ ...formData, webhookUrl: e.target.value })}
              placeholder="https://discord.com/api/webhooks/..."
              className="font-mono text-xs bg-cyan-900/40 border-cyan-600/60 text-cyan-200"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" size="lg" onClick={() => onSubmit(null)}>
          Cancel
        </Button>
        <Button size="lg" onClick={() => onSubmit(formData)} disabled={isSubmitting}>
          {isSubmitting ? (
            <>Deploying Node...</>
          ) : (
            <>Deploy Radar Node</>
          )}
        </Button>
      </div>
    </div>
  );
}

// Node Details – Threat Intelligence Center
function NodeDetails({ node, onClose }: any) {
  const { data: details, isLoading } = useQuery({
    queryKey: ['node', node?.id],
    queryFn: () => axios.get(`/api/radar/nodes/${node?.id}`).then(r => r.data),
    enabled: !!node?.id,
    refetchInterval: 5000
  });

  return (
    <Dialog open={!!node} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl bg-gradient-to-br from-blue-950/90 via-cyan-950/90 to-blue-950/90 border-2 border-cyan-500/60 backdrop-blur-2xl shadow-2xl shadow-cyan-500/50">
        <DialogHeader>
          <DialogTitle className="text-4xl font-black bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent flex items-center gap-4">
            <Target className="w-10 h-10 text-cyan-400" />
            {node?.name}
          </DialogTitle>
          <DialogDescription className="text-cyan-200 text-lg">
            Real-time threat detection node • {node?.fqdn}:{node?.port}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle className="text-cyan-300 flex items-center gap-3">
                <Brain className="w-6 h-6" /> Detection Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
                </div>
              ) : details?.status === 'online' ? (
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-5xl font-black text-white">{details.stats?.total_detections?.toLocaleString() || 0}</div>
                    <div className="text-cyan-300 mt-2">Total Detections</div>
                  </div>
                  <div className="text-center">
                    <div className="text-5xl font-black text-emerald-400">{details.stats?.recent_detections || 0}</div>
                    <div className="text-cyan-300 mt-2">Last 24h</div>
                  </div>
                  <div className="text-center">
                    <div className="text-5xl font-black text-purple-400">
                      {Object.keys(details.stats?.detection_types || {}).length}
                    </div>
                    <div className="text-cyan-300 mt-2">Attack Vectors</div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-red-400">
                  <AlertTriangle className="w-16 h-16 mx-auto mb-4" />
                  <p>Node Offline</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-cyan-300">Node Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-cyan-400">Status</span>
                <StatusBadge status={details?.status || 'offline'} />
              </div>
              <div className="flex justify-between">
                <span className="text-cyan-400">Uptime</span>
                <span className="text-white font-mono">99.98%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cyan-400">Last Seen</span>
                <span className="text-white font-mono">12s ago</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// MAIN RADAR CONTROL CENTER
export default function RadarPage() {
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [viewingNode, setViewingNode] = useState<any>(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: nodes, isLoading } = useQuery({
    queryKey: ['radar-nodes'],
    queryFn: () => axios.get('/api/radar/nodes').then(r => r.data),
    refetchInterval: 10000
  });

  const handleCreateNode = async (formData: any) => {
    if (!formData) return setIsCreateModalOpen(false);
    setIsSubmitting(true);
    try {
      await axios.post('/api/radar/nodes', formData);
      setIsCreateModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['radar-nodes'] });
      setError('success:Radar node deployed successfully');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Deployment failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteNode = async () => {
    try {
      await axios.delete(`/api/radar/nodes/${selectedNode.id}`);
      setIsDeleteDialogOpen(false);
      setSelectedNode(null);
      queryClient.invalidateQueries({ queryKey: ['radar-nodes'] });
      setError('success:Node terminated');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Termination failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-cyan-950 to-indigo-950 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-10">
          <div>
            <h1 className="text-6xl font-black bg-gradient-to-r from-cyan-300 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
              RADAR 6
            </h1>
            <p className="text-cyan-300/80 text-xl mt-3">Real-time Threat Detection Network</p>
          </div>
          <Button size="lg" onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-6 h-6 mr-3" />
            Deploy Node
          </Button>
        </div>

        {/* Alert */}
        {error && (
          <Alert variant={error.startsWith('success:') ? "default" : "destructive"} className="mb-8 border-2">
            {error.startsWith('success:') ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <AlertDescription className="text-lg font-medium">
              {error.replace('success:', '')}
            </AlertDescription>
          </Alert>
        )}

        {/* Nodes Grid */}
        <Card className="border-cyan-700/50 bg-gradient-to-br from-blue-900/40 via-cyan-900/30 to-blue-900/40 backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <CardTitle className="text-3xl text-cyan-300 flex items-center gap-4">
              <Radio className="w-8 h-8" /> Active Detection Nodes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-cyan-800/50">
                  <TableHead className="text-cyan-300 font-bold">Node</TableHead>
                  <TableHead className="text-cyan-300 font-bold">Status</TableHead>
                  <TableHead className="text-cyan-300 font-bold">Total Detections</TableHead>
                  <TableHead className="text-cyan-300 font-bold">Threat Activity</TableHead>
                  <TableHead className="text-right text-cyan-300 font-bold">Control</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [...Array(4)].map((_, i) => (
                    <TableRow key={i}><TableCell colSpan={5}><Skeleton className="h-20 w-full" /></TableCell></TableRow>
                  ))
                ) : nodes?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-20">
                      <Shield className="w-20 h-20 mx-auto text-cyan-800 mb-6" />
                      <p className="text-2xl text-cyan-400 mb-6">No Radar nodes active</p>
                      <Button size="lg" onClick={() => setIsCreateModalOpen(true)}>
                        Activate First Node
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : (
                  nodes?.map((node: any) => (
                    <TableRow key={node.id} className="border-cyan-800/30 hover:bg-cyan-900/20 transition-all">
                      <TableCell>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center">
                            <Target className="w-7 h-7 text-white" />
                          </div>
                          <div>
                            <div className="text-xl font-bold text-white">{node.name}</div>
                            <div className="text-cyan-400 font-mono">{node.fqdn}:{node.port}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell><StatusBadge status={node.status} /></TableCell>
                      <TableCell className="text-2xl font-black text-white">
                        {node.status === 'online' ? (node.stats?.total_detections || 0).toLocaleString() : '—'}
                      </TableCell>
                      <TableCell>
                        {node.status === 'online' ? (
                          <div className="flex items-center gap-3">
                            <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
                            <span className="text-lg text-white">{node.stats?.recent_detections || 0} threats</span>
                          </div>
                        ) : 'Offline'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-3">
                          <Button variant="ghost" size="icon" onClick={() => setViewingNode(node)}>
                            <Info className="w-5 h-5 text-cyan-400" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedNode(node);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash className="w-5 h-5 text-red-400" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Modals */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="max-w-2xl bg-gradient-to-br from-blue-950/90 to-cyan-950/90 border-2 border-cyan-500/60 backdrop-blur-2xl">
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold text-cyan-300">Deploy New Radar Node</DialogTitle>
            </DialogHeader>
            <NodeForm onSubmit={handleCreateNode} isSubmitting={isSubmitting} />
          </DialogContent>
        </Dialog>

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Terminate Node</AlertDialogTitle>
              <AlertDialogDescription>
                Permanently delete <strong>{selectedNode?.name}</strong>? All detection history will be lost.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteNode} className="bg-red-600 hover:bg-red-700">
                Terminate Node
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <NodeDetails node={viewingNode} onClose={() => setViewingNode(null)} />
      </div>
    </div>
  );
}
