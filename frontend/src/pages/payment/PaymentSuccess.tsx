import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId');

  useEffect(() => {
    // Có thể gọi API để cập nhật trạng thái thanh toán
  }, [bookingId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-green-600 mb-2">
            Thanh toán thành công!
          </h1>
          <p className="text-muted-foreground mb-6">
            Cảm ơn bạn đã đặt phòng. Đơn đặt phòng #{bookingId} của bạn đã được xác nhận.
          </p>
          <div className="space-y-3">
            <Button className="w-full" onClick={() => navigate('/my-bookings')}>
              Xem đơn đặt phòng
            </Button>
            <Button variant="outline" className="w-full" onClick={() => navigate('/')}>
              Về trang chủ
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
