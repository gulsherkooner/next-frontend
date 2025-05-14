
import React from 'react';
import { Library } from 'lucide-react';
import { useIsMobile } from '@/app/hooks/use-mobile';

const CollectionsGrid = () => {
  // Mock data for collections
  const collections = Array.from({ length: 9 }).map((_, i) => ({
    id: i,
    title: `Collection ${i + 1} - ${['Travel', 'Fashion', 'Tech', 'Food', 'Art'][i % 5]} Inspiration`,
    itemCount: Math.floor(Math.random() * 50) + 10,
    isPrivate: i % 3 === 0,
    coverImages: Array.from({ length: 4 }).map((_, j) => `/collection-${i}-${j}.jpg`),
    updatedAt: `${Math.floor(Math.random() * 30) + 1} days ago`,
  }));

  const isMobile = useIsMobile();

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {collections.map((collection) => (
          <div key={collection.id} className={`overflow-hidden ${isMobile && "flex w-full h-full"}`}>
            <div className={`relative ${isMobile && "w-full h-full flex flex-2/5 aspect-square"}`}>
              {/* Collection cover grid */}
              <div className="grid grid-cols-2 gap-0.5 aspect-square">
                {[0, 1, 2, 3].map((index) => (
                  <div key={index} className="bg-gray-200 relative overflow-hidden">
                    <div 
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ 
                        backgroundImage: `url(https://source.unsplash.com/random/?${
                          ['travel', 'fashion', 'tech', 'food', 'art'][collection.id % 5]},${index})` 
                      }}
                    />
                  </div>
                ))}
              </div>
              
              {/* Privacy badge */}
              {collection.isPrivate && (
                <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  <span className="ml-1">Private</span>
                </div>
              )}
              
              {/* Collection count */}
              <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center">
                <Library size={18} />
                <span className="ml-1">{collection.itemCount} items</span>
              </div>
            </div>
            
            <div className={`p-3 ${isMobile && "w-full h-full flex flex-col flex-3/5"}`}>
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium line-clamp-2 text-wrap wrap-normal">{collection.title} Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis hic neque non, dolorem mollitia possimus cumque aut quidem veniam facere enim quas totam, qui assumenda voluptatem atque maiores autem repudiandae.</h3>
                <button variant="ghost" size="sm" className="h-8 w-8 p-0 -mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="19" cy="12" r="1"></circle>
                    <circle cx="5" cy="12" r="1"></circle>
                  </svg>
                </button>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Updated {collection.updatedAt}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollectionsGrid;
