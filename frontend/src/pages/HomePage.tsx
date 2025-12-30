import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Star, Shield, Clock, Users, Loader2, Tag, Copy, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import api from '@/api/axios';
import type { Room } from '@/types';

interface Promotion {
  promotion_id: number;
  promo_code: string;
  discount_percentage: number;
  start_date: string;
  end_date: string;
}

const HomePage = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    fetchRooms();
    fetchPromotions();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await api.get('/rooms');
      if (response.data.success) {
        // Lấy 6 phòng đầu tiên để hiển thị
        setRooms(response.data.data.slice(0, 6));
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPromotions = async () => {
    try {
      const response = await api.get('/promotions/active');
      if (response.data.success) {
        setPromotions(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching promotions:', error);
    }
  };

  const copyPromoCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getImageUrl = (room: Room) => {
    if (room.images && room.images.length > 0) {
      const imageUrl = room.images[0].image_url;
      // Nếu là URL tương đối, thêm base URL
      if (imageUrl.startsWith('/')) {
        return `http://localhost:8080${imageUrl}`;
      }
      return imageUrl;
    }
    return 'https://placehold.co/400x300?text=No+Image';
  };

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
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Tại sao chọn chúng tôi?
          </h2>
          <div className="grid md:grid-cols-5 gap-6">
            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate('/rooms')}
            >
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

            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate('/reviews')}
            >
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

            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate('/payment-security')}
            >
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

            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate('/support')}
            >
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

            <Dialog>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6 text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Tag className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Khuyến mãi</h3>
                    <p className="text-sm text-muted-foreground">
                      {promotions.length > 0 ? `${promotions.length} mã đang có` : 'Xem ưu đãi'}
                    </p>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>🎉 Mã khuyến mãi</DialogTitle>
                </DialogHeader>
                <div className="space-y-3 mt-4">
                  {promotions.length > 0 ? (
                    promotions.map((promo) => (
                      <div 
                        key={promo.promotion_id}
                        className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
                      >
                        <div>
                          <p className="font-mono font-bold">{promo.promo_code}</p>
                          <p className="text-sm text-blue-600">Giảm {promo.discount_percentage}%</p>
                          <p className="text-xs text-muted-foreground">
                            HSD: {new Date(promo.end_date).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyPromoCode(promo.promo_code)}
                        >
                          {copiedCode === promo.promo_code ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-4">
                      Hiện chưa có khuyến mãi nào
                    </p>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>

      {/* Featured Rooms Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            Phòng nổi bật
          </h2>
          <p className="text-center text-muted-foreground mb-12">
            Khám phá các phòng được yêu thích nhất
          </p>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <Card 
                  key={room.room_id} 
                  className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate(`/rooms/${room.room_id}`)}
                >
                  <div className="aspect-video relative">
                    <img
                      src={getImageUrl(room)}
                      alt={`Phòng ${room.room_number}`}
                      className="w-full h-full object-cover"
                    />
                    <Badge 
                      className="absolute top-3 right-3"
                      variant={room.status === 'available' ? 'default' : 'secondary'}
                    >
                      {room.status === 'available' ? 'Còn trống' : 'Đã đặt'}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold">Phòng {room.room_number}</h3>
                      <Badge variant="outline">{room.roomType?.type_name}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {room.description || 'Phòng nghỉ thoải mái với đầy đủ tiện nghi'}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{room.capacity} người</span>
                      </div>
                      <p className="text-lg font-bold text-primary">
                        {formatPrice(room.price_per_night)}
                        <span className="text-sm font-normal text-muted-foreground">/đêm</span>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Button size="lg" variant="outline" onClick={() => navigate('/rooms')}>
              Xem tất cả phòng
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
