import { useState } from 'react'
import { useAppContext } from '../contexts/AppContext'
import { motion, AnimatePresence } from 'framer-motion'

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <div className="py-32 px-4">
      <div className="container mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-semibold text-white mb-16"
        >
          Our Portfolio
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap gap-4 mb-16"
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'text-white'
                  : 'text-[#a0a0a0] hover:text-white'
              }`}
            >
              {categoryLabels[category]}
            </motion.button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {item.thumbnailUrl && (
                    <div className="aspect-video bg-[#1a1a1a] mb-4 overflow-hidden rounded-lg">
                      <motion.img
                        src={item.thumbnailUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  )}
                  <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-[#a0a0a0] mb-2">{item.description}</p>
                  <p className="text-xs text-[#666666]">{categoryLabels[item.category]}</p>
                </motion.div>
              ))
            ) : (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[#a0a0a0]"
              >
                No portfolio items found in this category.
              </motion.p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Portfolio
