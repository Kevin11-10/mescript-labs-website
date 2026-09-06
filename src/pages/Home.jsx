import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const Home = () => {
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
    <div>
      {/* Hero Section */}
      <section className="py-32 px-4 relative overflow-hidden">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="container mx-auto relative z-10"
        >
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-6xl font-semibold text-white mb-6 max-w-4xl"
          >
            Crafting Digital Experiences at the Intersection of 3D, Gaming, and Innovation
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-xl text-[#a0a0a0] mb-8 max-w-2xl"
          >
            We bring your ideas to life through cutting-edge 3D modeling, game development, and app development
          </motion.p>
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              to="/portfolio"
              className="px-6 py-3 bg-white text-black font-medium hover:bg-[#a0a0a0] transition-colors"
            >
              Explore Our Work
            </Link>
            <Link
              to="/contact"
              className="px-6 py-3 border border-white text-white font-medium hover:bg-white hover:text-black transition-colors"
            >
              Get in Touch
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Services Section */}
      <section className="py-24 px-4 border-t border-[#2a2a2a]">
        <div className="container mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-semibold text-white mb-16"
          >
            Our Services
          </motion.h2>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
          >
            {[
              {
                title: '3D Modeling',
                description: 'High-quality 3D assets for games, visualizations, product renders, and architectural visualizations.'
              },
              {
                title: 'Game Development',
                description: 'Full-cycle game development from concept to release with engaging gameplay and compelling narratives.'
              },
              {
                title: 'App Development',
                description: 'Custom web and mobile applications tailored to your specific needs.'
              }
            ].map((service, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <h3 className="text-xl font-semibold text-white mb-4">{service.title}</h3>
                <p className="text-[#a0a0a0]">{service.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 px-4 border-t border-[#2a2a2a]">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <h2 className="text-3xl font-semibold text-white mb-8">About Us</h2>
            <p className="text-lg text-[#a0a0a0] mb-8">
              Mescript Labs is a creative digital studio specializing in 3D modeling, game development, and app development. We're passionate about bringing innovative ideas to life through technology and design.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/about" className="px-6 py-3 bg-white text-black font-medium hover:bg-[#a0a0a0] transition-colors inline-block">
                Learn More
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 px-4 border-t border-[#2a2a2a]">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-semibold text-white mb-8">Ready to Start Your Project?</h2>
            <p className="text-xl text-[#a0a0a0] mb-8 max-w-2xl">
              Let's discuss how we can help bring your vision to life
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/contact" className="px-6 py-3 bg-white text-black font-medium hover:bg-[#a0a0a0] transition-colors inline-block">
                Contact Us
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home
