import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, CreditCard, CheckCircle, AlertTriangle, FileText } from 'lucide-react';

const PaymentSecurityPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Thanh Toán An Toàn</h1>
        <p className="text-muted-foreground">
          Hệ thống bảo mật tuyệt đối cho mọi giao dịch
        </p>
      </div>

      {/* Security Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-green-600 mb-1">256-bit</div>
            <p className="text-sm text-muted-foreground">Mã hóa SSL</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-1">100%</div>
            <p className="text-sm text-muted-foreground">Bảo mật dữ liệu</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-purple-600 mb-1">24/7</div>
            <p className="text-sm text-muted-foreground">Giám sát giao dịch</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="h-6 w-6 text-orange-600" />
            </div>
            <div className="text-3xl font-bold text-orange-600 mb-1">PCI DSS</div>
            <p className="text-sm text-muted-foreground">Tiêu chuẩn quốc tế</p>
          </CardContent>
        </Card>
      </div>

      {/* Security Features */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Tính năng bảo mật</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Mã hóa đầu cuối (End-to-End Encryption)</h3>
                <p className="text-sm text-muted-foreground">
                  Tất cả thông tin thanh toán được mã hóa bằng công nghệ SSL 256-bit, 
                  đảm bảo an toàn tuyệt đối trong quá trình truyền tải.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Lock className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Xác thực 2 lớp (2FA)</h3>
                <p className="text-sm text-muted-foreground">
                  Bảo vệ tài khoản của bạn với xác thực 2 lớp qua SMS hoặc email 
                  cho mọi giao dịch quan trọng.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Giám sát giao dịch 24/7</h3>
                <p className="text-sm text-muted-foreground">
                  Hệ thống AI tự động phát hiện và ngăn chặn các giao dịch bất thường, 
                  bảo vệ bạn khỏi gian lận.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CreditCard className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Không lưu thông tin thẻ</h3>
                <p className="text-sm text-muted-foreground">
                  Chúng tôi không lưu trữ thông tin thẻ tín dụng/ghi nợ của bạn. 
                  Tất cả được xử lý qua cổng thanh toán bảo mật.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Phương thức thanh toán được hỗ trợ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 border rounded-lg">
              <CreditCard className="h-12 w-12 mx-auto mb-4 text-blue-600" />
              <h3 className="font-semibold mb-2">Thẻ tín dụng/ghi nợ</h3>
              <p className="text-sm text-muted-foreground">
                Visa, Mastercard, JCB, American Express
              </p>
            </div>

            <div className="text-center p-6 border rounded-lg">
              <CreditCard className="h-12 w-12 mx-auto mb-4 text-green-600" />
              <h3 className="font-semibold mb-2">Ví điện tử</h3>
              <p className="text-sm text-muted-foreground">
                MoMo, ZaloPay, VNPay, ShopeePay
              </p>
            </div>

            <div className="text-center p-6 border rounded-lg">
              <CreditCard className="h-12 w-12 mx-auto mb-4 text-purple-600" />
              <h3 className="font-semibold mb-2">Chuyển khoản ngân hàng</h3>
              <p className="text-sm text-muted-foreground">
                Tất cả các ngân hàng nội địa
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Certifications */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Chứng nhận & Tiêu chuẩn</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <Shield className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">PCI DSS Level 1</h3>
                <p className="text-sm text-muted-foreground">
                  Tiêu chuẩn bảo mật dữ liệu thẻ thanh toán quốc tế
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Lock className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">ISO 27001</h3>
                <p className="text-sm text-muted-foreground">
                  Chứng nhận quản lý an ninh thông tin
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">SSL Certificate</h3>
                <p className="text-sm text-muted-foreground">
                  Chứng chỉ bảo mật SSL 256-bit mã hóa
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Mẹo bảo mật khi thanh toán
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-semibold text-blue-600">1</span>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Kiểm tra URL</h4>
                <p className="text-sm text-muted-foreground">
                  Luôn đảm bảo URL bắt đầu bằng "https://" và có biểu tượng ổ khóa trước khi nhập thông tin thanh toán.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-semibold text-blue-600">2</span>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Không chia sẻ thông tin</h4>
                <p className="text-sm text-muted-foreground">
                  Không bao giờ chia sẻ mã OTP, CVV, hoặc mật khẩu thẻ với bất kỳ ai, kể cả nhân viên.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-semibold text-blue-600">3</span>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Kiểm tra giao dịch</h4>
                <p className="text-sm text-muted-foreground">
                  Thường xuyên kiểm tra lịch sử giao dịch và báo ngay nếu phát hiện bất thường.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-semibold text-blue-600">4</span>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Sử dụng mạng an toàn</h4>
                <p className="text-sm text-muted-foreground">
                  Tránh sử dụng WiFi công cộng khi thực hiện giao dịch thanh toán.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card className="mt-8 bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Cần hỗ trợ về thanh toán?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Nếu bạn gặp vấn đề hoặc có thắc mắc về thanh toán, đội ngũ hỗ trợ của chúng tôi 
                sẵn sàng giúp đỡ 24/7.
              </p>
              <div className="flex gap-4 text-sm">
                <div>
                  <span className="font-semibold">Hotline:</span> 1900-xxxx
                </div>
                <div>
                  <span className="font-semibold">Email:</span> support@hotel.com
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSecurityPage;
