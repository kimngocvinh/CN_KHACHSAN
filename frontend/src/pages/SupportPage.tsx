import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Clock, Phone, Mail, MessageCircle, MapPin, Headphones, HelpCircle, Users, Loader2 } from 'lucide-react';
import { useState } from 'react';
import api from '@/api/axios';

const SupportPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await api.post('/support', formData);
      if (response.data.success) {
        alert('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong vòng 24 giờ.');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Gửi yêu cầu thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Hỗ Trợ 24/7</h1>
        <p className="text-muted-foreground">
          Luôn sẵn sàng hỗ trợ bạn mọi lúc, mọi nơi
        </p>
      </div>

      {/* Support Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-1">24/7</div>
            <p className="text-sm text-muted-foreground">Hỗ trợ liên tục</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Headphones className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-green-600 mb-1">&lt;5 phút</div>
            <p className="text-sm text-muted-foreground">Thời gian phản hồi</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-purple-600 mb-1">50+</div>
            <p className="text-sm text-muted-foreground">Nhân viên hỗ trợ</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-6 w-6 text-orange-600" />
            </div>
            <div className="text-3xl font-bold text-orange-600 mb-1">98%</div>
            <p className="text-sm text-muted-foreground">Hài lòng</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Contact Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin liên hệ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Hotline</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Gọi ngay để được hỗ trợ tức thì
                  </p>
                  <a href="tel:1900xxxx" className="text-blue-600 font-semibold hover:underline">
                    1900-xxxx
                  </a>
                  <p className="text-xs text-muted-foreground mt-1">
                    Phí cuộc gọi 1.000đ/phút
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Gửi email, chúng tôi phản hồi trong 24h
                  </p>
                  <a href="mailto:support@hotel.com" className="text-blue-600 font-semibold hover:underline">
                    support@hotel.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Live Chat</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Chat trực tiếp với nhân viên hỗ trợ
                  </p>
                  <Button size="sm" className="mt-2">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Bắt đầu chat
                  </Button>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Địa chỉ</h3>
                  <p className="text-sm text-muted-foreground">
                    123 Đường ABC, Quận 1<br />
                    Thành phố Hồ Chí Minh, Việt Nam
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Working Hours */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Giờ làm việc
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium">Hotline</span>
                <span className="text-sm text-green-600 font-semibold">24/7</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium">Live Chat</span>
                <span className="text-sm text-green-600 font-semibold">24/7</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium">Email</span>
                <span className="text-sm text-muted-foreground">Phản hồi trong 24h</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-medium">Văn phòng</span>
                <span className="text-sm text-muted-foreground">8:00 - 20:00 (T2-CN)</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle>Gửi yêu cầu hỗ trợ</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Họ và tên *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nhập họ và tên"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="0912345678"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Tiêu đề *</Label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Vấn đề cần hỗ trợ"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Nội dung *</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Mô tả chi tiết vấn đề của bạn..."
                  rows={5}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Gửi yêu cầu
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Câu hỏi thường gặp
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h3 className="font-semibold mb-2">Làm thế nào để đặt phòng?</h3>
              <p className="text-sm text-muted-foreground">
                Bạn có thể đặt phòng trực tiếp trên website bằng cách chọn phòng → Nhấn "Đặt phòng ngay" 
                → Điền thông tin → Xác nhận. Hoặc gọi hotline 1900-xxxx để được hỗ trợ đặt phòng.
              </p>
            </div>

            <div className="border-b pb-4">
              <h3 className="font-semibold mb-2">Chính sách hủy phòng như thế nào?</h3>
              <p className="text-sm text-muted-foreground">
                Hủy phòng miễn phí trước 24 giờ so với giờ nhận phòng. Hủy trong vòng 24 giờ sẽ 
                phải chịu phí 50% giá trị đặt phòng.
              </p>
            </div>

            <div className="border-b pb-4">
              <h3 className="font-semibold mb-2">Thời gian nhận/trả phòng?</h3>
              <p className="text-sm text-muted-foreground">
                Nhận phòng: Từ 14:00 | Trả phòng: Trước 12:00. Nếu cần nhận phòng sớm hoặc trả 
                phòng muộn, vui lòng liên hệ trước để được hỗ trợ.
              </p>
            </div>

            <div className="border-b pb-4">
              <h3 className="font-semibold mb-2">Khách sạn có chỗ đỗ xe không?</h3>
              <p className="text-sm text-muted-foreground">
                Có, chúng tôi cung cấp bãi đỗ xe miễn phí cho khách lưu trú với sức chứa hơn 
                100 xe ô tô và xe máy.
              </p>
            </div>

            <div className="pb-4">
              <h3 className="font-semibold mb-2">Phòng có WiFi miễn phí không?</h3>
              <p className="text-sm text-muted-foreground">
                Tất cả phòng đều được trang bị WiFi tốc độ cao miễn phí. Mật khẩu sẽ được cung 
                cấp khi nhận phòng.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <Card className="mt-8 bg-red-50 border-red-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Phone className="h-6 w-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-red-900 mb-2">Trường hợp khẩn cấp</h3>
              <p className="text-sm text-red-800 mb-3">
                Nếu bạn gặp tình huống khẩn cấp hoặc cần hỗ trợ gấp, vui lòng gọi ngay:
              </p>
              <a href="tel:0911234567" className="text-xl font-bold text-red-600 hover:underline">
                091-123-4567
              </a>
              <p className="text-xs text-red-700 mt-2">
                Đường dây nóng 24/7 - Phản hồi tức thì
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupportPage;
