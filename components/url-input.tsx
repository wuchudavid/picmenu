import { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface UrlInputProps {
  onImageUrlSubmit: (url: string) => void;
  isLoading?: boolean;
}

export function UrlInput({ onImageUrlSubmit, isLoading = false }: UrlInputProps) {
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (imageUrl.trim()) {
      onImageUrlSubmit(imageUrl.trim());
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Enter menu image URL..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={!imageUrl.trim() || isLoading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "Processing..." : "Process Menu"}
        </button>
      </form>
      
      <div className="mt-4 text-sm text-gray-500 text-center">
        <p>Or try these example URLs:</p>
        <div className="mt-2 space-y-1">
          <button
            onClick={() => setImageUrl("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800")}
            className="block text-blue-600 hover:text-blue-800 underline"
          >
            Restaurant Menu Example
          </button>
          <button
            onClick={() => setImageUrl("https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800")}
            className="block text-blue-600 hover:text-blue-800 underline"
          >
            Food Menu Example
          </button>
        </div>
      </div>
    </div>
  );
} 