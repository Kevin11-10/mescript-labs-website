import { useState } from 'react'
import { useAppContext } from '../contexts/AppContext'

const Portfolio = () => {
  const { portfolioData } = useAppContext()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedItem, setSelectedItem] = useState(null)

  const categories = [
    'all',
    'props-and-low-poly',
    'scenes-and-environments',
    'games-and-apps',
    'product-renders',
    'archiviz-renders',
  ]

  const categoryLabels = {
    'all': 'All',
    'props-and-low-poly': 'Props and Low Poly Assets',
    'scenes-and-environments': 'Scenes and Environments',
    'games-and-apps': 'Games and Apps',
    'product-renders': 'Product Renders',
    'archiviz-renders': 'Archiviz Renders',
  }

  const filteredItems =
    selectedCategory === 'all'
      ? portfolioData
      : portfolioData.filter((item) => item.category === selectedCategory)

  const availableCategories = categories.filter((cat) =>
    cat === 'all' || portfolioData.some((item) => item.category === cat)
  )

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-[#00FFFF]">Our Portfolio</h1>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-8">
          {availableCategories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-[#00FFFF] text-[#0B0C10]'
                  : 'bg-[#1F2833] text-[#C5C6C7] hover:bg-[#0B0C10] hover:text-[#00FFFF]'
              }`}
            >
              {categoryLabels[category]}
            </button>
          ))}
        </div>

        {/* Portfolio Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-[#1F2833] rounded-lg overflow-hidden border border-[#0B0C10] hover:border-[#00FFFF] transition-colors cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                {item.thumbnailUrl && (
                  <div className="aspect-video bg-[#0B0C10] overflow-hidden">
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-2 text-[#E0E6ED]">{item.title}</h3>
                  <p className="text-sm text-[#C5C6C7] mb-2 line-clamp-2">{item.description}</p>
                  <div className="flex items-center justify-between text-xs text-[#8B949E]">
                    <span className="text-[#00FFFF]">{categoryLabels[item.category]}</span>
                    {item.date && <span>{item.date}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-[#C5C6C7] text-lg">No portfolio items found in this category.</p>
          </div>
        )}

        {/* Modal */}
        {selectedItem && (
          <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedItem(null)}
          >
            <div
              className="bg-[#1F2833] rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-[#E0E6ED]">{selectedItem.title}</h2>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="text-[#C5C6C7] hover:text-[#00FFFF] text-2xl"
                  >
                    &times;
                  </button>
                </div>

                {selectedItem.url && (
                  <div className="mb-6">
                    {selectedItem.url.includes('youtube') || selectedItem.url.includes('youtu.be') ? (
                      <div className="aspect-video">
                        <iframe
                          src={selectedItem.url.replace('watch?v=', 'embed/')}
                          title={selectedItem.title}
                          className="w-full h-full"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <img
                        src={selectedItem.url}
                        alt={selectedItem.title}
                        className="w-full rounded-lg"
                      />
                    )}
                  </div>
                )}

                <div className="space-y-4">
                  <p className="text-[#C5C6C7]">{selectedItem.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-[#8B949E]">
                    <span className="text-[#00FFFF]">{categoryLabels[selectedItem.category]}</span>
                    {selectedItem.date && <span>Date: {selectedItem.date}</span>}
                    {selectedItem.client && <span>Client: {selectedItem.client}</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Portfolio
