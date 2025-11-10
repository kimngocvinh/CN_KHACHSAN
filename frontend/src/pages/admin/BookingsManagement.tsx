import { useState, useEffect } from 'react';
import api from '@/api/axios';
import type { Booking } from '@/types';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Filter } from 'lucide-react';

const BookingsManagement = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    fetchBookings();
  }, [statusFilter, dateFilter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (dateFilter) params.append('date', dateFilter);

      const response = await api.get(`/bookings?${params.toString()}`);
      if (response.data.success) {
        setBookings(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (bookingId: number, status: string) => {
    try {
      await api.put(`/bookings/${bookingId}/status`, { status });
      alert('Cập nhật trạng thái thành công!');
      fetchBookings();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Cập nhật thất bại');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      pending: { variant: 'secondary', label: 'Chờ xác nhận' },
      confirmed: { variant: 'default', label: 'Đã xác nhận' },
      checked_in: { variant: 'default', label: 'Đã nhận phòng' },
      checked_out: { variant: 'outline', label: 'Đã trả phòng' },
      cancelled: { variant: 'destructive', label: 'Đã hủy' }
    };
    const config = variants[status] || variants.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Quản lý đặt phòng</h1>

      {/* Filters */}
      <div className="bg-white rounded-lg border p-4 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <h2 className="font-semibold">Bộ lọc</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Trạng thái</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tất cả" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tất cả</SelectItem>
                <SelectItem value="pending">Chờ xác nhận</SelectItem>
                <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                <SelectItem value="checked_in">Đã nhận phòng</SelectItem>
                <SelectItem value="checked_out">Đã trả phòng</SelectItem>
                <SelectItem value="cancelled">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Ngày</Label>
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>

          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={() => {
                setStatusFilter('');
                setDateFilter('');
              }}
            >
              Xóa bộ lọc
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Khách hàng</TableHead>
              <TableHead>Phòng</TableHead>
              <TableHead>Nhận phòng</TableHead>
              <TableHead>Trả phòng</TableHead>
              <TableHead>Số người</TableHead>
              <TableHead>Tổng tiền</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.booking_id}>
                <TableCell className="font-medium">#{booking.booking_id}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{booking.user?.full_name}</p>
                    <p className="text-xs text-muted-foreground">{booking.user?.email}</p>
                  </div>
                </TableCell>
                <TableCell>{booking.room?.room_number}</TableCell>
                <TableCell>{formatDate(booking.check_in_date)}</TableCell>
                <TableCell>{formatDate(booking.check_out_date)}</TableCell>
                <TableCell>{booking.number_of_guests}</TableCell>
                <TableCell className="font-semibold">{formatPrice(booking.total_price)}</TableCell>
                <TableCell>{getStatusBadge(booking.status)}</TableCell>
                <TableCell>
                  <Select
                    value={booking.status}
                    onValueChange={(value) => handleUpdateStatus(booking.booking_id, value)}
                  >
                    <SelectTrigger className="w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Chờ xác nhận</SelectItem>
                      <SelectItem value="confirmed">Xác nhận</SelectItem>
                      <SelectItem value="checked_in">Check-in</SelectItem>
                      <SelectItem value="checked_out">Check-out</SelectItem>
                      <SelectItem value="cancelled">Hủy</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {bookings.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            Không có đặt phòng nào
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsManagement;
