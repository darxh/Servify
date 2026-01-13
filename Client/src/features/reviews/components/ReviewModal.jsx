import { useState } from "react";
import { X, Star } from "lucide-react";
import { useCreateReview } from "../../../hooks/useCreateReview";

const ReviewModal = ({ isOpen, onClose, serviceId }) => {
  const [rating, setRating] = useState(5); // Default 5 stars
  const [comment, setComment] = useState("");
  
  const createReviewMutation = useCreateReview();

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    createReviewMutation.mutate(
      { serviceId, rating, comment },
      {
        onSuccess: () => {
          alert("Review submitted successfully!");
          onClose();
          setComment(""); 
          setRating(5);
        },
        onError: (error) => {
          alert(error.response?.data?.message || "Failed to submit review");
        }
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-6 relative animate-in fade-in zoom-in duration-200">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="text-xl font-bold text-gray-900 mb-4">Rate this Service</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`p-1 transition-colors focus:outline-none`}
                >
                  <Star 
                    className={`h-8 w-8 ${
                      rating >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                    }`} 
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Your Review</label>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us about your experience..."
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
              required
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createReviewMutation.isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createReviewMutation.isPending ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;