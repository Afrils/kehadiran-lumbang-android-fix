
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Clock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import AttendanceHistory from "@/components/attendance/AttendanceHistory";
import { format } from "date-fns";
import { id } from "date-fns/locale";

// Temporary mock data until Supabase integration
const mockAttendance = [
  { id: 1, date: new Date(2023, 4, 4), checkIn: "07:45", checkOut: "16:05", status: "hadir" },
  { id: 2, date: new Date(2023, 4, 3), checkIn: "07:30", checkOut: "16:00", status: "hadir" },
  { id: 3, date: new Date(2023, 4, 2), checkIn: "08:10", checkOut: "16:15", status: "terlambat" },
  { id: 4, date: new Date(2023, 4, 1), checkIn: "07:55", checkOut: "16:00", status: "hadir" },
];

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(format(new Date(), 'HH:mm:ss'));
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkedOut, setCheckedOut] = useState(false);
  const [attendanceData, setAttendanceData] = useState(mockAttendance);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    
    if (!isLoggedIn) {
      navigate("/login");
    }
    
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(format(new Date(), 'HH:mm:ss'));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [navigate]);

  const handleCheckIn = () => {
    // In a real application, this would send data to Supabase
    setCheckedIn(true);
    toast({
      title: "Check-in berhasil",
      description: `Anda check-in pada ${currentTime}`,
    });
    
    // Update attendance history
    const newAttendance = {
      id: attendanceData.length + 1,
      date: new Date(),
      checkIn: format(new Date(), 'HH:mm'),
      checkOut: "-",
      status: "hadir"
    };
    
    setAttendanceData([newAttendance, ...attendanceData]);
  };

  const handleCheckOut = () => {
    // In a real application, this would update data in Supabase
    setCheckedOut(true);
    toast({
      title: "Check-out berhasil",
      description: `Anda check-out pada ${currentTime}`,
    });
    
    // Update attendance history
    const updatedAttendance = attendanceData.map((item, index) => {
      if (index === 0) {
        return { ...item, checkOut: format(new Date(), 'HH:mm') };
      }
      return item;
    });
    
    setAttendanceData(updatedAttendance);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  return (
    <Layout>
      <div className="container max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-lumbang-dark">Dashboard Presensi</h1>
          <Button variant="outline" onClick={handleLogout}>Keluar</Button>
        </div>
        
        <Card className="mb-6 border-l-4 border-l-lumbang-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Selamat Datang, Pengguna</CardTitle>
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
              <p className="text-3xl font-bold">23</p>
              <p className="text-sm text-gray-500">Bulan ini</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Keterlambatan</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">2</p>
              <p className="text-sm text-gray-500">Bulan ini</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Absensi</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">0</p>
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
