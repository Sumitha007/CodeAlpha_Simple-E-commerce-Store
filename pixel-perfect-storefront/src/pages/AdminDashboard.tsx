import { useEffect, useMemo, useState } from "react";
import { adminLogout, getAdminToken, getAdminUser } from "@/lib/adminAuthStore";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, LogOut, Sparkles, TrendingUp, Users, ShoppingCart, DollarSign, Flame } from "lucide-react";

interface DashboardStats {
  overview: {
    totalUsers: number;
    totalOrders: number;
    totalRevenue: string;
    averageOrderValue: string;
  };
  leadQualityDistribution: {
    hot: number;
    warm: number;
    cold: number;
  };
  leadSourceBreakdown: Array<{ _id: string; count: number }>;
}

interface AdminUserRow {
  _id: string;
  name: string;
  email: string;
  totalTimeSpentFormatted: string;
  leadSource: string;
  lastActivityFormatted: string;
  leadQuality: "hot" | "warm" | "cold";
  predictedLeadQuality: "hot" | "warm" | "cold";
  tags: string[];
  totalOrders: number;
  // New 10 fields
  leadOrigin?: string;
  hearAboutUs?: string;
  coursePreferences?: string[];
  leadProfile?: string;
  lastNotableActivity?: {
    activity: string;
    timestamp: string;
  };
}

interface AnalysisResponse {
  prediction: {
    leadQuality: "hot" | "warm" | "cold";
    emoji: string;
    confidence: string;
    reasoning: string[];
  };
}

const qualityTone: Record<string, string> = {
  hot: "bg-red-900 text-red-300 border-red-700",
  warm: "bg-amber-900 text-amber-300 border-amber-700",
  cold: "bg-blue-900 text-blue-300 border-blue-700",
};

