import { useState } from 'react'
import { useAppContext } from '../contexts/AppContext'

const TeamEditor = () => {
  const { teamData, updateTeamData } = useAppContext()
  const [editingItem, setEditingItem] = useState(null)
  const [isAdding, setIsAdding] = useState(false)

  const handleSave = async (item) => {
    try {
      const updatedData = editingItem
        ? teamData.map((i) => (i.id === item.id ? item : i))
        : [...teamData, { ...item, id: Date.now().toString() }]

      updateTeamData(updatedData)
      setEditingItem(null)
      setIsAdding(false)
    } catch (error) {
      console.error('Error saving team member:', error)
    }
  }

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this team member?')) {
      const updatedData = teamData.filter((item) => item.id !== id)
      updateTeamData(updatedData)
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
        <h2 className="text-2xl font-bold text-[#E0E6ED]">Team Management</h2>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-[#00FFFF] text-[#0B0C10] rounded-lg hover:bg-[#FFD700] transition-colors"
        >
          Add New Member
        </button>
      </div>

      {(isAdding || editingItem) && (
        <div className="bg-[#0B0C10] p-6 rounded-lg border border-[#1F2833]">
          <h3 className="text-xl font-bold mb-4 text-[#FFD700]">
            {editingItem ? 'Edit Team Member' : 'Add New Team Member'}
          </h3>
          <TeamForm
            member={editingItem || {}}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teamData.map((member) => (
          <div
            key={member.id}
            className="bg-[#1F2833] p-4 rounded-lg border border-[#0B0C10] hover:border-[#00FFFF] transition-colors"
          >
            {member.photoUrl && (
              <img
                src={member.photoUrl}
                alt={member.name}
                className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
              />
            )}
            <h4 className="font-bold text-[#E0E6ED] text-center mb-1">{member.name}</h4>
            <p className="text-sm text-[#00FFFF] text-center mb-3">{member.role}</p>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(member)}
                className="flex-1 px-3 py-1 bg-[#00FFFF] text-[#0B0C10] rounded text-sm hover:bg-[#FFD700] transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(member.id)}
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

const TeamForm = ({ member, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: member.name || '',
    role: member.role || '',
    bio: member.bio || '',
    photoUrl: member.photoUrl || '',
    youtube: member.socialLinks?.youtube || '',
    twitter: member.socialLinks?.twitter || '',
    linkedin: member.socialLinks?.linkedin || '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const socialLinks = {
      ...(formData.youtube && { youtube: formData.youtube }),
      ...(formData.twitter && { twitter: formData.twitter }),
      ...(formData.linkedin && { linkedin: formData.linkedin }),
    }

    onSave({
      ...formData,
      socialLinks: Object.keys(socialLinks).length > 0 ? socialLinks : undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2 text-[#E0E6ED]">Name *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="w-full px-4 py-2 bg-[#1F2833] border border-[#0B0C10] rounded text-[#E0E6ED] focus:border-[#00FFFF] focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-[#E0E6ED]">Role *</label>
        <input
          type="text"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          required
          className="w-full px-4 py-2 bg-[#1F2833] border border-[#0B0C10] rounded text-[#E0E6ED] focus:border-[#00FFFF] focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-[#E0E6ED]">Bio *</label>
        <textarea
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          required
          rows={3}
          className="w-full px-4 py-2 bg-[#1F2833] border border-[#0B0C10] rounded text-[#E0E6ED] focus:border-[#00FFFF] focus:outline-none resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-[#E0E6ED]">Photo URL</label>
        <input
          type="url"
          value={formData.photoUrl}
          onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
          className="w-full px-4 py-2 bg-[#1F2833] border border-[#0B0C10] rounded text-[#E0E6ED] focus:border-[#00FFFF] focus:outline-none"
          placeholder="https://..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-[#E0E6ED]">YouTube URL</label>
        <input
          type="url"
          value={formData.youtube}
          onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
          className="w-full px-4 py-2 bg-[#1F2833] border border-[#0B0C10] rounded text-[#E0E6ED] focus:border-[#00FFFF] focus:outline-none"
          placeholder="https://youtube.com/..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-[#E0E6ED]">Twitter URL</label>
        <input
          type="url"
          value={formData.twitter}
          onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
          className="w-full px-4 py-2 bg-[#1F2833] border border-[#0B0C10] rounded text-[#E0E6ED] focus:border-[#00FFFF] focus:outline-none"
          placeholder="https://twitter.com/..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-[#E0E6ED]">LinkedIn URL</label>
        <input
          type="url"
          value={formData.linkedin}
          onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
          className="w-full px-4 py-2 bg-[#1F2833] border border-[#0B0C10] rounded text-[#E0E6ED] focus:border-[#00FFFF] focus:outline-none"
          placeholder="https://linkedin.com/in/..."
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

export default TeamEditor
