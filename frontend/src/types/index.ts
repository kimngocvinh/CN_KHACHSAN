export interface Room {
  room_id: number;
  room_number: string;
  room_type_id: number;
  price_per_night: number;
  capacity: number;
  description?: string;
  status: 'available' | 'occupied' | 'cleaning' | 'maintenance';
  roomType?: {
    type_name: string;
    description?: string;
  };
  images?: {
    image_url: string;
    is_primary?: boolean;
  }[];
  amenities?: {
    amenity_name: string;
  }[];
}

export interface Booking {
  booking_id: number;
  user_id: number;
  room_id: number;
  check_in_date: string;
  check_out_date: string;
  number_of_guests: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
  payment_method?: 'cash' | 'payos' | 'bank_transfer';
  payment_status?: 'unpaid' | 'pending' | 'paid';
  booking_date: string;
  room?: {
    room_number: string;
    price_per_night: number;
  };
  user?: {
    full_name: string;
    email: string;
    phone_number?: string;
  };
}

export interface Review {
  review_id: number;
  booking_id: number;
  user_id: number;
  room_id: number;
  rating: number;
  comment?: string;
  review_date: string;
  user?: {
    full_name: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
}
