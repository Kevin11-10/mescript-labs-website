import { motion } from 'framer-motion'

const Contact = () => {
  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData)
    console.log('Form submitted:', data)
    alert('Thank you for your message! We will get back to you soon.')
    e.target.reset()
  }

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
      <div className="container mx-auto max-w-2xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-semibold text-white mb-16"
        >
          Contact Us
        </motion.h1>

        <motion.form
          onSubmit={handleSubmit}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <motion.div variants={itemVariants}>
            <label htmlFor="name" className="block text-sm font-medium mb-2 text-white">Name</label>
            <motion.input
              type="text"
              id="name"
              name="name"
              required
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] text-white focus:border-white focus:outline-none transition-colors"
              placeholder="Your name"
              whileFocus={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label htmlFor="email" className="block text-sm font-medium mb-2 text-white">Email</label>
            <motion.input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] text-white focus:border-white focus:outline-none transition-colors"
              placeholder="your@email.com"
              whileFocus={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label htmlFor="subject" className="block text-sm font-medium mb-2 text-white">Subject</label>
            <motion.select
              id="subject"
              name="subject"
              required
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] text-white focus:border-white focus:outline-none transition-colors"
              whileFocus={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <option value="">Select a subject</option>
              <option value="commission">Commission</option>
              <option value="complaint">Complaint</option>
              <option value="fan-mail">Fan Mail</option>
              <option value="suggestion">Suggestion</option>
            </motion.select>
          </motion.div>

          <motion.div variants={itemVariants}>
            <label htmlFor="message" className="block text-sm font-medium mb-2 text-white">Message</label>
            <motion.textarea
              id="message"
              name="message"
              rows="6"
              required
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] text-white focus:border-white focus:outline-none transition-colors resize-none"
              placeholder="Your message..."
              whileFocus={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            ></motion.textarea>
          </motion.div>

          <motion.button
            variants={itemVariants}
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full px-6 py-3 bg-white text-black font-medium hover:bg-[#a0a0a0] transition-colors"
          >
            Send Message
          </motion.button>
        </motion.form>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16 pt-8 border-t border-[#2a2a2a]"
        >
          <p className="text-[#a0a0a0] mb-4">Or connect with us on YouTube:</p>
          <motion.a
            href="https://www.youtube.com/@MescriptLabs"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center text-white hover:text-[#a0a0a0] transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            @MescriptLabs
          </motion.a>
        </motion.div>
      </div>
    </div>
  )
}

export default Contact
