import type { ProductReview } from '@/lib/types/shop'

export const shopReviews: ProductReview[] = [
  { id: 'rev-1', listingId: 'listing-1', consumerId: 'consumer-1', consumerName: 'Mary Johnson', rating: 5, comment: 'Excellent rice! Very clean and cooked perfectly. Will order again from this farmer.', createdAt: '2024-06-10T09:00:00Z', verified: true },
  { id: 'rev-2', listingId: 'listing-1', consumerId: 'consumer-2', consumerName: 'Emmanuel Dolo', rating: 4, comment: 'Good quality rice, delivered on time. Price is fair for the quality.', createdAt: '2024-06-15T14:00:00Z', verified: true },
  { id: 'rev-3', listingId: 'listing-1', consumerId: 'consumer-3', consumerName: 'Hawa Sumo', rating: 5, comment: 'Best rice I have bought this season. My family loved it!', createdAt: '2024-07-01T11:00:00Z', verified: false },
  { id: 'rev-4', listingId: 'listing-2', consumerId: 'consumer-1', consumerName: 'Mary Johnson', rating: 5, comment: 'Very fresh pepper, very spicy! Great for jollof rice and stews.', createdAt: '2024-05-20T08:00:00Z', verified: true },
  { id: 'rev-5', listingId: 'listing-2', consumerId: 'consumer-4', consumerName: 'Tokpa Kollie', rating: 4, comment: 'Good pepper, fair price. Quantity was exactly as stated.', createdAt: '2024-06-05T16:00:00Z', verified: true },
  { id: 'rev-6', listingId: 'listing-3', consumerId: 'consumer-2', consumerName: 'Emmanuel Dolo', rating: 5, comment: 'Cassava is very fresh and tasty. Good size and no damage.', createdAt: '2024-06-20T10:00:00Z', verified: true },
  { id: 'rev-7', listingId: 'listing-3', consumerId: 'consumer-3', consumerName: 'Hawa Sumo', rating: 4, comment: 'Nice cassava from Lofa County. Travelled well and arrived fresh.', createdAt: '2024-07-05T13:00:00Z', verified: false },
  { id: 'rev-8', listingId: 'listing-5', consumerId: 'consumer-1', consumerName: 'Mary Johnson', rating: 5, comment: 'Plantain was ripe and sweet. Perfect for frying!', createdAt: '2024-06-25T09:30:00Z', verified: true },
  { id: 'rev-9', listingId: 'listing-5', consumerId: 'consumer-4', consumerName: 'Tokpa Kollie', rating: 3, comment: 'Plantains were okay. A few were a bit overripe but most were good.', createdAt: '2024-07-08T15:00:00Z', verified: true },
  { id: 'rev-10', listingId: 'listing-4', consumerId: 'consumer-2', consumerName: 'Emmanuel Dolo', rating: 5, comment: 'Premium quality rubber latex. Consistent output from this supplier.', createdAt: '2024-06-18T11:00:00Z', verified: true },
  { id: 'rev-11', listingId: 'listing-6', consumerId: 'consumer-3', consumerName: 'Hawa Sumo', rating: 4, comment: 'Good quality cocoa beans. Suitable for processing. Will buy again.', createdAt: '2024-07-02T08:00:00Z', verified: true },
  { id: 'rev-12', listingId: 'listing-7', consumerId: 'consumer-1', consumerName: 'Mary Johnson', rating: 5, comment: 'Large and fresh yam from Nimba. Very good for soup. Farmer responded quickly on WhatsApp.', createdAt: '2024-07-10T14:00:00Z', verified: true },
  { id: 'rev-13', listingId: 'listing-8', consumerId: 'consumer-4', consumerName: 'Tokpa Kollie', rating: 4, comment: 'Good maize, well dried. Enough for grinding. Smooth transaction.', createdAt: '2024-07-12T10:30:00Z', verified: true },
]

export function getReviewsForListing(listingId: string): ProductReview[] {
  return shopReviews.filter((r) => r.listingId === listingId)
}

export function getAverageRating(listingId: string): number {
  const reviews = getReviewsForListing(listingId)
  if (!reviews.length) return 0
  return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
}
