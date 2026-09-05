const Contact = () => {
  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData)

    // For now, just log the data. In production, this would send an email
    console.log('Form submitted:', data)
    alert('Thank you for your message! We will get back to you soon.')
    e.target.reset()
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-[#00FFFF]">Contact Us</h1>

        <div className="bg-[#1F2833] p-8 rounded-lg border border-[#0B0C10]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2 text-[#E0E6ED]">
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-4 py-3 bg-[#0B0C10] border border-[#1F2833] rounded-lg text-[#E0E6ED] focus:border-[#00FFFF] focus:outline-none transition-colors"
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2 text-[#E0E6ED]">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-4 py-3 bg-[#0B0C10] border border-[#1F2833] rounded-lg text-[#E0E6ED] focus:border-[#00FFFF] focus:outline-none transition-colors"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-2 text-[#E0E6ED]">
                Subject *
              </label>
              <select
                id="subject"
                name="subject"
                required
                className="w-full px-4 py-3 bg-[#0B0C10] border border-[#1F2833] rounded-lg text-[#E0E6ED] focus:border-[#00FFFF] focus:outline-none transition-colors"
              >
                <option value="">Select a subject</option>
                <option value="commission">Commission</option>
                <option value="complaint">Complaint</option>
                <option value="fan-mail">Fan Mail</option>
                <option value="suggestion">Suggestion</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2 text-[#E0E6ED]">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                rows="6"
                required
                className="w-full px-4 py-3 bg-[#0B0C10] border border-[#1F2833] rounded-lg text-[#E0E6ED] focus:border-[#00FFFF] focus:outline-none transition-colors resize-none"
                placeholder="Your message..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full px-8 py-3 bg-[#00FFFF] text-[#0B0C10] font-semibold rounded-lg hover:bg-[#FFD700] transition-colors"
            >
              Send Message
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-[#0B0C10]">
            <p className="text-[#C5C6C7] mb-4">Or connect with us on YouTube:</p>
            <a
              href="https://www.youtube.com/@MescriptLabs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-[#00FFFF] hover:text-[#FFD700] transition-colors"
            >
              <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              @MescriptLabs
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
