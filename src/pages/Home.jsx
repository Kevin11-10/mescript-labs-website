import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="py-32 px-4">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-6xl font-semibold text-white mb-6 max-w-4xl">
            Crafting Digital Experiences at the Intersection of 3D, Gaming, and Innovation
          </h1>
          <p className="text-xl text-[#a0a0a0] mb-8 max-w-2xl">
            We bring your ideas to life through cutting-edge 3D modeling, game development, and app development
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
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
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 px-4 border-t border-[#2a2a2a]">
        <div className="container mx-auto">
          <h2 className="text-3xl font-semibold text-white mb-16">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">3D Modeling</h3>
              <p className="text-[#a0a0a0]">
                High-quality 3D assets for games, visualizations, and product renders
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Game Development</h3>
              <p className="text-[#a0a0a0]">
                Full-cycle game development from concept to release
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">App Development</h3>
              <p className="text-[#a0a0a0]">
                Custom web and mobile applications tailored to your needs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 px-4 border-t border-[#2a2a2a]">
        <div className="container mx-auto">
          <h2 className="text-3xl font-semibold text-white mb-8">About Us</h2>
          <div className="max-w-3xl">
            <p className="text-lg text-[#a0a0a0] mb-8">
              Mescript Labs is a creative digital studio specializing in 3D modeling, game development, and app development. We're passionate about bringing innovative ideas to life through technology and design.
            </p>
            <Link to="/about" className="px-6 py-3 bg-white text-black font-medium hover:bg-[#a0a0a0] transition-colors">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 px-4 border-t border-[#2a2a2a]">
        <div className="container mx-auto">
          <h2 className="text-3xl font-semibold text-white mb-8">Ready to Start Your Project?</h2>
          <p className="text-xl text-[#a0a0a0] mb-8 max-w-2xl">
            Let's discuss how we can help bring your vision to life
          </p>
          <Link to="/contact" className="px-6 py-3 bg-white text-black font-medium hover:bg-[#a0a0a0] transition-colors">
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
