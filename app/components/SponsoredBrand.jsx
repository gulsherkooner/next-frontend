import React from "react";
import { ChevronLeft, ChevronRight, Heart, MessageSquare, Share2, Bookmark } from "lucide-react";

const SponsoredBrand = () => {
  return (
    <div className="bg-white rounded-lg shadow mb-4">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0"></div>
          <div className="ml-2">
            <div className="font-medium text-sm">Brandname</div>
            <div className="text-xs text-gray-500">Sponsored</div>
          </div>
        </div>
        <button className="text-gray-500">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="8" cy="4" r="1" fill="currentColor" />
            <circle cx="8" cy="8" r="1" fill="currentColor" />
            <circle cx="8" cy="12" r="1" fill="currentColor" />
          </svg>
        </button>
      </div>
      
      <div className="relative h-64 bg-gray-200">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="24" height="24" rx="12" fill="white" />
              <path d="M15 12L10 15V9L15 12Z" fill="#888888" />
            </svg>
          </div>
        </div>
        
        <div className="absolute bottom-4 left-4">
          <button className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <ChevronLeft size={20} color="white" />
          </button>
        </div>
        
        <div className="absolute bottom-4 right-4">
          <button className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <ChevronRight size={20} color="white" />
          </button>
        </div>
        
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-1">
          <div className="w-1.5 h-1.5 rounded-full bg-white opacity-50"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-white opacity-50"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-white opacity-50"></div>
        </div>
      </div>
      
      <div className="p-4">
        <button className="w-full flex items-center justify-between py-1.5 px-4 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200">
          <span>Shop now</span>
          <ChevronRight size={16} />
        </button>
      </div>
      
      <div className="px-4 pb-4 flex justify-between items-center">
        <div className="flex space-x-4">
          <button className="flex items-center text-sm font-medium text-gray-500">
            <Heart size={18} className="mr-1" /> 12K
          </button>
          <button className="flex items-center text-sm font-medium text-gray-500">
            <MessageSquare size={18} className="mr-1" /> Comment
          </button>
          <button className="flex items-center text-sm font-medium text-gray-500">
            <Share2 size={18} className="mr-1" /> Share
          </button>
        </div>
        <button className="text-sm font-medium text-gray-500">
          <Bookmark size={18} />
        </button>
      </div>
    </div>
  );
};

export default SponsoredBrand;