import { useNavigate, useSearchParams } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const PaymentCancel = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-red-600 mb-2">
            Thanh toán bị hủy
          </h1>
          <p className="text-muted-foreground mb-6">
            Đơn đặt phòng #{bookingId} chưa được thanh toán. Bạn có thể thanh toán lại hoặc chọn thanh toán khi nhận phòng.
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

export default PaymentCancel;
