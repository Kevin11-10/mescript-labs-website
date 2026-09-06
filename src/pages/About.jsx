import { motion } from 'framer-motion'

const About = () => {
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
          About Mescript Labs
        </motion.h1>

        <div className="max-w-3xl space-y-16">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-semibold text-white mb-6">Our Mission</h2>
            <p className="text-lg text-[#a0a0a0]">
              At Mescript Labs, we are driven by a passion for innovation and creativity. Our mission is to craft
              exceptional digital experiences that push the boundaries of what's possible in 3D modeling, game
              development, and application development.
            </p>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-semibold text-white mb-8">What We Do</h2>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 gap-12"
            >
              {[
                {
                  title: '3D Modeling',
                  description: 'We create stunning 3D assets for games, visualizations, product renders, and architectural visualizations.'
                },
                {
                  title: 'Game Development',
                  description: 'From concept to completion, we develop immersive gaming experiences with engaging gameplay and compelling narratives.'
                },
                {
                  title: 'App Development',
                  description: 'We build custom applications tailored to your specific needs, whether it\'s a mobile app, web application, or desktop software.'
                },
                {
                  title: 'Creative Services',
                  description: 'Beyond development, we offer creative consulting, asset creation, and technical artistry.'
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
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-semibold text-white mb-8">Our Values</h2>
            <motion.ul
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-4 text-[#a0a0a0]"
            >
              {[
                { label: 'Innovation', text: 'We constantly explore new technologies and techniques to stay at the forefront of digital creativity.' },
                { label: 'Quality', text: 'We never compromise on quality, ensuring every deliverable meets the highest standards.' },
                { label: 'Collaboration', text: 'We believe in the power of teamwork and work closely with our clients to achieve their goals.' },
                { label: 'Integrity', text: 'We conduct our business with honesty, transparency, and respect for all stakeholders.' }
              ].map((value, index) => (
                <motion.li
                  key={index}
                  variants={itemVariants}
                  whileHover={{ x: 10 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <strong className="text-white">{value.label}:</strong> {value.text}
                </motion.li>
              ))}
            </motion.ul>
          </motion.section>
        </div>
      </div>
    </div>
  )
}

export default About
