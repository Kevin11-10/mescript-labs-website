import { useAppContext } from '../contexts/AppContext'

const About = () => {
  const { teamData } = useAppContext()

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-[#00FFFF]">About Mescript Labs</h1>

        <div className="max-w-4xl mx-auto space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4 text-[#FFD700]">Our Mission</h2>
            <p className="text-lg text-[#C5C6C7]">
              At Mescript Labs, we are driven by a passion for innovation and creativity. Our mission is to craft
              exceptional digital experiences that push the boundaries of what's possible in 3D modeling, game
              development, and application development. We believe in the power of technology to transform ideas
              into reality, and we're committed to delivering excellence in every project we undertake.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-[#FFD700]">What We Do</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#1F2833] p-6 rounded-lg border border-[#0B0C10]">
                <h3 className="text-xl font-bold mb-3 text-[#E0E6ED]">3D Modeling</h3>
                <p className="text-[#C5C6C7]">
                  We create stunning 3D assets for games, visualizations, product renders, and architectural
                  visualizations. Our models are optimized for performance while maintaining exceptional visual
                  quality.
                </p>
              </div>
              <div className="bg-[#1F2833] p-6 rounded-lg border border-[#0B0C10]">
                <h3 className="text-xl font-bold mb-3 text-[#E0E6ED]">Game Development</h3>
                <p className="text-[#C5C6C7]">
                  From concept to completion, we develop immersive gaming experiences with engaging gameplay,
                  compelling narratives, and breathtaking visuals that captivate players.
                </p>
              </div>
              <div className="bg-[#1F2833] p-6 rounded-lg border border-[#0B0C10]">
                <h3 className="text-xl font-bold mb-3 text-[#E0E6ED]">App Development</h3>
                <p className="text-[#C5C6C7]">
                  We build custom applications tailored to your specific needs, whether it's a mobile app, web
                  application, or desktop software. Our solutions are user-friendly, scalable, and robust.
                </p>
              </div>
              <div className="bg-[#1F2833] p-6 rounded-lg border border-[#0B0C10]">
                <h3 className="text-xl font-bold mb-3 text-[#E0E6ED]">Creative Services</h3>
                <p className="text-[#C5C6C7]">
                  Beyond development, we offer creative consulting, asset creation, and technical artistry to
                  help bring your vision to life with precision and artistry.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-[#FFD700]">Our Values</h2>
            <ul className="space-y-3 text-[#C5C6C7]">
              <li className="flex items-start">
                <span className="text-[#00FFFF] mr-3">✓</span>
                <span><strong>Innovation:</strong> We constantly explore new technologies and techniques to stay at the forefront of digital creativity.</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#00FFFF] mr-3">✓</span>
                <span><strong>Quality:</strong> We never compromise on quality, ensuring every deliverable meets the highest standards.</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#00FFFF] mr-3">✓</span>
                <span><strong>Collaboration:</strong> We believe in the power of teamwork and work closely with our clients to achieve their goals.</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#00FFFF] mr-3">✓</span>
                <span><strong>Integrity:</strong> We conduct our business with honesty, transparency, and respect for all stakeholders.</span>
              </li>
            </ul>
          </section>

          {teamData.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-6 text-[#FFD700]">Our Team</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    <h3 className="text-xl font-bold text-center mb-2 text-[#E0E6ED]">{member.name}</h3>
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
            </section>
          )}
        </div>
      </div>
    </div>
  )
}

export default About
