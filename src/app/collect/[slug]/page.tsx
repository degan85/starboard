"use client";

import { useState } from "react";
import { Heart, Star, Send, CheckCircle, Loader2 } from "lucide-react";

interface FormData {
  name: string;
  email: string;
  company: string;
  role: string;
  content: string;
  rating: number;
}

export default function CollectPage({ params }: { params: { slug: string } }) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    role: "",
    content: "",
    rating: 5,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          projectSlug: params.slug,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit testimonial");
      }

      setIsSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Thank you! 💜
          </h1>
          <p className="text-gray-600">
            Your testimonial has been submitted successfully.
            <br />
            It will be displayed after review.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white py-12 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 text-brand-600 mb-4">
            <Heart className="w-6 h-6 fill-brand-500" />
            <span className="font-bold text-lg">starboard</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Share your experience ✨
          </h1>
          <p className="text-gray-600">
            We'd love to hear about your experience.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          {/* Rating */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 transition ${
                      star <= formData.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="mb-6">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Your testimonial <span className="text-red-500">*</span>
            </label>
            <textarea
              id="content"
              required
              rows={4}
              placeholder="What did you love about it? Share your honest experience."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Name */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Your name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              required
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>

          {/* Email (optional) */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="email"
              id="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>

          {/* Company & Role */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                Company <span className="text-gray-400">(optional)</span>
              </label>
              <input
                type="text"
                id="company"
                placeholder="Acme Inc"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                Role <span className="text-gray-400">(optional)</span>
              </label>
              <input
                type="text"
                id="role"
                placeholder="Product Manager"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand-600 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-brand-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Submit Testimonial
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-400 mt-6">
          Powered by{" "}
          <a href="/" className="text-brand-600 hover:underline">
            starboard
          </a>
        </p>
      </div>
    </div>
  );
}
