import { useState, useEffect } from 'react';
import api from '@/api/axios';
import type { Booking } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar, DollarSign, Users, Loader2, Star, X } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface ReviewForm {
  rating: number;
  comment: string;
}

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState(5);
  const { register, handleSubmit, reset } = useForm<ReviewForm>();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings/my-bookings');
      if (response.data.success) {
        setBookings(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
    if (!confirm('Bạn có chắc muốn hủy đặt phòng này?')) return;

    try {
      const response = await api.put(`/bookings/${bookingId}/cancel`);
      if (response.data.success) {
        alert('Hủy đặt phòng thành công');
        fetchBookings();
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Hủy đặt phòng thất bại');
    }
  };

  const handleReview = (booking: Booking) => {
    setSelectedBooking(booking);
    setReviewDialogOpen(true);
    reset();
  };

  const onSubmitReview = async (data: ReviewForm) => {
    try {
      const response = await api.post('/reviews', {
        bookingId: selectedBooking?.booking_id,
        rating: selectedRating,
        comment: data.comment
      });

      if (response.data.success) {
        alert('Đánh giá thành công!');
        setReviewDialogOpen(false);
        fetchBookings();
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Đánh giá thất bại');
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Đặt phòng của tôi</h1>

      {bookings.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Bạn chưa có đặt phòng nào</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <Card key={booking.booking_id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Phòng {booking.room?.room_number}</CardTitle>
                  {getStatusBadge(booking.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Nhận phòng: {formatDate(booking.check_in_date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Trả phòng: {formatDate(booking.check_out_date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{booking.number_of_guests} người</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold">{formatPrice(booking.total_price)}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Đặt ngày: {formatDate(booking.booking_date)}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  {(booking.status === 'pending' || booking.status === 'confirmed') && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleCancelBooking(booking.booking_id)}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Hủy đặt phòng
                    </Button>
                  )}
                  {booking.status === 'checked_out' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReview(booking)}
                    >
                      <Star className="mr-2 h-4 w-4" />
                      Đánh giá
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Đánh giá phòng</DialogTitle>
            <DialogDescription>
              Chia sẻ trải nghiệm của bạn về phòng {selectedBooking?.room?.room_number}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmitReview)} className="space-y-4">
            <div className="space-y-2">
              <Label>Đánh giá</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setSelectedRating(rating)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        rating <= selectedRating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment">Nhận xét</Label>
              <Textarea
                id="comment"
                placeholder="Chia sẻ trải nghiệm của bạn..."
                {...register('comment')}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setReviewDialogOpen(false)}>
                Hủy
              </Button>
              <Button type="submit">Gửi đánh giá</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyBookingsPage;
