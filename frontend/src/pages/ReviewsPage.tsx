import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Users, Shield, Award, ThumbsUp } from 'lucide-react';
import api from '@/api/axios';

interface Review {
  review_id: number;
  rating: number;
  comment: string;
  created_at: string;
  user: {
    full_name: string;
  };
  room_id?: number;
}

const ReviewsPage = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    fiveStars: 0,
    fourStars: 0,
    threeStars: 0,
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await api.get('/reviews');
      const reviewsData = response.data.data || [];
      setReviews(reviewsData);

      // Tính toán thống kê
      const total = reviewsData.length;
      const avgRating = total > 0 
        ? reviewsData.reduce((sum: number, r: Review) => sum + r.rating, 0) / total 
        : 0;
      const fiveStar = reviewsData.filter((r: Review) => r.rating === 5).length;
      const fourStar = reviewsData.filter((r: Review) => r.rating === 4).length;
      const threeStar = reviewsData.filter((r: Review) => r.rating === 3).length;

      setStats({
        averageRating: avgRating,
        totalReviews: total,
        fiveStars: fiveStar,
        fourStars: fourStar,
        threeStars: threeStar,
      });
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Chất Lượng & Đánh Giá</h1>
        <p className="text-muted-foreground">
          Khách hàng của chúng tôi nói gì về dịch vụ
        </p>
      </div>

      {/* Quality Assurance Section */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="text-3xl font-bold text-yellow-600 mb-1">
              {stats.averageRating.toFixed(1)}
            </div>
            <p className="text-sm text-muted-foreground">Đánh giá trung bình</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {stats.totalReviews}
            </div>
            <p className="text-sm text-muted-foreground">Lượt đánh giá</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-green-600 mb-1">100%</div>
            <p className="text-sm text-muted-foreground">Phòng đã kiểm tra</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-purple-600 mb-1">
              {stats.fiveStars}
            </div>
            <p className="text-sm text-muted-foreground">Đánh giá 5 sao</p>
          </CardContent>
        </Card>
      </div>

      {/* Rating Distribution */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Phân bố đánh giá</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 w-24">
              <span className="text-sm font-medium">5</span>
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            </div>
            <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-400"
                style={{
                  width: `${stats.totalReviews > 0 ? (stats.fiveStars / stats.totalReviews) * 100 : 0}%`,
                }}
              />
            </div>
            <span className="text-sm text-muted-foreground w-12">
              {stats.fiveStars}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 w-24">
              <span className="text-sm font-medium">4</span>
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            </div>
            <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-400"
                style={{
                  width: `${stats.totalReviews > 0 ? (stats.fourStars / stats.totalReviews) * 100 : 0}%`,
                }}
              />
            </div>
            <span className="text-sm text-muted-foreground w-12">
              {stats.fourStars}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 w-24">
              <span className="text-sm font-medium">3</span>
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            </div>
            <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-400"
                style={{
                  width: `${stats.totalReviews > 0 ? (stats.threeStars / stats.totalReviews) * 100 : 0}%`,
                }}
              />
            </div>
            <span className="text-sm text-muted-foreground w-12">
              {stats.threeStars}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Quality Standards */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Cam kết chất lượng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Shield className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Kiểm tra định kỳ</h3>
                <p className="text-sm text-muted-foreground">
                  Tất cả phòng được kiểm tra và vệ sinh sạch sẽ trước mỗi lượt khách
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <ThumbsUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Tiện nghi đầy đủ</h3>
                <p className="text-sm text-muted-foreground">
                  Phòng được trang bị đầy đủ tiện nghi hiện đại, đảm bảo sự thoải mái
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Award className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Đánh giá cao</h3>
                <p className="text-sm text-muted-foreground">
                  Được khách hàng tin tưởng và đánh giá cao về chất lượng dịch vụ
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Đánh giá từ khách hàng</h2>
        {loading ? (
          <p className="text-center py-8 text-muted-foreground">Đang tải...</p>
        ) : reviews.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">
            Chưa có đánh giá nào
          </p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.review_id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{review.user.full_name}</h3>
                      </div>
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(review.created_at)}
                    </span>
                  </div>
                  <p className="text-muted-foreground">{review.comment}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsPage;