const LeadQualityChart = ({ data }: { data: { hot: number; warm: number; cold: number } }) => {
  const total = data.hot + data.warm + data.cold || 1;
  const hotPercent = (data.hot / total) * 100;
  const warmPercent = (data.warm / total) * 100;
  const coldPercent = (data.cold / total) * 100;

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          Lead Quality Distribution
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-red-400">🔥 Hot Leads</span>
            <span className="font-bold text-red-300">{data.hot}</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div className="bg-red-600 h-2 rounded-full" style={{ width: `${hotPercent}%` }} />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-amber-400">⚡ Warm Leads</span>
            <span className="font-bold text-amber-300">{data.warm}</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div className="bg-amber-600 h-2 rounded-full" style={{ width: `${warmPercent}%` }} />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-cyan-400">❄️ Cold Leads</span>
            <span className="font-bold text-cyan-300">{data.cold}</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div className="bg-cyan-600 h-2 rounded-full" style={{ width: `${coldPercent}%` }} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [analysisByUser, setAnalysisByUser] = useState<Record<string, AnalysisResponse["prediction"]>>({});

  const admin = getAdminUser();

  const authHeaders = useMemo(() => {
    const token = getAdminToken();
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }, []);

  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      navigate("/admin/login", { replace: true });
      return;
    }

    const fetchData = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          fetch("http://localhost:5000/api/admin/dashboard/stats", { headers: authHeaders }),
          fetch("http://localhost:5000/api/admin/users?limit=50", { headers: authHeaders }),
        ]);

        if (!statsRes.ok || !usersRes.ok) {
          throw new Error("Failed to load admin dashboard data");
        }

        const statsData = await statsRes.json();
        const usersData = await usersRes.json();

        setStats(statsData);
        setUsers(usersData.users || []);
      } catch {
        adminLogout();
        navigate("/admin/login", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, [authHeaders, navigate]);

  const handleAnalyzeUser = async (userId: string) => {
    setAnalyzingId(userId);
    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/analyze`, {
        method: "POST",
        headers: authHeaders,
      });

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const data: AnalysisResponse = await response.json();
      setAnalysisByUser((prev) => ({
        ...prev,
        [userId]: data.prediction,
      }));
    } catch {
      // No-op
    } finally {
      setAnalyzingId(null);
    }
  };

  const handleLogout = () => {
    adminLogout();
    navigate("/admin/login", { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-slate-400 mt-1">Welcome, {admin?.name}. Monitor users and run ML-powered lead analysis.</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Users className="h-4 w-4 text-cyan-500" />
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats?.overview.totalUsers ?? 0}</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-green-500" />
                Total Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats?.overview.totalOrders ?? 0}</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Flame className="h-4 w-4 text-red-500" />
                Hot Leads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-400">{stats?.leadQualityDistribution.hot ?? 0}</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-yellow-500" />
                Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400">${stats?.overview.totalRevenue ?? "0.00"}</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Analytics */}
        <div className="grid gap-4 lg:grid-cols-2">
          <LeadQualityChart data={stats?.leadQualityDistribution || { hot: 0, warm: 0, cold: 0 }} />
          
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                <span className="text-slate-300">Avg Order Value</span>
                <span className="font-bold text-green-400">${stats?.overview.averageOrderValue ?? "0.00"}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                <span className="text-slate-300">Warm Leads</span>
                <span className="font-bold text-amber-400">{stats?.leadQualityDistribution.warm ?? 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                <span className="text-slate-300">Cold Leads</span>
                <span className="font-bold text-cyan-400">{stats?.leadQualityDistribution.cold ?? 0}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card className="bg-slate-800 border-slate-700 overflow-hidden">
          <CardHeader className="bg-slate-900 border-b border-slate-700">
            <CardTitle className="text-white">User Analytics & ML Predictions</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-800">
                  <TableRow className="border-b border-slate-700 hover:bg-slate-800">
                    <TableHead className="text-slate-300">User</TableHead>
                    <TableHead className="text-slate-300">Lead Origin</TableHead>
                    <TableHead className="text-slate-300">Lead Source</TableHead>
                    <TableHead className="text-slate-300">Heard About</TableHead>
                    <TableHead className="text-slate-300">Profile</TableHead>
                    <TableHead className="text-slate-300">Interests</TableHead>
                    <TableHead className="text-slate-300">Time Spent</TableHead>
                    <TableHead className="text-slate-300">Orders</TableHead>
                    <TableHead className="text-slate-300">Lead Quality</TableHead>
                    <TableHead className="text-slate-300">Last Activity</TableHead>
                    <TableHead className="text-right text-slate-300">Analyze</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => {
                    const analysis = analysisByUser[user._id];
                    const quality = (analysis?.leadQuality || user.predictedLeadQuality || user.leadQuality || "cold").toLowerCase();
                    const emoji = analysis?.emoji || (quality === "hot" ? "🔥" : quality === "warm" ? "⚡" : "❄️");

                    return (
                      <TableRow key={user._id} className="border-b border-slate-700 hover:bg-slate-700 transition-colors">
                        <TableCell>
                          <div className="font-medium text-slate-100">{user.name}</div>
                          <div className="text-xs text-slate-500">{user.email}</div>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-slate-700 text-slate-200 border-slate-600 text-xs">
                            {user.leadOrigin || "N/A"}
                          </Badge>
                        </TableCell>
                        <TableCell className="capitalize text-slate-300">{user.leadSource || "direct"}</TableCell>
                        <TableCell className="text-slate-300 text-sm max-w-[120px] truncate">
                          {user.hearAboutUs || "N/A"}
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-blue-900 text-blue-300 border-blue-700 text-xs">
                            {user.leadProfile || "N/A"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {user.coursePreferences?.length ? (
                              user.coursePreferences.slice(0, 2).map((pref) => (
                                <Badge key={pref} variant="secondary" className="bg-slate-700 text-slate-200 border-slate-600 text-xs">
                                  {pref}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-slate-500 text-sm">-</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-300">{user.totalTimeSpentFormatted || "0m"}</TableCell>
                        <TableCell className="text-slate-300 font-medium">{user.totalOrders || 0}</TableCell>
                        <TableCell>
                          <Badge className={`${qualityTone[quality] || qualityTone.cold} border`}>
                            {emoji} {quality}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-300 text-sm">
                          {user.lastNotableActivity?.activity || "N/A"}
                          <div className="text-xs text-slate-500">{user.lastActivityFormatted || "-"}</div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            onClick={() => void handleAnalyzeUser(user._id)}
                            disabled={analyzingId === user._id}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            {analyzingId === user._id ? (
                              <>
                                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                Analyzing
                              </>
                            ) : (
                              <>
                                <Sparkles className="h-3 w-3 mr-1" />
                                Analyze
                              </>
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              {users.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                  <p>No users found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
