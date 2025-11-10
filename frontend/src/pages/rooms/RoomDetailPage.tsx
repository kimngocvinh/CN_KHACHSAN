import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import api from '@/api/axios';
import type { Room, Review } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Users, Wifi, Star, Loader2, Calendar } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface BookingForm {
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
}

const RoomDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [room, setRoom] = useState<Room | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<BookingForm>();

  useEffect(() => {
    fetchRoomDetail();
    fetchReviews();
  }, [id]);

  const fetchRoomDetail = async () => {
    try {
      const response = await api.get(`/rooms/${id}`);
      if (response.data.success) {
        setRoom(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching room:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await api.get(`/reviews/room/${id}`);
      if (response.data.success) {
        setReviews(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const onSubmit = async (data: BookingForm) => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    try {
      setBookingLoading(true);
      const response = await api.post('/bookings', {
        roomId: room?.room_id,
        ...data
      });

      if (response.data.success) {
        alert('Đặt phòng thành công!');
        setDialogOpen(false);
        navigate('/my-bookings');
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Đặt phòng thất bại');
    } finally {
      setBookingLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Không tìm thấy phòng</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Images */}
          <div className="grid grid-cols-2 gap-4">
            {room.images && room.images.length > 0 ? (
              room.images.map((img, idx) => (
                <div key={idx} className={`${idx === 0 ? 'col-span-2' : ''} aspect-video bg-gray-200 rounded-lg overflow-hidden`}>
                  <img src={img.image_url} alt={`Phòng ${room.room_number}`} className="w-full h-full object-cover" />
                </div>
              ))
            ) : (
              <div className="col-span-2 aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Không có ảnh</p>
              </div>
            )}
          </div>

          {/* Room Info */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-3xl">Phòng {room.room_number}</CardTitle>
                <Badge variant={room.status === 'available' ? 'default' : 'secondary'}>
                  {room.status === 'available' ? 'Còn trống' : 'Đã đặt'}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {room.capacity} người
                </span>
                <Badge variant="outline">{room.roomType?.type_name}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Mô tả</h3>
                <p className="text-muted-foreground">{room.description}</p>
              </div>

              {room.amenities && room.amenities.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Tiện nghi</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {room.amenities.map((amenity, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <Wifi className="h-4 w-4 text-primary" />
                        <span>{amenity.amenity_name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Reviews */}
          <Card>
            <CardHeader>
              <CardTitle>Đánh giá ({reviews.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review.review_id} className="border-b pb-4 last:border-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="font-semibold">{review.user?.full_name}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">Chưa có đánh giá</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Booking Card */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">
                {formatPrice(room.price_per_night)}
                <span className="text-sm font-normal text-muted-foreground">/đêm</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full" size="lg" disabled={room.status !== 'available'}>
                    <Calendar className="mr-2 h-4 w-4" />
                    {room.status === 'available' ? 'Đặt phòng ngay' : 'Phòng không khả dụng'}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Đặt phòng {room.room_number}</DialogTitle>
                    <DialogDescription>
                      Vui lòng điền thông tin đặt phòng
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="checkInDate">Ngày nhận phòng</Label>
                      <Input
                        id="checkInDate"
                        type="date"
                        {...register('checkInDate', { required: 'Vui lòng chọn ngày nhận phòng' })}
                      />
                      {errors.checkInDate && (
                        <p className="text-sm text-red-600">{errors.checkInDate.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="checkOutDate">Ngày trả phòng</Label>
                      <Input
                        id="checkOutDate"
                        type="date"
                        {...register('checkOutDate', { required: 'Vui lòng chọn ngày trả phòng' })}
                      />
                      {errors.checkOutDate && (
                        <p className="text-sm text-red-600">{errors.checkOutDate.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="numberOfGuests">Số người</Label>
                      <Input
                        id="numberOfGuests"
                        type="number"
                        min="1"
                        max={room.capacity}
                        {...register('numberOfGuests', { 
                          required: 'Vui lòng nhập số người',
                          min: { value: 1, message: 'Tối thiểu 1 người' },
                          max: { value: room.capacity, message: `Tối đa ${room.capacity} người` }
                        })}
                      />
                      {errors.numberOfGuests && (
                        <p className="text-sm text-red-600">{errors.numberOfGuests.message}</p>
                      )}
                    </div>

                    <Button type="submit" className="w-full" disabled={bookingLoading}>
                      {bookingLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Xác nhận đặt phòng
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RoomDetailPage;
