import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Hotel, User, LogOut, Calendar, LayoutDashboard, Mail, Phone, MapPin, Facebook, Clock } from 'lucide-react';

const MainLayout = () => {
  const { user, logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isAdmin = user?.role === 'Quản trị viên' || user?.role === 'Nhân viên lễ tân';

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2 font-bold text-xl">
                <Hotel className="h-6 w-6 text-primary" />
                <span>Hotel Booking</span>
              </Link>
              
              <div className="hidden md:flex gap-6">
                <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
                  Trang chủ
                </Link>
                <Link to="/rooms" className="text-sm font-medium hover:text-primary transition-colors">
                  Phòng
                </Link>
                {isAuthenticated() && (
                  <Link to="/my-bookings" className="text-sm font-medium hover:text-primary transition-colors">
                    Đặt phòng của tôi
                  </Link>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              {isAuthenticated() ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar>
                        <AvatarFallback>{user?.fullName?.charAt(0) || 'U'}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{user?.fullName}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <User className="mr-2 h-4 w-4" />
                      Thông tin cá nhân
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/my-bookings')}>
                      <Calendar className="mr-2 h-4 w-4" />
                      Đặt phòng của tôi
                    </DropdownMenuItem>
                    {isAdmin && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate('/admin')}>
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          Quản trị
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Đăng xuất
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => navigate('/login')}>
                    Đăng nhập
                  </Button>
                  <Button onClick={() => navigate('/register')}>
                    Đăng ký
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Logo & Giới thiệu */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-bold text-xl">
                <Hotel className="h-6 w-6 text-blue-400" />
                <span>Hotel Booking</span>
              </div>
              <p className="text-gray-400 text-sm">
                Hệ thống đặt phòng khách sạn trực tuyến hàng đầu. Cam kết mang đến trải nghiệm tốt nhất cho khách hàng.
              </p>
            </div>

            {/* Liên hệ */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Liên hệ</h3>
              <div className="space-y-3 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-blue-400" />
                  <span>0392 762 050</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-blue-400" />
                  <span>contact@hotelbooking.vn</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-blue-400 mt-0.5" />
                  <span>123 Đường ABC, Quận 1, TP. Hồ Chí Minh</span>
                </div>
              </div>
            </div>

            {/* Giờ làm việc */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Giờ làm việc</h3>
              <div className="space-y-3 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-400" />
                  <span>Hỗ trợ 24/7</span>
                </div>
                <p>Thứ 2 - Chủ nhật</p>
                <p>Check-in: 14:00</p>
                <p>Check-out: 12:00</p>
              </div>
            </div>

            {/* Liên kết */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Liên kết</h3>
              <div className="space-y-3 text-sm text-gray-400">
                <Link to="/rooms" className="block hover:text-white transition-colors">
                  Danh sách phòng
                </Link>
                <Link to="/reviews" className="block hover:text-white transition-colors">
                  Đánh giá
                </Link>
                <Link to="/support" className="block hover:text-white transition-colors">
                  Hỗ trợ
                </Link>
                <div className="flex items-center gap-3 pt-2">
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    <Facebook className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>© 2024 Hotel Booking. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
