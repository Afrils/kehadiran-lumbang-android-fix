
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Clock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import AttendanceHistory from "@/components/attendance/AttendanceHistory";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import { supabase, AttendanceType } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

interface AttendanceRecord {
  id: string;
  date: Date;
  checkIn: string;
  checkOut: string;
  status: string;
}

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(format(new Date(), 'HH:mm:ss'));
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkedOut, setCheckedOut] = useState(false);
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [statistics, setStatistics] = useState({
    total: 0,
    late: 0,
    absent: 0
  });
  
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    // Redirect if not logged in
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(format(new Date(), 'HH:mm:ss'));
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (user) {
      fetchAttendanceData();
      checkTodayAttendance();
    }
  }, [user]);

  const fetchAttendanceData = async () => {
    if (!user) return;
    
    try {
      // Get attendance for last 7 days
      const today = new Date();
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', sevenDaysAgo.toISOString().split('T')[0])
        .order('date', { ascending: false });
        
      if (error) throw error;
      
      if (data) {
        const formattedData = data.map(item => ({
          id: item.id,
          date: new Date(item.date),
          checkIn: item.check_in || '-',
          checkOut: item.check_out || '-',
          status: item.status
        }));
        
        setAttendanceData(formattedData);
      }
      
      // Get statistics for current month
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      
      const { data: monthData, error: monthError } = await supabase
        .from('attendance')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', firstDayOfMonth.toISOString().split('T')[0]);
        
      if (monthError) throw monthError;
      
      if (monthData) {
        const total = monthData.length;
        const late = monthData.filter(item => item.status === 'terlambat').length;
        const absent = monthData.filter(item => item.status === 'absen').length;
        
        setStatistics({
          total,
          late,
          absent
        });
      }
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    }
  };

  const checkTodayAttendance = async () => {
    if (!user) return;
    
    const today = new Date().toISOString().split('T')[0];
    
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single();
        
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned" error
      
      if (data) {
        setCheckedIn(!!data.check_in);
        setCheckedOut(!!data.check_out);
      }
    } catch (error) {
      console.error('Error checking today\'s attendance:', error);
    }
  };

  const handleCheckIn = async () => {
    if (!user) return;
    
    try {
      const now = new Date();
      const checkInTime = format(now, 'HH:mm');
      const today = now.toISOString().split('T')[0];
      
      // Determine if late (after 8:00)
      const isLate = now.getHours() > 8 || (now.getHours() === 8 && now.getMinutes() > 0);
      const status = isLate ? 'terlambat' : 'hadir';
      
      const { data, error } = await supabase
        .from('attendance')
        .insert([
          {
            user_id: user.id,
            date: today,
            check_in: checkInTime,
            status
          }
        ])
        .select();
        
      if (error) throw error;
      
      setCheckedIn(true);
      toast({
        title: "Check-in berhasil",
        description: `Anda check-in pada ${checkInTime}`,
      });
      
      // Update attendance history
      fetchAttendanceData();
    } catch (error) {
      console.error('Error registering check-in:', error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat check-in",
        variant: "destructive",
      });
    }
  };

  const handleCheckOut = async () => {
    if (!user) return;
    
    try {
      const now = new Date();
      const checkOutTime = format(now, 'HH:mm');
      const today = now.toISOString().split('T')[0];
      
      const { error } = await supabase
        .from('attendance')
        .update({ check_out: checkOutTime })
        .eq('user_id', user.id)
        .eq('date', today);
        
      if (error) throw error;
      
      setCheckedOut(true);
      toast({
        title: "Check-out berhasil",
        description: `Anda check-out pada ${checkOutTime}`,
      });
      
      // Update attendance history
      fetchAttendanceData();
    } catch (error) {
      console.error('Error registering check-out:', error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat check-out",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container max-w-4xl mx-auto flex justify-center items-center min-h-[50vh]">
          <p>Memuat...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-lumbang-dark">Dashboard Presensi</h1>
          <Button variant="outline" onClick={logout}>Keluar</Button>
        </div>
        
        <Card className="mb-6 border-l-4 border-l-lumbang-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Selamat Datang, {user?.name || 'Pengguna'}</CardTitle>
            <CardDescription>
              {format(currentDate, 'EEEE, d MMMM yyyy', { locale: id })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500">Jam Server</p>
                <p className="text-2xl font-mono font-bold animate-pulse-slow">{currentTime}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Button 
                  className="bg-lumbang-primary hover:bg-lumbang-accent flex-1" 
                  onClick={handleCheckIn}
                  disabled={checkedIn}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Check-In
                </Button>
                <Button 
                  className="bg-lumbang-secondary hover:bg-lumbang-primary flex-1" 
                  onClick={handleCheckOut}
                  disabled={!checkedIn || checkedOut}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Check-Out
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Kehadiran</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{statistics.total}</p>
              <p className="text-sm text-gray-500">Bulan ini</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Keterlambatan</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{statistics.late}</p>
              <p className="text-sm text-gray-500">Bulan ini</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Absensi</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{statistics.absent}</p>
              <p className="text-sm text-gray-500">Bulan ini</p>
            </CardContent>
          </Card>
        </div>
        
        <AttendanceHistory attendanceData={attendanceData} />
      </div>
    </Layout>
  );
};

export default Index;
