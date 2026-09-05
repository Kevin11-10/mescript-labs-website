import { Link } from 'react-router-dom'
import { useAppContext } from '../contexts/AppContext'

const Home = () => {
  const { teamData } = useAppContext()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 px-4 overflow-hidden">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#00FFFF] to-[#FFD700] bg-clip-text text-transparent">
            Crafting Digital Experiences at the Intersection of 3D, Gaming, and Innovation
          </h1>
          <p className="text-xl md:text-2xl text-[#C5C6C7] mb-8 max-w-3xl mx-auto">
            We bring your ideas to life through cutting-edge 3D modeling, game development, and app development
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/portfolio"
              className="px-8 py-3 bg-[#00FFFF] text-[#0B0C10] font-semibold rounded-lg hover:bg-[#FFD700] transition-colors"
            >
              Explore Our Work
            </Link>
            <Link
              to="/contact"
              className="px-8 py-3 border-2 border-[#00FFFF] text-[#00FFFF] font-semibold rounded-lg hover:bg-[#00FFFF] hover:text-[#0B0C10] transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section (Internal - Not Public) */}
      <section className="py-16 px-4 bg-[#1F2833]/50">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#00FFFF]">
            Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#1F2833] p-6 rounded-lg border border-[#0B0C10] hover:border-[#00FFFF] transition-colors">
              <div className="text-4xl mb-4">🎮</div>
              <h3 className="text-xl font-bold mb-2 text-[#E0E6ED]">3D Modeling</h3>
              <p className="text-[#C5C6C7]">
                High-quality 3D assets for games, visualizations, and product renders
              </p>
            </div>
            <div className="bg-[#1F2833] p-6 rounded-lg border border-[#0B0C10] hover:border-[#00FFFF] transition-colors">
              <div className="text-4xl mb-4">🕹️</div>
              <h3 className="text-xl font-bold mb-2 text-[#E0E6ED]">Game Development</h3>
              <p className="text-[#C5C6C7]">
                Immersive gaming experiences with engaging gameplay and stunning visuals
              </p>
            </div>
            <div className="bg-[#1F2833] p-6 rounded-lg border border-[#0B0C10] hover:border-[#00FFFF] transition-colors">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-bold mb-2 text-[#E0E6ED]">App Development</h3>
              <p className="text-[#C5C6C7]">
                Custom applications tailored to your specific needs and requirements
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#00FFFF]">
            About Us
          </h2>
          <div className="max-w-4xl mx-auto text-center mb-12">
            <p className="text-lg text-[#C5C6C7]">
              Mescript Labs is a creative studio dedicated to pushing the boundaries of digital experiences.
              We combine technical expertise with artistic vision to deliver exceptional results in 3D modeling,
              game development, and application development. Our team is passionate about innovation and
              committed to excellence in every project we undertake.
            </p>
          </div>

          {/* Team Section */}
          {teamData.length > 0 && (
            <div className="mt-16">
              <h3 className="text-2xl font-bold text-center mb-8 text-[#FFD700]">Meet Our Team</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {teamData.map((member) => (
                  <div
                    key={member.id}
                    className="bg-[#1F2833] p-6 rounded-lg border border-[#0B0C10] hover:border-[#00FFFF] transition-colors"
                  >
                    {member.photoUrl && (
                      <img
                        src={member.photoUrl}
                        alt={member.name}
                        className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                      />
                    )}
                    <h4 className="text-xl font-bold text-center mb-2 text-[#E0E6ED]">{member.name}</h4>
                    <p className="text-[#00FFFF] text-center mb-3">{member.role}</p>
                    <p className="text-[#C5C6C7] text-sm text-center mb-4">{member.bio}</p>
                    {member.socialLinks && (
                      <div className="flex justify-center space-x-4">
                        {member.socialLinks.youtube && (
                          <a
                            href={member.socialLinks.youtube}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#C5C6C7] hover:text-[#00FFFF] transition-colors"
                          >
                            YouTube
                          </a>
                        )}
                        {member.socialLinks.twitter && (
                          <a
                            href={member.socialLinks.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#C5C6C7] hover:text-[#00FFFF] transition-colors"
                          >
                            Twitter
                          </a>
                        )}
                        {member.socialLinks.linkedin && (
                          <a
                            href={member.socialLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#C5C6C7] hover:text-[#00FFFF] transition-colors"
                          >
                            LinkedIn
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 bg-[#1F2833]/50">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#00FFFF]">
            Get in Touch
          </h2>
          <div className="max-w-2xl mx-auto">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2 text-[#E0E6ED]">
                  Name
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
                  Email
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
                  Subject
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
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
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

            <div className="mt-8 text-center">
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
      </section>
    </div>
  )
}

export default Home
