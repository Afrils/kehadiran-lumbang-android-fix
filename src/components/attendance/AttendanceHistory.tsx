
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface AttendanceRecord {
  id: string | number;
  date: Date;
  checkIn: string;
  checkOut: string;
  status: string;
}

interface AttendanceHistoryProps {
  attendanceData: AttendanceRecord[];
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "hadir":
      return <Badge className="bg-green-500">Hadir</Badge>;
    case "terlambat":
      return <Badge className="bg-amber-500">Terlambat</Badge>;
    case "absen":
      return <Badge variant="destructive">Absen</Badge>;
    default:
      return <Badge variant="outline">-</Badge>;
  }
};

const AttendanceHistory = ({ attendanceData }: AttendanceHistoryProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Riwayat Kehadiran</CardTitle>
        <CardDescription>Riwayat kehadiran 7 hari terakhir</CardDescription>
      </CardHeader>
      <CardContent>
        {attendanceData.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Check-In</TableHead>
                  <TableHead>Check-Out</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceData.map((record) => (
                  <TableRow key={record.id.toString()}>
                    <TableCell>
                      {format(record.date, 'EEE, d MMMM yyyy', { locale: id })}
                    </TableCell>
                    <TableCell>{record.checkIn}</TableCell>
                    <TableCell>{record.checkOut}</TableCell>
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500">Belum ada riwayat kehadiran</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AttendanceHistory;
