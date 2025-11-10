import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/api/axios';
import type { Room } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Users, Loader2 } from 'lucide-react';

const RoomsPage = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    checkIn: '',
    checkOut: '',
    capacity: '',
    roomType: ''
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.checkIn) params.append('checkIn', filters.checkIn);
      if (filters.checkOut) params.append('checkOut', filters.checkOut);
      if (filters.capacity) params.append('capacity', filters.capacity);
      if (filters.roomType) params.append('roomType', filters.roomType);

      const response = await api.get(`/rooms?${params.toString()}`);
      if (response.data.success) {
        setRooms(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchRooms();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Filters */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Tìm kiếm phòng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="checkIn">Ngày nhận phòng</Label>
              <Input
                id="checkIn"
                type="date"
                value={filters.checkIn}
                onChange={(e) => setFilters({ ...filters, checkIn: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="checkOut">Ngày trả phòng</Label>
              <Input
                id="checkOut"
                type="date"
                value={filters.checkOut}
                onChange={(e) => setFilters({ ...filters, checkOut: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity">Số người</Label>
              <Select value={filters.capacity} onValueChange={(value) => setFilters({ ...filters, capacity: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn số người" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 người</SelectItem>
                  <SelectItem value="2">2 người</SelectItem>
                  <SelectItem value="3">3 người</SelectItem>
                  <SelectItem value="4">4 người</SelectItem>
                  <SelectItem value="5">5+ người</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="roomType">Loại phòng</Label>
              <Select value={filters.roomType} onValueChange={(value) => setFilters({ ...filters, roomType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tất cả</SelectItem>
                  <SelectItem value="1">Standard</SelectItem>
                  <SelectItem value="2">Deluxe</SelectItem>
                  <SelectItem value="3">Suite</SelectItem>
                  <SelectItem value="4">Family</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={handleSearch} className="mt-4 w-full md:w-auto">
            <Search className="mr-2 h-4 w-4" />
            Tìm kiếm
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="mb-4">
            <p className="text-muted-foreground">
              Tìm thấy <span className="font-semibold text-foreground">{rooms.length}</span> phòng
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <Card key={room.room_id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-200 relative">
                  {room.images && room.images.length > 0 ? (
                    <img
                      src={room.images[0].image_url}
                      alt={`Phòng ${room.room_number}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      Không có ảnh
                    </div>
                  )}
                  <Badge className="absolute top-2 right-2">
                    {room.roomType?.type_name}
                  </Badge>
                </div>

                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Phòng {room.room_number}</span>
                    <Badge variant={room.status === 'available' ? 'default' : 'secondary'}>
                      {room.status === 'available' ? 'Trống' : 'Đã đặt'}
                    </Badge>
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{room.capacity} người</span>
                    </div>
                    <p className="text-sm line-clamp-2">{room.description}</p>
                    <div className="pt-2">
                      <p className="text-2xl font-bold text-primary">
                        {formatPrice(room.price_per_night)}
                        <span className="text-sm font-normal text-muted-foreground">/đêm</span>
                      </p>
                    </div>
                  </div>
                </CardContent>

                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={() => navigate(`/rooms/${room.room_id}`)}
                  >
                    Xem chi tiết
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {rooms.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Không tìm thấy phòng phù hợp</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RoomsPage;
