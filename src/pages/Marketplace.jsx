import { useState } from 'react'

const Marketplace = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedProduct, setSelectedProduct] = useState(null)

  const categories = [
    'all',
    '3d-models',
    'scripts-addons',
  ]

  const categoryLabels = {
    'all': 'All Products',
    '3d-models': '3D Models',
    'scripts-addons': 'Scripts & Addons',
  }

  const products = [
    {
      id: 1,
      title: 'Sci-Fi Crate Pack',
      description: 'A collection of 10 high-quality sci-fi crates with 4K textures. Perfect for game environments.',
      category: '3d-models',
      price: 15,
      currency: 'USD',
      thumbnailUrl: 'https://placehold.co/400x300/1F2833/00FFFF?text=Sci-Fi+Crates',
      images: [],
      features: ['10 unique models', '4K PBR textures', 'Optimized for real-time', 'FBX, OBJ, Blender formats'],
    },
    {
      id: 2,
      title: 'Character Rigging Script',
      description: 'Automated rigging script for Blender. Speed up your character workflow with this powerful tool.',
      category: 'scripts-addons',
      price: 25,
      currency: 'USD',
      thumbnailUrl: 'https://placehold.co/400x300/1F2833/00FFFF?text=Rigging+Script',
      images: [],
      features: ['Auto-bone detection', 'IK/FK switch', 'Customizable controls', 'Python script for Blender'],
    },
    {
      id: 3,
      title: 'Medieval Weapons Set',
      description: '20 detailed medieval weapons including swords, axes, and maces with LODs included.',
      category: '3d-models',
      price: 30,
      currency: 'USD',
      thumbnailUrl: 'https://placehold.co/400x300/1F2833/00FFFF?text=Medieval+Weapons',
      images: [],
      features: ['20 weapons', '3 LOD levels per weapon', 'Game-ready', 'Multiple texture variations'],
    },
    {
      id: 4,
      title: 'Material Generator Addon',
      description: 'Procedural material generator for creating unique textures instantly in Blender.',
      category: 'scripts-addons',
      price: 20,
      currency: 'USD',
      thumbnailUrl: 'https://placehold.co/400x300/1F2833/00FFFF?text=Material+Generator',
      images: [],
      features: ['50+ material presets', 'Custom parameters', 'Node-based', 'Export to any format'],
    },
  ]

  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter((product) => product.category === selectedCategory)

  const handlePurchase = (product) => {
    // In production, this would integrate with Creem payment processing
    alert(`Purchase: ${product.title}\nPrice: $${product.price}\n\nPayment integration coming soon!`)
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center text-[#00FFFF]">Marketplace</h1>
        <p className="text-center text-[#C5C6C7] mb-8 max-w-2xl mx-auto">
          Browse our collection of high-quality 3D models, scripts, and addons. All assets are game-ready and optimized for performance.
        </p>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-[#00FFFF] text-[#0B0C10]'
                  : 'bg-[#1F2833] text-[#C5C6C7] hover:bg-[#0B0C10] hover:text-[#00FFFF]'
              }`}
            >
              {categoryLabels[category]}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-[#1F2833] rounded-lg overflow-hidden border border-[#0B0C10] hover:border-[#00FFFF] transition-all hover:scale-105 cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="aspect-video bg-[#0B0C10] overflow-hidden">
                  <img
                    src={product.thumbnailUrl}
                    alt={product.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-2 text-[#E0E6ED]">{product.title}</h3>
                  <p className="text-sm text-[#C5C6C7] mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-[#00FFFF]">${product.price}</span>
                    <span className="text-xs text-[#8B949E]">{categoryLabels[product.category]}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-[#C5C6C7] text-lg">No products found in this category.</p>
          </div>
        )}

        {/* Product Detail Modal */}
        {selectedProduct && (
          <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedProduct(null)}
          >
            <div
              className="bg-[#1F2833] rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-[#E0E6ED]">{selectedProduct.title}</h2>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="text-[#C5C6C7] hover:text-[#00FFFF] text-2xl"
                  >
                    &times;
                  </button>
                </div>

                {selectedProduct.thumbnailUrl && (
                  <div className="mb-6">
                    <img
                      src={selectedProduct.thumbnailUrl}
                      alt={selectedProduct.title}
                      className="w-full rounded-lg"
                    />
                  </div>
                )}

                <div className="space-y-4">
                  <p className="text-[#C5C6C7]">{selectedProduct.description}</p>

                  {selectedProduct.features && (
                    <div>
                      <h3 className="text-lg font-bold mb-2 text-[#FFD700]">Features</h3>
                      <ul className="list-disc list-inside space-y-1 text-[#C5C6C7]">
                        {selectedProduct.features.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-[#0B0C10]">
                    <div>
                      <span className="text-3xl font-bold text-[#00FFFF]">${selectedProduct.price}</span>
                      <span className="text-[#C5C6C7] ml-2">{selectedProduct.currency}</span>
                    </div>
                    <button
                      onClick={() => handlePurchase(selectedProduct)}
                      className="px-8 py-3 bg-[#00FFFF] text-[#0B0C10] font-semibold rounded-lg hover:bg-[#FFD700] transition-colors"
                    >
                      Purchase
                    </button>
                  </div>

                  <p className="text-sm text-[#8B949E] text-center">
                    Powered by Creem - Secure payment processing
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Marketplace
