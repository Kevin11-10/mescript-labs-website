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
        <h1 className="text-4xl md:text-5xl font-bold mb-8 gradient-text animate-fade-in">Our Portfolio</h1>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          {availableCategories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCategory === category
                  ? 'btn-primary'
                  : 'btn-secondary'
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
                className="card overflow-hidden cursor-pointer group"
                onClick={() => setSelectedItem(item)}
              >
                {item.thumbnailUrl && (
                  <div className="aspect-video bg-[#0B0C10] overflow-hidden relative">
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-2 text-[#E0E6ED] group-hover:text-[#00FFFF] transition-colors">{item.title}</h3>
                  <p className="text-sm text-[#C5C6C7] mb-3 line-clamp-2">{item.description}</p>
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
            <div className="card p-8 inline-block">
              <p className="text-[#C5C6C7] text-lg">No portfolio items found in this category.</p>
            </div>
          </div>
        )}

        {/* Modal */}
        {selectedItem && (
          <div
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 animate-fade-in"
            onClick={() => setSelectedItem(null)}
          >
            <div
              className="card max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold gradient-text">{selectedItem.title}</h2>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="w-10 h-10 rounded-full bg-[#1F2833] flex items-center justify-center text-[#C5C6C7] hover:text-[#00FFFF] hover:bg-[#00FFFF]/10 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {selectedItem.url && (
                  <div className="mb-6 rounded-lg overflow-hidden">
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
                  <div className="flex flex-wrap gap-4 text-sm">
                    <span className="px-3 py-1 rounded-full bg-[#00FFFF]/10 text-[#00FFFF]">{categoryLabels[selectedItem.category]}</span>
                    {selectedItem.date && <span className="px-3 py-1 rounded-full bg-[#1F2833] text-[#C5C6C7]">Date: {selectedItem.date}</span>}
                    {selectedItem.client && <span className="px-3 py-1 rounded-full bg-[#1F2833] text-[#C5C6C7]">Client: {selectedItem.client}</span>}
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
