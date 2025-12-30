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
import { Textarea } from '@/components/ui/textarea';
import { Users, Wifi, Star, Loader2, Calendar, Tag, Check, CreditCard, Banknote, Copy, QrCode } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface BookingForm {
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  promoCode?: string;
  paymentMethod: 'cash' | 'payos';
}

interface ReviewForm {
  rating: number;
  comment: string;
}

interface BookedDate {
  check_in_date: string;
  check_out_date: string;
}

const RoomDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [room, setRoom] = useState<Room | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [bookedDates, setBookedDates] = useState<BookedDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [dateError, setDateError] = useState('');
  const [promoDiscount, setPromoDiscount] = useState<number | null>(null);
  const [promoError, setPromoError] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'payos'>('cash');
  const [showBankInfo, setShowBankInfo] = useState(false);
  const [bankInfo, setBankInfo] = useState<any>(null);
  const { register, handleSubmit, formState: { errors }, watch } = useForm<BookingForm>();
  const { register: registerReview, handleSubmit: handleSubmitReview, formState: { errors: reviewErrors }, reset: resetReview, setValue: setReviewValue, watch: watchReview } = useForm<ReviewForm>({
    defaultValues: {
      rating: 0,
      comment: ''
    }
  });
  const currentRating = watchReview('rating');
  const watchCheckIn = watch('checkInDate');
  const watchCheckOut = watch('checkOutDate');

  useEffect(() => {
    fetchRoomDetail();
    fetchReviews();
    fetchBookedDates();
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

  const fetchBookedDates = async () => {
    try {
      const response = await api.get(`/rooms/${id}/booked-dates`);
      if (response.data.success) {
        setBookedDates(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching booked dates:', error);
    }
  };

  // Kiểm tra ngày có bị trùng với booking khác không
  const checkDateConflict = (checkIn: string, checkOut: string) => {
    if (!checkIn || !checkOut) return false;
    
    const newCheckIn = new Date(checkIn);
    const newCheckOut = new Date(checkOut);
    
    for (const booked of bookedDates) {
      const bookedIn = new Date(booked.check_in_date);
      const bookedOut = new Date(booked.check_out_date);
      
      // Kiểm tra overlap
      if (newCheckIn < bookedOut && newCheckOut > bookedIn) {
        return true;
      }
    }
    return false;
  };

  // Kiểm tra khi ngày thay đổi
  useEffect(() => {
    if (watchCheckIn && watchCheckOut) {
      if (checkDateConflict(watchCheckIn, watchCheckOut)) {
        setDateError('Phòng đã được đặt trong khoảng thời gian này. Vui lòng chọn ngày khác.');
      } else {
        setDateError('');
      }
    }
  }, [watchCheckIn, watchCheckOut, bookedDates]);

  const checkPromoCode = async (code: string) => {
    if (!code.trim()) {
      setPromoDiscount(null);
      setPromoError('');
      return;
    }
    
    try {
      setPromoLoading(true);
      setPromoError('');
      const response = await api.get(`/promotions/validate/${code}`);
      if (response.data.success) {
        setPromoDiscount(response.data.data.discountPercentage);
      }
    } catch (error: any) {
      setPromoDiscount(null);
      setPromoError(error.response?.data?.message || 'Mã không hợp lệ');
    } finally {
      setPromoLoading(false);
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
        ...data,
        promoCode: data.promoCode?.trim() || undefined,
        paymentMethod: paymentMethod
      });

      if (response.data.success) {
        // Nếu chuyển khoản, hiển thị thông tin ngân hàng
        if (paymentMethod === 'payos' && response.data.data.bankInfo) {
          setBankInfo(response.data.data.bankInfo);
          setShowBankInfo(true);
          return;
        }
        
        alert(response.data.message);
        setDialogOpen(false);
        navigate('/my-bookings');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Đặt phòng thất bại';
      alert(errorMessage);
    } finally {
      setBookingLoading(false);
    }
  };

  const onSubmitReview = async (data: ReviewForm) => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    if (data.rating === 0) {
      alert('Vui lòng chọn số sao đánh giá');
      return;
    }

    try {
      setReviewLoading(true);
      const response = await api.post('/reviews', {
        roomId: room?.room_id,
        rating: data.rating,
        comment: data.comment
      });

      if (response.data.success) {
        alert('Đánh giá thành công!');
        setReviewDialogOpen(false);
        resetReview();
        
        // Thêm review mới vào đầu danh sách ngay lập tức
        const newReview = response.data.data;
        setReviews([newReview, ...reviews]);
        
        // Reload để đảm bảo sync với server
        await fetchReviews();
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Đánh giá thất bại');
    } finally {
      setReviewLoading(false);
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
                  <img 
                    src={img.image_url.startsWith('/uploads') 
                      ? `http://localhost:8080${img.image_url}` 
                      : img.image_url} 
                    alt={`Phòng ${room.room_number}`} 
                    className="w-full h-full object-cover" 
                  />
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
              <div className="flex items-center justify-between">
                <CardTitle>Đánh giá ({reviews.length})</CardTitle>
                {isAuthenticated() && (
                  <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Star className="mr-2 h-4 w-4" />
                        Viết đánh giá
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Đánh giá phòng {room.room_number}</DialogTitle>
                        <DialogDescription>
                          Chia sẻ trải nghiệm của bạn về phòng này
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleSubmitReview(onSubmitReview)} className="space-y-4">
                        <div className="space-y-2">
                          <Label>Đánh giá của bạn</Label>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setReviewValue('rating', star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                className="focus:outline-none"
                              >
                                <Star
                                  className={`h-8 w-8 transition-colors ${
                                    star <= (hoverRating || currentRating)
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                          {reviewErrors.rating && (
                            <p className="text-sm text-red-600">Vui lòng chọn số sao</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="comment">Nhận xét</Label>
                          <Textarea
                            id="comment"
                            placeholder="Chia sẻ trải nghiệm của bạn..."
                            rows={4}
                            {...registerReview('comment', { required: 'Vui lòng nhập nhận xét' })}
                          />
                          {reviewErrors.comment && (
                            <p className="text-sm text-red-600">{reviewErrors.comment.message}</p>
                          )}
                        </div>

                        <Button type="submit" className="w-full" disabled={reviewLoading}>
                          {reviewLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Gửi đánh giá
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
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
                        min={new Date().toISOString().split('T')[0]}
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
                        min={watchCheckIn || new Date().toISOString().split('T')[0]}
                        {...register('checkOutDate', { required: 'Vui lòng chọn ngày trả phòng' })}
                      />
                      {errors.checkOutDate && (
                        <p className="text-sm text-red-600">{errors.checkOutDate.message}</p>
                      )}
                    </div>

                    {dateError && (
                      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                        {dateError}
                      </div>
                    )}

                    {bookedDates.length > 0 && (
                      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg text-sm">
                        <p className="font-medium mb-1">Các ngày đã được đặt:</p>
                        <ul className="list-disc list-inside">
                          {bookedDates.map((b, i) => (
                            <li key={i}>
                              {new Date(b.check_in_date).toLocaleDateString('vi-VN')} - {new Date(b.check_out_date).toLocaleDateString('vi-VN')}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

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

                    <div className="space-y-2">
                      <Label htmlFor="promoCode">Mã khuyến mãi (nếu có)</Label>
                      <div className="flex gap-2">
                        <Input
                          id="promoCode"
                          placeholder="Nhập mã giảm giá"
                          {...register('promoCode')}
                        />
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => {
                            const code = (document.getElementById('promoCode') as HTMLInputElement)?.value;
                            checkPromoCode(code);
                          }}
                          disabled={promoLoading}
                        >
                          {promoLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Tag className="h-4 w-4" />}
                        </Button>
                      </div>
                      {promoError && (
                        <p className="text-sm text-red-600">{promoError}</p>
                      )}
                      {promoDiscount && (
                        <div className="flex items-center gap-2 text-green-600 text-sm">
                          <Check className="h-4 w-4" />
                          <span>Giảm {promoDiscount}% cho đơn đặt phòng này!</span>
                        </div>
                      )}
                    </div>

                    {watchCheckIn && watchCheckOut && room && (
                      <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Giá phòng/đêm:</span>
                          <span>{formatPrice(room.price_per_night)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Số đêm:</span>
                          <span>{Math.ceil((new Date(watchCheckOut).getTime() - new Date(watchCheckIn).getTime()) / (1000 * 60 * 60 * 24))} đêm</span>
                        </div>
                        {promoDiscount && (
                          <div className="flex justify-between text-sm text-green-600">
                            <span>Giảm giá:</span>
                            <span>-{promoDiscount}%</span>
                          </div>
                        )}
                        <div className="flex justify-between font-bold border-t pt-2">
                          <span>Tổng cộng:</span>
                          <span className="text-primary">
                            {formatPrice(
                              room.price_per_night * 
                              Math.ceil((new Date(watchCheckOut).getTime() - new Date(watchCheckIn).getTime()) / (1000 * 60 * 60 * 24)) *
                              (promoDiscount ? (1 - promoDiscount / 100) : 1)
                            )}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      <Label>Phương thức thanh toán</Label>
                      <RadioGroup 
                        value={paymentMethod} 
                        onValueChange={(value: 'cash' | 'payos') => setPaymentMethod(value)}
                        className="space-y-2"
                      >
                        <div 
                          className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                            paymentMethod === 'cash' ? 'border-primary bg-blue-50' : 'hover:bg-gray-50'
                          }`}
                          onClick={() => setPaymentMethod('cash')}
                        >
                          <RadioGroupItem value="cash" id="cash" />
                          <Banknote className="h-5 w-5 text-green-600" />
                          <div className="flex-1">
                            <Label htmlFor="cash" className="cursor-pointer font-medium">
                              Thanh toán khi nhận phòng
                            </Label>
                            <p className="text-xs text-muted-foreground">
                              Thanh toán tiền mặt tại quầy lễ tân
                            </p>
                          </div>
                        </div>
                        
                        <div 
                          className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                            paymentMethod === 'payos' ? 'border-primary bg-blue-50' : 'hover:bg-gray-50'
                          }`}
                          onClick={() => setPaymentMethod('payos')}
                        >
                          <RadioGroupItem value="payos" id="payos" />
                          <CreditCard className="h-5 w-5 text-blue-600" />
                          <div className="flex-1">
                            <Label htmlFor="payos" className="cursor-pointer font-medium">
                              Chuyển khoản ngân hàng
                            </Label>
                            <p className="text-xs text-muted-foreground">
                              Quét mã QR để thanh toán
                            </p>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    <Button type="submit" className="w-full" disabled={bookingLoading || !!dateError}>
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

      {/* Bank Transfer Dialog */}
      <Dialog open={showBankInfo} onOpenChange={(open) => {
        setShowBankInfo(open);
        if (!open) {
          navigate('/my-bookings');
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5 text-blue-600" />
              Thông tin chuyển khoản
            </DialogTitle>
            <DialogDescription>
              Quét mã QR hoặc chuyển khoản theo thông tin bên dưới
            </DialogDescription>
          </DialogHeader>
          
          {bankInfo && (
            <div className="space-y-4">
              {/* QR Code tĩnh */}
              <div className="flex justify-center">
                <img 
                  src="https://img.vietqr.io/image/MB-0392762050-compact.png"
                  alt="QR Code chuyển khoản"
                  className="w-52 h-52 border rounded-lg"
                />
              </div>

              {/* Bank Info */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Ngân hàng:</span>
                  <span className="font-medium">{bankInfo.bankName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Số tài khoản:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-medium">{bankInfo.accountNumber}</span>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => {
                        navigator.clipboard.writeText(bankInfo.accountNumber);
                        alert('Đã sao chép số tài khoản!');
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Chủ tài khoản:</span>
                  <span className="font-medium">{bankInfo.accountName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Số tiền:</span>
                  <span className="font-bold text-primary">{formatPrice(bankInfo.amount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Nội dung CK:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-medium text-blue-600">{bankInfo.content}</span>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => {
                        navigator.clipboard.writeText(bankInfo.content);
                        alert('Đã sao chép nội dung!');
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                <p className="text-sm text-yellow-800">
                  ⚠️ Vui lòng nhập đúng nội dung chuyển khoản để đơn hàng được xác nhận tự động.
                </p>
              </div>

              <Button 
                className="w-full" 
                onClick={() => {
                  setShowBankInfo(false);
                  navigate('/my-bookings');
                }}
              >
                Đã chuyển khoản xong
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoomDetailPage;
