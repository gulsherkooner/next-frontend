import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SponsoredProducts = () => {
  const products = [
    { name: "Product Name", price: "₹ 23,000", store: "amazon.com", others: 4 },
    { name: "Product Name", price: "₹ 8,000", store: "bestdeals.in", others: 2 },
    { name: "Product Name", price: "₹ 15,500", store: "totaldeals.in", others: 9 },
  ];

  return (
    <div className="mb-4">
      <h2 className="font-medium text-lg mb-3">Sponsored</h2>
      <div className="relative">
        <div className="flex overflow-x-auto pb-2 scrollbar-hide space-x-3">
          {products.map((product, index) => (
            <div key={index} className="w-36 flex-shrink-0">
              <div className="bg-gray-200 aspect-square rounded-lg flex items-center justify-center mb-2">
                <span className="text-gray-500 text-sm">Product</span>
              </div>
              <div className="text-sm font-medium">{product.name}</div>
              <div className="text-sm text-gray-700">{product.price}</div>
              <div className="text-xs text-gray-500">{product.store}+{product.others} others</div>
              <button className="mt-2 w-full py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-md hover:bg-gray-200">
                Shop now
              </button>
            </div>
          ))}
        </div>
        
        {/* Navigation buttons */}
        <button className="absolute left-0 top-1/3 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center">
          <ChevronLeft size={18} />
        </button>
        <button className="absolute right-0 top-1/3 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center">
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default SponsoredProducts;