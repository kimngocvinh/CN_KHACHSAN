import { useState, useEffect } from 'react';
import api from '@/api/axios';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, Loader2, Percent, Calendar } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface Promotion {
  promotion_id: number;
  promo_code: string;
  discount_percentage: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

interface PromotionForm {
  promoCode: string;
  discountPercentage: number;
  startDate: string;
  endDate: string;
}

const PromotionsManagement = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'Quản trị viên';
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<PromotionForm>();

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      const response = await api.get('/promotions');
      if (response.data.success) {
        setPromotions(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching promotions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (promotion?: Promotion) => {
    if (promotion) {
      setEditingPromotion(promotion);
      setValue('promoCode', promotion.promo_code);
      setValue('discountPercentage', promotion.discount_percentage);
      setValue('startDate', promotion.start_date);
      setValue('endDate', promotion.end_date);
    } else {
      setEditingPromotion(null);
      reset();
    }
    setDialogOpen(true);
  };

  const onSubmit = async (data: PromotionForm) => {
    try {
      if (editingPromotion) {
        await api.put(`/promotions/${editingPromotion.promotion_id}`, data);
        alert('Cập nhật khuyến mãi thành công!');
      } else {
        await api.post('/promotions', data);
        alert('Tạo khuyến mãi thành công!');
      }
      setDialogOpen(false);
      fetchPromotions();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Thao tác thất bại');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa khuyến mãi này?')) return;

    try {
      await api.delete(`/promotions/${id}`);
      alert('Xóa khuyến mãi thành công!');
      fetchPromotions();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Xóa thất bại');
    }
  };

  const handleToggleActive = async (promotion: Promotion) => {
    try {
      await api.put(`/promotions/${promotion.promotion_id}`, {
        isActive: !promotion.is_active
      });
      fetchPromotions();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Cập nhật thất bại');
    }
  };

  const getStatus = (promotion: Promotion) => {
    const today = new Date();
    const startDate = new Date(promotion.start_date);
    const endDate = new Date(promotion.end_date);

    if (!promotion.is_active) {
      return { label: 'Tắt', variant: 'secondary' as const };
    }
    if (today < startDate) {
      return { label: 'Chưa bắt đầu', variant: 'outline' as const };
    }
    if (today > endDate) {
      return { label: 'Hết hạn', variant: 'destructive' as const };
    }
    return { label: 'Đang hoạt động', variant: 'default' as const };
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
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Khuyến mãi</h1>
          <p className="text-muted-foreground mt-1">
            {isAdmin ? 'Tạo và quản lý mã giảm giá cho khách hàng' : 'Xem danh sách mã giảm giá'}
          </p>
        </div>
        {isAdmin && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                Thêm khuyến mãi
              </Button>
            </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingPromotion ? 'Cập nhật khuyến mãi' : 'Thêm khuyến mãi mới'}</DialogTitle>
              <DialogDescription>
                Điền thông tin mã khuyến mãi
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="promoCode">Mã khuyến mãi</Label>
                <Input
                  id="promoCode"
                  placeholder="VD: SUMMER20"
                  {...register('promoCode', { required: 'Mã khuyến mãi là bắt buộc' })}
                />
                {errors.promoCode && (
                  <p className="text-sm text-red-600">{errors.promoCode.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="discountPercentage">Phần trăm giảm giá (%)</Label>
                <Input
                  id="discountPercentage"
                  type="number"
                  min="1"
                  max="100"
                  placeholder="VD: 20"
                  {...register('discountPercentage', { 
                    required: 'Phần trăm giảm giá là bắt buộc',
                    min: { value: 1, message: 'Tối thiểu 1%' },
                    max: { value: 100, message: 'Tối đa 100%' }
                  })}
                />
                {errors.discountPercentage && (
                  <p className="text-sm text-red-600">{errors.discountPercentage.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Ngày bắt đầu</Label>
                  <Input
                    id="startDate"
                    type="date"
                    {...register('startDate', { required: 'Ngày bắt đầu là bắt buộc' })}
                  />
                  {errors.startDate && (
                    <p className="text-sm text-red-600">{errors.startDate.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">Ngày kết thúc</Label>
                  <Input
                    id="endDate"
                    type="date"
                    {...register('endDate', { required: 'Ngày kết thúc là bắt buộc' })}
                  />
                  {errors.endDate && (
                    <p className="text-sm text-red-600">{errors.endDate.message}</p>
                  )}
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit">
                  {editingPromotion ? 'Cập nhật' : 'Tạo mới'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        )}
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Percent className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tổng khuyến mãi</p>
              <p className="text-2xl font-bold">{promotions.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Đang hoạt động</p>
              <p className="text-2xl font-bold">
                {promotions.filter(p => {
                  const today = new Date();
                  return p.is_active && new Date(p.start_date) <= today && new Date(p.end_date) >= today;
                }).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Calendar className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Hết hạn</p>
              <p className="text-2xl font-bold">
                {promotions.filter(p => new Date(p.end_date) < new Date()).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã khuyến mãi</TableHead>
              <TableHead>Giảm giá</TableHead>
              <TableHead>Ngày bắt đầu</TableHead>
              <TableHead>Ngày kết thúc</TableHead>
              <TableHead>Trạng thái</TableHead>
              {isAdmin && <TableHead>Kích hoạt</TableHead>}
              {isAdmin && <TableHead className="text-right">Thao tác</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {promotions.map((promotion) => {
              const status = getStatus(promotion);
              return (
                <TableRow key={promotion.promotion_id}>
                  <TableCell className="font-mono font-bold">{promotion.promo_code}</TableCell>
                  <TableCell>
                    <span className="text-green-600 font-semibold">{promotion.discount_percentage}%</span>
                  </TableCell>
                  <TableCell>{formatDate(promotion.start_date)}</TableCell>
                  <TableCell>{formatDate(promotion.end_date)}</TableCell>
                  <TableCell>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </TableCell>
                  {isAdmin && (
                    <TableCell>
                      <Switch
                        checked={promotion.is_active}
                        onCheckedChange={() => handleToggleActive(promotion)}
                      />
                    </TableCell>
                  )}
                  {isAdmin && (
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenDialog(promotion)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(promotion.promotion_id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {promotions.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            Chưa có khuyến mãi nào.
          </div>
        )}
      </div>
    </div>
  );
};

export default PromotionsManagement;
