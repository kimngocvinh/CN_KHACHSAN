import { useState, useEffect } from 'react';
import api from '@/api/axios';
import type { Room } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface RoomForm {
  roomNumber: string;
  typeId: number;
  pricePerNight: number;
  capacity: number;
  description: string;
}

const RoomsManagement = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<RoomForm>();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await api.get('/rooms');
      if (response.data.success) {
        setRooms(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (room?: Room) => {
    if (room) {
      setEditingRoom(room);
      setValue('roomNumber', room.room_number);
      setValue('typeId', room.room_type_id);
      setValue('pricePerNight', room.price_per_night);
      setValue('capacity', room.capacity);
      setValue('description', room.description || '');
    } else {
      setEditingRoom(null);
      reset();
    }
    setDialogOpen(true);
  };

  const onSubmit = async (data: RoomForm) => {
    try {
      if (editingRoom) {
        await api.put(`/rooms/${editingRoom.room_id}`, data);
        alert('Cập nhật phòng thành công!');
      } else {
        await api.post('/rooms', data);
        alert('Tạo phòng thành công!');
      }
      setDialogOpen(false);
      fetchRooms();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Thao tác thất bại');
    }
  };

  const handleDelete = async (roomId: number) => {
    if (!confirm('Bạn có chắc muốn xóa phòng này?')) return;

    try {
      await api.delete(`/rooms/${roomId}`);
      alert('Xóa phòng thành công!');
      fetchRooms();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Xóa phòng thất bại');
    }
  };

  const handleUpdateStatus = async (roomId: number, status: string) => {
    try {
      await api.put(`/rooms/${roomId}/status`, { status });
      alert('Cập nhật trạng thái thành công!');
      fetchRooms();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Cập nhật thất bại');
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

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Quản lý phòng</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm phòng mới
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingRoom ? 'Cập nhật phòng' : 'Thêm phòng mới'}</DialogTitle>
              <DialogDescription>
                Điền thông tin phòng
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="roomNumber">Số phòng</Label>
                  <Input
                    id="roomNumber"
                    {...register('roomNumber', { required: 'Số phòng là bắt buộc' })}
                  />
                  {errors.roomNumber && (
                    <p className="text-sm text-red-600">{errors.roomNumber.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="typeId">Loại phòng</Label>
                  <Select
                    onValueChange={(value) => setValue('typeId', parseInt(value))}
                    defaultValue={editingRoom?.room_type_id.toString()}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại phòng" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Standard</SelectItem>
                      <SelectItem value="2">Deluxe</SelectItem>
                      <SelectItem value="3">Suite</SelectItem>
                      <SelectItem value="4">Family</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pricePerNight">Giá mỗi đêm (VNĐ)</Label>
                  <Input
                    id="pricePerNight"
                    type="number"
                    {...register('pricePerNight', { required: 'Giá là bắt buộc', min: 0 })}
                  />
                  {errors.pricePerNight && (
                    <p className="text-sm text-red-600">{errors.pricePerNight.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="capacity">Sức chứa</Label>
                  <Input
                    id="capacity"
                    type="number"
                    {...register('capacity', { required: 'Sức chứa là bắt buộc', min: 1 })}
                  />
                  {errors.capacity && (
                    <p className="text-sm text-red-600">{errors.capacity.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit">
                  {editingRoom ? 'Cập nhật' : 'Tạo mới'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Số phòng</TableHead>
              <TableHead>Loại</TableHead>
              <TableHead>Giá/đêm</TableHead>
              <TableHead>Sức chứa</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rooms.map((room) => (
              <TableRow key={room.room_id}>
                <TableCell className="font-medium">{room.room_number}</TableCell>
                <TableCell>{room.roomType?.type_name}</TableCell>
                <TableCell>{formatPrice(room.price_per_night)}</TableCell>
                <TableCell>{room.capacity} người</TableCell>
                <TableCell>
                  <Select
                    value={room.status}
                    onValueChange={(value) => handleUpdateStatus(room.room_id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Trống</SelectItem>
                      <SelectItem value="occupied">Đã đặt</SelectItem>
                      <SelectItem value="cleaning">Dọn dẹp</SelectItem>
                      <SelectItem value="maintenance">Bảo trì</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDialog(room)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(room.room_id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RoomsManagement;
