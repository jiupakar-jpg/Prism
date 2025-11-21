"use client"

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
  Settings,
  RefreshCw,
  AlertCircle,
  Save,
  Archive,
  Terminal,
  FileCode,
  Upload,
  Check,
  Clock,
  RotateCcw,
  ShieldAlert,
  Users,
  Server,
  Database,
  ChevronRight,
  Box,
  CircuitBoard,
  Rocket,
  Zap,
  Activity
} from 'lucide-react';
import axios from 'axios';
import { cn } from "~/lib/utils";

// Welcome Modal – VIZORA HOST Edition
function WelcomeModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleClose = () => {
    if (dontShowAgain) localStorage.setItem('prismWelcomeShown', 'true');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gradient-to-br from-blue-950/90 via-cyan-950/90 to-blue-950/90 border-2 border-cyan-500/60 backdrop-blur-2xl shadow-2xl shadow-cyan-500/50">
        <div className="py-12 text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-400/20 blur-3xl animate-pulse" />
            <Rocket className="w-20 h-20 mx-auto text-cyan-400 mb-6" />
          </div>
          <h2 className="text-5xl font-black bg-gradient-to-r from-cyan-300 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
            VIZORA HOST
          </h2>
          <p className="text-2xl font-bold text-cyan-200 mt-4">Prism 0.5 — Adelante</p>
          <p className="text-cyan-300/80 mt-6 max-w-xl mx-auto text-lg leading-relaxed">
            The future has arrived. Welcome to the next generation of hosting control — faster, stronger, and undeniably beautiful.
          </p>
          <div className="flex items-center justify-center gap-3 mt-8">
            <Checkbox
              id="dontShowAgain"
              checked={dontShowAgain}
              onCheckedChange={setDontShowAgain}
              className="data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500"
            />
            <label htmlFor="dontShowAgain" className="text-cyan-300 cursor-pointer">
              Don’t show this again
            </label>
          </div>
        </div>
        <DialogFooter className="justify-center">
          <Button onClick={handleClose} size="lg" className="px-12">
            <Zap className="w-5 h-5 mr-2" />
            Launch Control Center
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// System Stats – Glowing Cards
function SystemStats() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['system-stats'],
    queryFn: async () => {
      const [servers, users, nodes] = await Promise.all([
        axios.get('/api/servers'),
        axios.get('/api/users'),
        axios.get('/api/nodes')
      ]);
      return {
        servers: servers.data.meta.pagination.total || 0,
        users: users.data.meta.pagination.total || 0,
        nodes: nodes.data.meta.pagination.total || 0
      };
    },
    refetchInterval: 60000
  });

  const statsData = [
    { icon: Server, label: 'Servers', value: stats?.servers || 0, color: "from-cyan-500 to-blue-600" },
    { icon: Users, label: 'Users', value: stats?.users || 0, color: "from-emerald-500 to-teal-600" },
    { icon: CircuitBoard, label: 'Nodes', value: stats?.nodes || 0, color: "from-purple-500 to-pink-600" },
  ];

  return (
    <div className="grid grid-cols-3 gap-6">
      {statsData.map((stat, i) => (
        <Card key={i} className="border-cyan-700/40 bg-gradient-to-br from-blue-900/40 via-cyan-900/30 to-blue-900/40 backdrop-blur-xl shadow-xl hover:shadow-cyan-500/40 transition-all duration-500">
          <CardContent className="pt-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-300 font-medium">{stat.label}</p>
                <p className="text-4xl font-black text-white mt-2">
                  {isLoading ? "—" : stat.value.toLocaleString()}
                </p>
              </div>
              <div className={cn("p-4 rounded-2xl bg-gradient-to-br shadow-lg", stat.color)}>
                <stat.icon className="w-10 h-10 text-white" />
              </div>
            </div>
            {isLoading && <div className="mt-4 h-2 bg-cyan-800/40 rounded-full animate-pulse" />}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Backups Dialog – Full Cyberpunk Mode
function BackupsDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [selectedBackup, setSelectedBackup] = useState<any>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const [error, setError] = useState('');
  const [showRebootPrompt, setShowRebootPrompt] = useState(false);

  const { data: backups, isLoading, refetch } = useQuery({
    queryKey: ['backups'],
    queryFn: async () => {
      const { data } = await axios.get('/api/config/backups');
      return data;
    },
    enabled: isOpen
  });

  const handleRestore = async () => {
    try {
      setIsRestoring(true);
      await axios.post(`/api/config/backups/${selectedBackup.name}/restore`);
      setShowRebootPrompt(true);
      refetch();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Restore failed');
    } finally {
      setIsRestoring(false);
    }
  };

  const formatDate = (ts: string) => new Date(ts).toLocaleString();

  if (showRebootPrompt) {
    return (
      <AlertDialog open={true}>
        <AlertDialogContent className="border-cyan-500/50 bg-gradient-to-br from-blue-950/90 to-cyan-950/90 backdrop-blur-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-cyan-300">Restore Complete</AlertDialogTitle>
            <AlertDialogDescription className="text-cyan-200">
              Configuration restored successfully. Reboot required to apply changes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onClose}>Later</AlertDialogCancel>
            <AlertDialogAction onClick={() => axios.post('/api/reboot').then(() => setTimeout(() => location.reload(), 7000))}>
              Reboot Now
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl bg-gradient-to-br from-blue-950/90 via-cyan-950/90 to-blue-950/90 border-2 border-cyan-500/60 backdrop-blur-2xl">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-cyan-300 flex items-center gap-3">
            <Archive className="w-8 h-8" /> Configuration Vault
          </DialogTitle>
          <DialogDescription className="text-cyan-200">
            Secure backups of your entire dashboard configuration
          </DialogDescription>
        </DialogHeader>

        {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

        <ScrollArea className="h-96 rounded-xl border border-cyan-800/50">
          <Table>
            <TableHeader>
              <TableRow className="border-cyan-800/50">
                <TableHead className="text-cyan-300">Timestamp</TableHead>
                <TableHead className="text-cyan-300">Backup ID</TableHead>
                <TableHead className="text-right text-cyan-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={3} className="text-center py-12"><RefreshCw className="w-8 h-8 mx-auto animate-spin text-cyan-400" /></TableCell></TableRow>
              ) : backups?.length ? backups.map((b: any) => (
                <TableRow key={b.name} className="border-cyan-800/30 hover:bg-cyan-900/20">
                  <TableCell className="text-cyan-200 font-mono">{formatDate(b.timestamp)}</TableCell>
                  <TableCell className="text-cyan-300 font-mono text-sm">{b.name}</TableCell>
                  <TableCell className="text-right space-x-3">
                    <Button variant="outline" size="sm" onClick={() => window.open(`/api/config/backups/${b.name}`, '_blank')}>
                      <Terminal className="w-4 h-4 mr-2" /> View
                    </Button>
                    <Button variant="default" size="sm" onClick={() => setSelectedBackup(b)}>
                      <RotateCcw className="w-4 h-4 mr-2" /> Restore
                    </Button>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow><TableCell colSpan={3} className="text-center text-cyan-500 py-12">No backups available</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>

        {selectedBackup && (
          <AlertDialog open={true} onOpenChange={() => setSelectedBackup(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Restore</AlertDialogTitle>
                <AlertDialogDescription>
                  Restore from <strong>{formatDate(selectedBackup.timestamp)}</strong>? This will overwrite current config.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleRestore} disabled={isRestoring}>
                  {isRestoring ? "Restoring..." : "Restore Backup"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </DialogContent>
    </Dialog>
  );
}

// MAIN ADMIN OVERVIEW
export default function AdminOverview() {
  const [showWelcome, setShowWelcome] = useState(() => !localStorage.getItem('prismWelcomeShown'));
  const [configContent, setConfigContent] = useState('');
  const [isRebootDialogOpen, setIsRebootDialogOpen] = useState(false);
  const [isBackupsDialogOpen, setIsBackupsDialogOpen] = useState(false);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isRebooting, setIsRebooting] = useState(false);

  const { data: config, isLoading: loadingConfig } = useQuery({
    queryKey: ['config'],
    queryFn: () => axios.get('/api/config').then(r => r.data)
  });

  const { data: rebootStatus } = useQuery({
    queryKey: ['rebootStatus'],
    queryFn: () => axios.get('/api/reboot/status').then(r => r.data),
    refetchInterval: 5000
  });

  useEffect(() => {
    axios.get('/api/config/raw').then(r => setConfigContent(r.data));
  }, []);

  const handleSaveConfig = async () => {
    setIsSaving(true);
    try {
      await axios.post('/api/config/raw', configContent, { headers: { 'Content-Type': 'text/plain' } });
      setError('Configuration saved — reboot required');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Save failed');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReboot = async () => {
    setIsRebooting(true);
    await axios.post('/api/reboot');
    setTimeout(() => location.reload(), 7000);
  };

  if (loadingConfig) return <div className="min-h-screen bg-gradient-to-br from-blue-950 to-cyan-950 flex items-center justify-center"><Activity className="w-16 h-16 text-cyan-400 animate-spin" /></div>;

  return (
    <>
      <WelcomeModal isOpen={showWelcome} onClose={() => setShowWelcome(false)} />

      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-cyan-950 to-indigo-950">
        <div className="p-8 max-w-screen-2xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-5xl font-black bg-gradient-to-r from-cyan-300 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
                VIZORA HOST CONTROL
              </h1>
              <p className="text-cyan-300/80 mt-2 text-lg">Prism {config?.version} • {config?.platform_codename}</p>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" size="lg" onClick={() => setIsBackupsDialogOpen(true)}>
                <Archive className="w-5 h-5 mr-2" /> Vault
              </Button>
              <Button
                size="lg"
                variant={rebootStatus?.needsReboot ? "default" : "outline"}
                onClick={() => setIsRebootDialogOpen(true)}
                disabled={isRebooting}
              >
                {isRebooting ? (
                  <>Rebooting...</>
                ) : rebootStatus?.needsReboot ? (
                  <>Reboot Required</>
                ) : (
                  <>Reboot System</>
                )}
              </Button>
            </div>
          </div>

          {/* Stats */}
          <SystemStats />

          {/* Main Grid */}
          <div className="grid grid-cols-4 gap-8 mt-10">
            {/* Config Editor */}
            <div className="col-span-3">
              <Card className="h-[calc(100vh-20rem)] flex flex-col border-cyan-700/40 bg-gradient-to-br from-blue-900/40 via-cyan-900/30 to-blue-900/40 backdrop-blur-xl shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-2xl text-cyan-300 flex items-center gap-3">
                    <Terminal className="w-7 h-7" /> Configuration Core
                  </CardTitle>
                  <CardDescription className="text-cyan-200">
                    Live editing of prism.toml — changes require reboot
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 pb-0">
                  <textarea
                    value={configContent}
                    onChange={e => setConfigContent(e.target.value)}
                    className="w-full h-full p-6 bg-black/40 text-cyan-300 font-mono text-sm rounded-xl border border-cyan-800/50 focus:outline-none focus:border-cyan-400 transition-all"
                    spellCheck={false}
                  />
                </CardContent>
                <CardFooter className="flex justify-between items-center border-t border-cyan-800/40 mt-4 pt-4">
                  {rebootStatus?.needsReboot && (
                    <span className="flex items-center gap-2 text-yellow-400">
                      <AlertCircle className="w-5 h-5" /> Reboot required
                    </span>
                  )}
                  <Button size="lg" onClick={handleSaveConfig} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Deploy Changes"}
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              <Card className="border-cyan-700/40 bg-gradient-to-br from-blue-900/40 to-cyan-900/30 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-xl text-cyan-300">Command Center</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" onClick={() => setIsBackupsDialogOpen(true)}>
                    <Archive className="w-5 h-5 mr-3" /> Open Vault
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={handleSaveConfig}>
                    <Save className="w-5 h-5 mr-3" /> Save & Backup
                  </Button>
                </CardContent>
              </Card>

              {error && (
                <Alert variant={error.includes('success') ? "default" : "destructive"}>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </div>

        <BackupsDialog isOpen={isBackupsDialogOpen} onClose={() => setIsBackupsDialogOpen(false)} />

        <AlertDialog open={isRebootDialogOpen} onOpenChange={setIsRebootDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>System Reboot</AlertDialogTitle>
              <AlertDialogDescription>
                This will restart the entire control panel. All admin sessions will be terminated.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleReboot}>Initiate Reboot</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
}
