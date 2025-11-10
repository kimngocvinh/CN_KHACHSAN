import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Star, Shield, Clock } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Đặt Phòng Khách Sạn Dễ Dàng
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Tìm và đặt phòng khách sạn tốt nhất với giá ưu đãi nhất
            </p>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate('/rooms')}
              className="text-lg px-8 py-6"
            >
              <Search className="mr-2 h-5 w-5" />
              Tìm phòng ngay
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Tại sao chọn chúng tôi?
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Tìm kiếm dễ dàng</h3>
                <p className="text-sm text-muted-foreground">
                  Tìm phòng phù hợp chỉ trong vài giây
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Chất lượng đảm bảo</h3>
                <p className="text-sm text-muted-foreground">
                  Phòng được kiểm tra và đánh giá kỹ lưỡng
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Thanh toán an toàn</h3>
                <p className="text-sm text-muted-foreground">
                  Hệ thống bảo mật tuyệt đối
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Hỗ trợ 24/7</h3>
                <p className="text-sm text-muted-foreground">
                  Luôn sẵn sàng hỗ trợ bạn
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Sẵn sàng đặt phòng?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Hàng trăm phòng đang chờ bạn khám phá
          </p>
          <Button size="lg" onClick={() => navigate('/rooms')}>
            Xem tất cả phòng
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
