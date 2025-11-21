import { Link, useNavigate, useLocation, Outlet, useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  Terminal,
  FolderClosed,
  ChevronLeft,
  Blocks,
  LayoutDashboard,
  PanelsTopLeft,
  SquareKanban,
  Users,
  Coins,
  Workflow,
  Menu,
  SendToBack,
  Globe,
  Network,
  MessageCircleQuestion,
  LogOut,
  Settings,
  User,
  Tags,
  ChevronDown,
  Archive,
  Cog,
  MoreHorizontal,
  Ticket,
  Power,
  RotateCw,
  Square,
  Server,
  Store,
  Coffee,
  ShieldBan
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import LoadingScreen from '../LoadingScreen';
import PageTransition from '../PageTransition';

export default function MainLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [coinsBalance, setCoinsBalance] = useState(0);
  const [userData, setUserData] = useState({ username: '', id: '' });
  const [serverInfo, setServerInfo] = useState({
    name: '',
    status: 'offline',
    ip: '',
    port: ''
  });
  const [retryCount, setRetryCount] = useState(0);
  const RETRY_COUNT = 5;
  const RETRY_DELAY = 5000;

  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const showSidebar = location.pathname.includes('/server/');
  const showAdminSidebar = location.pathname.includes('/admin/');
  const socketRef = useRef(null);
  const mounted = useRef(true);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/user/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        navigate('/auth');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleWebSocketMessage = (event) => {
    if (!mounted.current) return;
    try {
      const message = JSON.parse(event.data);
      switch (message.event) {
        case 'auth success':
          socketRef.current?.send(JSON.stringify({ event: 'send stats', args: [null] }));
          break;
        case 'status':
          setServerInfo(prev => ({ ...prev, status: message.args[0] }));
          break;
      }
    } catch (error) {
      console.error('WebSocket message handling error:', error);
    }
  };

  useEffect(() => {
    mounted.current = true;
    const connectWebSocket = async () => {
      if (!id || !mounted.current) return;
      try {
        const response = await fetch(`/api/server/${id}/websocket`);
        const data = await response.json();
        const ws = new WebSocket(data.data.socket);
        ws.onopen = () => {
          if (!mounted.current) { ws.close(); return; }
          console.log('WebSocket connected');
          setRetryCount(0);
          ws.send(JSON.stringify({ event: "auth", args: [data.data.token] }));
        };
        ws.onmessage = handleWebSocketMessage;
        ws.onclose = () => {
          if (!mounted.current) return;
          if (retryCount < RETRY_COUNT) {
            setTimeout(() => {
              if (mounted.current) {
                setRetryCount(prev => prev + 1);
                connectWebSocket();
              }
            }, RETRY_DELAY);
          }
        };
        ws.onerror = (error) => console.error('WebSocket error:', error);
        socketRef.current = ws;
      } catch (error) {
        console.error('WebSocket connection error:', error);
      }
    };
    connectWebSocket();
    return () => {
      mounted.current = false;
      socketRef.current?.close();
      socketRef.current = null;
    };
  }, [id, retryCount]);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await fetch('/api/admin');
        const data = await response.json();
        setIsAdmin(data.admin === true);
      } catch (error) {
        setIsAdmin(false);
      }
    };

    checkAdmin();
    const intervalId = setInterval(checkAdmin, 30000);

    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user');
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        setUserData({ username: 'User', id: '00000' });
      }
    };

    const fetchCoinsBalance = async () => {
      try {
        const response = await fetch('/api/coins');
        const data = await response.json();
        setCoinsBalance(data.coins);
      } catch (error) {
        setCoinsBalance(0);
      }
    };

    setInterval(fetchCoinsBalance, 3000);

    const fetchServerInfo = async () => {
      if (id) {
        try {
          const response = await fetch(`/api/server/${id}`);
          const data = await response.json();
          setServerInfo({
            name: data.attributes.name,
            status: data.attributes.status,
            ip: data.attributes.relationships?.allocations?.data?.[0]?.attributes?.ip_alias,
            port: data.attributes.relationships?.allocations?.data?.[0]?.attributes?.port
          });
        } catch (error) {
          console.error('Failed to fetch server info:', error);
        }
      }
    };

    const timer = setTimeout(() => setIsLoading(false), 1500);
    fetchUserData();
    fetchCoinsBalance();
    fetchServerInfo();

    return () => {
      clearTimeout(timer);
      clearInterval(intervalId);
    };
  }, [id]);

  const handlePowerAction = (action) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        event: "set state",
        args: [action]
      }));
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'running': return 'default';
      case 'starting': case 'stopping': return 'secondary';
      case 'offline': case 'stopped': return 'destructive';
      default: return 'outline';
    }
  };

  const mainSidebarNavItems = [
    { icon: <PanelsTopLeft className="w-4 h-4" />, label: 'Overview', path: `/server/${id}/overview` },
    { icon: <Terminal className="w-4 h-4" />, label: 'Console', path: `/server/${id}/console` },
    { icon: <FolderClosed className="w-4 h-4" />, label: 'Files', path: `/server/${id}/files` },
    { icon: <Globe className="w-4 h-4" />, label: 'Network', path: `/server/${id}/network` },
    { icon: <User className="w-4 h-4" />, label: 'Users', path: `/server/${id}/users` },
    { icon: <Archive className="w-4 h-4" />, label: 'Backups', path: `/server/${id}/backups` },
    { icon: <Cog className="w-4 h-4" />, label: 'Settings', path: `/server/${id}/settings` }
  ];

  const moreSidebarItems = [
    { icon: <Blocks className="w-4 h-4" />, label: 'Plugins', path: `/server/${id}/plugins` },
    { icon: <SendToBack className="w-4 h-4" />, label: 'Players', path: `/server/${id}/players` }
  ];

  const adminSidebarItems = [
    { icon: <SquareKanban className="w-4 h-4" />, label: 'Overview', path: '/admin/overview' },
    { icon: <Users className="w-4 h-4" />, label: 'Users', path: '/admin/users' },
    { icon: <Workflow className="w-4 h-4" />, label: 'Nodes', path: '/admin/nodes' },
    { icon: <ShieldBan className="w-4 h-4" />, label: 'Radar', path: '/admin/radar' },
    { icon: <Ticket className="w-4 h-4" />, label: 'Tickets', path: '/admin/tickets' }
  ];

  const isActivePath = (path) => location.pathname === path;

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-cyan-950 to-indigo-950">
      <style jsx global>{`
        * { --removed-focus-outline: none !important; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: rgba(0, 255, 255, 0.05); }
        ::-webkit-scrollbar-thumb { background: rgba(0, 255, 255, 0.3); border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(0, 255, 255, 0.5); }
      `}</style>

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-cyan-800/50 bg-gradient-to-r from-blue-900/80 via-cyan-900/80 to-blue-900/80 backdrop-blur-xl">
        <div className="flex h-14 items-center px-4">
          <div className="flex items-center gap-4 mr-6">
            <Link to="/dashboard" className="flex items-center gap-3 text-cyan-400 hover:text-cyan-300 transition-all">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-bold text-xl shadow-lg shadow-cyan-500/50">
                V
              </div>
              <span className="font-bold text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                VIZORA HOST
              </span>
            </Link>
            <Separator orientation="vertical" className="h-8 bg-cyan-700/50" />
          </div>

          {/* Main Navigation */}
          <nav className="flex items-center space-x-2">
            {[
              { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
              { to: "/account", icon: User, label: "Account" },
              { to: "/referrals", icon: Tags, label: "Referrals" },
              { to: "/tickets", icon: MessageCircleQuestion, label: "Support" },
            ].map((item) => (
              <Button
                key={item.to}
                variant={location.pathname === item.to ? "secondary" : "ghost"}
                size="sm"
                className={`${location.pathname === item.to 
                  ? "bg-cyan-600/30 text-cyan-300 border border-cyan-500/50" 
                  : "text-cyan-400 hover:text-cyan-200 hover:bg-cyan-800/30"} 
                  transition-all duration-200 backdrop-blur`}
                asChild
              >
                <Link to={item.to} className="flex items-center gap-2">
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              </Button>
            ))}
            {isAdmin && (
              <Button
                variant={location.pathname.startsWith('/admin/') ? "secondary" : "ghost"}
                size="sm"
                className={`flex items-center gap-2 ${location.pathname.startsWith('/admin/') 
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white" 
                  : "text-purple-400 hover:text-purple-300 hover:bg-purple-800/30"}`}
                asChild
              >
                <Link to="/admin/overview">
                  <Cog className="w-4 h-4" />
                  <span>Admin</span>
                </Link>
              </Button>
            )}
          </nav>

          {/* Right Section */}
          <div className="flex items-center ml-auto gap-4">
            {/* Coins */}
            <div className="relative group">
              <Button variant="ghost" size="sm" className="flex items-center gap-2 text-cyan-400 hover:bg-cyan-800/40 transition-all">
                <Coins className="w-4 h-4" />
                <span className="font-medium">{coinsBalance.toFixed(2)} coins</span>
              </Button>
              <div className="absolute right-0 w-72 mt-2 invisible translate-y-4 opacity-0 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                <div className="bg-gradient-to-br from-blue-900/95 to-cyan-900/95 border border-cyan-700/50 rounded-xl shadow-2xl backdrop-blur-xl p-3">
                  {[
                    { to: "/coins/afk", icon: Coffee, title: "AFK Page", desc: "Earn coins while being AFK" },
                    { to: "/coins/store", icon: Store, title: "Resources Store", desc: "Buy resources with your coins" },
                  ].map((item) => (
                    <Link key={item.to} to={item.to} className="flex items-start gap-3 p-3 rounded-lg hover:bg-cyan-800/40 transition-all">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center shadow-lg">
                        <item.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-cyan-200">{item.title}</p>
                        <p className="text-xs text-cyan-400">{item.desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Separator orientation="vertical" className="h-6 bg-cyan-700/50" />

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 text-cyan-400 hover:bg-cyan-800/40 transition-all">
                  <Avatar className="h-8 w-8 ring-2 ring-cyan-500/50">
                    <AvatarImage src="https://i.imgur.com/J4jb4zO.png" />
                    <AvatarFallback className="bg-gradient-to-br from-cyan-600 to-blue-700 text-white">U</AvatarFallback>
                  </Avatar>
                  <span className="hidden lg:inline font-medium">{userData.username}</span>
                  {isAdmin && <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs">Admin</Badge>}
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-gradient-to-br from-blue-900/95 to-cyan-900/95 border-cyan-700/50 backdrop-blur-xl">
                <DropdownMenuLabel className="text-cyan-400 text-xs font-mono">User {userData.id}</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-cyan-700/50" />
                <DropdownMenuItem className="text-cyan-300 hover:bg-cyan-800/50 cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" /> Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-red-400 hover:text-red-300 hover:bg-red-900/30 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Server Sidebar */}
        {showSidebar && (
          <aside className="w-64 min-h-[calc(100vh-3.5rem)] bg-gradient-to-b from-blue-900/50 to-cyan-900/30 border-r border-cyan-800/50 backdrop-blur-sm">
            <div className="p-4">
              <Button variant="ghost" size="sm" className="w-full justify-start text-cyan-400 hover:text-cyan-200 hover:bg-cyan-800/30" onClick={() => navigate('/dashboard')}>
                <ChevronLeft className="w-4 h-4 mr-2" /> Back to Dashboard
              </Button>

              <Card className="p-4 mt-4 bg-gradient-to-br from-blue-800/60 to-cyan-800/60 border-cyan-700/50 backdrop-blur">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Server className="w-5 h-5 text-cyan-300" />
                    <span className="font-bold text-white">{serverInfo.name || "Loading..."}</span>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-cyan-400 hover:bg-cyan-800/50">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-gradient-to-br from-blue-900 to-cyan-900 border-cyan-700">
                      {["start", "restart", "stop"].map((action) => (
                        <DropdownMenuItem key={action} onClick={() => handlePowerAction(action)} className="text-cyan-300 hover:bg-cyan-800/50">
                          {action === "start" && <Power className="w-4 h-4 mr-2" />}
                          {action === "restart" && <RotateCw className="w-4 h-4 mr-2" />}
                          {action === "stop" && <Square className="w-4 h-4 mr-2" />}
                          {action.charAt(0).toUpperCase() + action.slice(1)}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Badge variant={getStatusBadgeVariant(serverInfo.status)} className="mb-2">
                  {serverInfo.status?.toUpperCase() || "OFFLINE"}
                </Badge>
                <p className="text-xs text-cyan-300 font-mono">{serverInfo.ip}:{serverInfo.port}</p>
              </Card>

              <div className="mt-6 space-y-1">
                {mainSidebarNavItems.map((item) => (
                  <Button
                    key={item.label}
                    variant={isActivePath(item.path) ? "secondary" : "ghost"}
                    size="sm"
                    className={`w-full justify-start ${isActivePath(item.path) 
                      ? "bg-cyan-600/40 text-cyan-200 border border-cyan-500/50" 
                      : "text-cyan-400 hover:text-cyan-200 hover:bg-cyan-800/30"}`}
                    asChild
                  >
                    <Link to={item.path} className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  </Button>
                ))}
              </div>

              <div className="mt-6">
                <h3 className="text-xs font-bold text-cyan-500 uppercase tracking-wider mb-2 px-2">More</h3>
                {moreSidebarItems.map((item) => (
                  <Button
                    key={item.label}
                    variant={isActivePath(item.path) ? "secondary" : "ghost"}
                    size="sm"
                    className={`w-full justify-start ${isActivePath(item.path) 
                      ? "bg-cyan-600/40 text-cyan-200 border border-cyan-500/50" 
                      : "text-cyan-400 hover:text-cyan-200 hover:bg-cyan-800/30"}`}
                    asChild
                  >
                    <Link to={item.path} className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          </aside>
        )}

        {/* Admin Sidebar */}
        {showAdminSidebar && (
          <aside className="w-64 min-h-[calc(100vh-3.5rem)] bg-gradient-to-b from-purple-900/50 to-pink-900/30 border-r border-purple-700/50 backdrop-blur-sm">
            <div className="p-4">
              <Button variant="ghost" size="sm" className="w-full justify-start text-purple-400 hover:text-purple-200 hover:bg-purple-800/30" onClick={() => navigate('/dashboard')}>
                <ChevronLeft className="w-4 h-4 mr-2" /> Back to Dashboard
              </Button>
              <nav className="mt-6 space-y-1">
                {adminSidebarItems.map((item) => (
                  <Button
                    key={item.label}
                    variant={isActivePath(item.path) ? "secondary" : "ghost"}
                    size="sm"
                    className={`w-full justify-start ${isActivePath(item.path) 
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white" 
                      : "text-purple-400 hover:text-purple-200 hover:bg-purple-800/30"}`}
                    asChild
                  >
                    <Link to={item.path} className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  </Button>
                ))}
              </nav>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <AnimatePresence mode="wait">
          <main className={`flex-1 ${showSidebar || showAdminSidebar ? 'max-w-[calc(100%-16rem)]' : 'max-w-7xl mx-auto'} px-6 py-8`}>
            <PageTransition key={location.pathname}>
              <Outlet />
            </PageTransition>
          </main>
        </AnimatePresence>
      </div>
    </div>
  );
}
