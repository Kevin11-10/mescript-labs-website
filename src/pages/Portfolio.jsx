import { useState } from 'react'
import { useAppContext } from '../contexts/AppContext'

const Portfolio = () => {
  const { portfolioData } = useAppContext()
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    'all',
    'props-and-low-poly',
    'scenes-and-environments',
    'games-and-apps',
  ]

  const categoryLabels = {
    'all': 'All',
    'props-and-low-poly': 'Props and Low Poly',
    'scenes-and-environments': 'Scenes and Environments',
    'games-and-apps': 'Games and Apps',
  }

  const filteredItems =
    selectedCategory === 'all'
      ? portfolioData
      : portfolioData.filter((item) => item.category === selectedCategory)

  return (
    <div className="py-32 px-4">
      <div className="container mx-auto">
        <h1 className="text-4xl md:text-5xl font-semibold text-white mb-16">Our Portfolio</h1>

        <div className="flex flex-wrap gap-4 mb-16">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'text-white'
                  : 'text-[#a0a0a0] hover:text-white'
              }`}
            >
              {categoryLabels[category]}
            </button>
          ))}
        </div>

        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <div key={item.id}>
                {item.thumbnailUrl && (
                  <div className="aspect-video bg-[#1a1a1a] mb-4 overflow-hidden">
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-[#a0a0a0] mb-2">{item.description}</p>
                <p className="text-xs text-[#666666]">{categoryLabels[item.category]}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[#a0a0a0]">No portfolio items found in this category.</p>
        )}
      </div>
    </div>
  )
}

export default Portfolio
