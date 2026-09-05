import { useState } from 'react'
import { useAppContext } from '../../contexts/AppContext'

const PortfolioEditor = () => {
  const { portfolioData, updatePortfolioData } = useAppContext()
  const [editingItem, setEditingItem] = useState(null)
  const [isAdding, setIsAdding] = useState(false)

  const categories = [
    'props-and-low-poly',
    'scenes-and-environments',
    'games-and-apps',
    'product-renders',
    'archiviz-renders',
  ]

  const handleSave = async (item) => {
    try {
      const updatedData = editingItem
        ? portfolioData.map((i) => (i.id === item.id ? item : i))
        : [...portfolioData, { ...item, id: Date.now().toString() }]

      updatePortfolioData(updatedData)
      setEditingItem(null)
      setIsAdding(false)
    } catch (error) {
      console.error('Error saving portfolio item:', error)
    }
  }

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this item?')) {
      const updatedData = portfolioData.filter((item) => item.id !== id)
      updatePortfolioData(updatedData)
    }
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setIsAdding(false)
  }

  const handleAdd = () => {
    setEditingItem(null)
    setIsAdding(true)
  }

  const handleCancel = () => {
    setEditingItem(null)
    setIsAdding(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#E0E6ED]">Portfolio Management</h2>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-[#00FFFF] text-[#0B0C10] rounded-lg hover:bg-[#FFD700] transition-colors"
        >
          Add New Item
        </button>
      </div>

      {(isAdding || editingItem) && (
        <div className="bg-[#0B0C10] p-6 rounded-lg border border-[#1F2833]">
          <h3 className="text-xl font-bold mb-4 text-[#FFD700]">
            {editingItem ? 'Edit Item' : 'Add New Item'}
          </h3>
          <PortfolioForm
            item={editingItem || {}}
            onSave={handleSave}
            onCancel={handleCancel}
            categories={categories}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {portfolioData.map((item) => (
          <div
            key={item.id}
            className="bg-[#1F2833] p-4 rounded-lg border border-[#0B0C10] hover:border-[#00FFFF] transition-colors"
          >
            {item.thumbnailUrl && (
              <img
                src={item.thumbnailUrl}
                alt={item.title}
                className="w-full h-32 object-cover rounded mb-3"
              />
            )}
            <h4 className="font-bold text-[#E0E6ED] mb-2">{item.title}</h4>
            <p className="text-sm text-[#C5C6C7] mb-3 line-clamp-2">{item.description}</p>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(item)}
                className="flex-1 px-3 py-1 bg-[#00FFFF] text-[#0B0C10] rounded text-sm hover:bg-[#FFD700] transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const PortfolioForm = ({ item, onSave, onCancel, categories }) => {
  const [formData, setFormData] = useState({
    title: item.title || '',
    description: item.description || '',
    category: item.category || categories[0],
    url: item.url || '',
    thumbnailUrl: item.thumbnailUrl || '',
    date: item.date || '',
    client: item.client || '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2 text-[#E0E6ED]">Title *</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          className="w-full px-4 py-2 bg-[#1F2833] border border-[#0B0C10] rounded text-[#E0E6ED] focus:border-[#00FFFF] focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-[#E0E6ED]">Description *</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
          rows={3}
          className="w-full px-4 py-2 bg-[#1F2833] border border-[#0B0C10] rounded text-[#E0E6ED] focus:border-[#00FFFF] focus:outline-none resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-[#E0E6ED]">Category *</label>
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          required
          className="w-full px-4 py-2 bg-[#1F2833] border border-[#0B0C10] rounded text-[#E0E6ED] focus:border-[#00FFFF] focus:outline-none"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-[#E0E6ED]">URL *</label>
        <input
          type="url"
          value={formData.url}
          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          required
          className="w-full px-4 py-2 bg-[#1F2833] border border-[#0B0C10] rounded text-[#E0E6ED] focus:border-[#00FFFF] focus:outline-none"
          placeholder="https://..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-[#E0E6ED]">Thumbnail URL</label>
        <input
          type="url"
          value={formData.thumbnailUrl}
          onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
          className="w-full px-4 py-2 bg-[#1F2833] border border-[#0B0C10] rounded text-[#E0E6ED] focus:border-[#00FFFF] focus:outline-none"
          placeholder="https://..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-[#E0E6ED]">Date</label>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="w-full px-4 py-2 bg-[#1F2833] border border-[#0B0C10] rounded text-[#E0E6ED] focus:border-[#00FFFF] focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-[#E0E6ED]">Client</label>
        <input
          type="text"
          value={formData.client}
          onChange={(e) => setFormData({ ...formData, client: e.target.value })}
          className="w-full px-4 py-2 bg-[#1F2833] border border-[#0B0C10] rounded text-[#E0E6ED] focus:border-[#00FFFF] focus:outline-none"
        />
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-[#00FFFF] text-[#0B0C10] rounded-lg hover:bg-[#FFD700] transition-colors"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 bg-[#1F2833] text-[#C5C6C7] rounded-lg hover:bg-[#0B0C10] transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default PortfolioEditor
