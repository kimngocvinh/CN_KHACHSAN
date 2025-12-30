import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Phone, Clock, CheckCircle, Loader2, Trash2 } from 'lucide-react';
import api from '@/api/axios';
import { useAuthStore } from '@/store/authStore';

interface SupportRequest {
  request_id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'pending' | 'processing' | 'resolved' | 'closed';
  created_at: string;
}

const SupportManagement = () => {
  const [requests, setRequests] = useState<SupportRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'Admin' || user?.role === 'Quản trị viên';

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await api.get('/support');
      if (response.data.success) {
        setRequests(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching support requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (requestId: number, status: string) => {
    try {
      const response = await api.put(`/support/${requestId}/status`, { status });
      if (response.data.success) {
        fetchRequests();
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Cập nhật trạng thái thất bại');
    }
  };

  const deleteRequest = async (requestId: number) => {
    if (!confirm('Bạn có chắc muốn xóa yêu cầu hỗ trợ này?')) return;
    
    try {
      const response = await api.delete(`/support/${requestId}`);
      if (response.data.success) {
        fetchRequests();
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Xóa yêu cầu thất bại');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Chờ xử lý', variant: 'default' as const, color: 'bg-yellow-100 text-yellow-800' },
      processing: { label: 'Đang xử lý', variant: 'secondary' as const, color: 'bg-blue-100 text-blue-800' },
      resolved: { label: 'Đã giải quyết', variant: 'default' as const, color: 'bg-green-100 text-green-800' },
      closed: { label: 'Đã đóng', variant: 'outline' as const, color: 'bg-gray-100 text-gray-800' }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredRequests = filter === 'all' 
    ? requests 
    : requests.filter(req => req.status === filter);

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    processing: requests.filter(r => r.status === 'processing').length,
    resolved: requests.filter(r => r.status === 'resolved').length
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Quản Lý Yêu Cầu Hỗ Trợ</h1>
        <p className="text-muted-foreground">
          Xem và xử lý các yêu cầu hỗ trợ từ khách hàng
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tổng số</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Mail className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Chờ xử lý</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Đang xử lý</p>
                <p className="text-2xl font-bold text-blue-600">{stats.processing}</p>
              </div>
              <Loader2 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Đã giải quyết</p>
                <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Danh sách yêu cầu</CardTitle>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="pending">Chờ xử lý</SelectItem>
                <SelectItem value="processing">Đang xử lý</SelectItem>
                <SelectItem value="resolved">Đã giải quyết</SelectItem>
                <SelectItem value="closed">Đã đóng</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {/* Requests List */}
      {loading ? (
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        </div>
      ) : filteredRequests.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            Không có yêu cầu nào
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <Card key={request.request_id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{request.subject}</h3>
                      {getStatusBadge(request.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {request.email}
                      </span>
                      {request.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          {request.phone}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatDate(request.created_at)}
                      </span>
                    </div>
                    <p className="text-sm mb-4">{request.message}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t">
                  {isAdmin ? (
                    <>
                      <span className="text-sm font-medium mr-2">Cập nhật trạng thái:</span>
                      <Button
                        size="sm"
                        variant={request.status === 'pending' ? 'default' : 'outline'}
                        onClick={() => updateStatus(request.request_id, 'pending')}
                      >
                        Chờ xử lý
                      </Button>
                      <Button
                        size="sm"
                        variant={request.status === 'processing' ? 'default' : 'outline'}
                        onClick={() => updateStatus(request.request_id, 'processing')}
                      >
                        Đang xử lý
                      </Button>
                      <Button
                        size="sm"
                        variant={request.status === 'resolved' ? 'default' : 'outline'}
                        onClick={() => updateStatus(request.request_id, 'resolved')}
                      >
                        Đã giải quyết
                      </Button>
                      <Button
                        size="sm"
                        variant={request.status === 'closed' ? 'default' : 'outline'}
                        onClick={() => updateStatus(request.request_id, 'closed')}
                      >
                        Đóng
                      </Button>
                      <div className="flex-1" />
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteRequest(request.request_id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Xóa
                      </Button>
                    </>
                  ) : (
                    <span className="text-sm text-muted-foreground">Chỉ Admin mới có thể cập nhật trạng thái</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SupportManagement;
