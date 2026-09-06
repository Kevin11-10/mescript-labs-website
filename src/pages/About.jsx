import { useAppContext } from '../contexts/AppContext'

const About = () => {
  const { teamData } = useAppContext()

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 gradient-text animate-fade-in">About Mescript Labs</h1>

        <div className="max-w-4xl mx-auto space-y-8">
          <section className="card p-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-2xl font-bold mb-4 gradient-text">Our Mission</h2>
            <p className="text-lg text-[#C5C6C7]">
              At Mescript Labs, we are driven by a passion for innovation and creativity. Our mission is to craft
              exceptional digital experiences that push the boundaries of what's possible in 3D modeling, game
              development, and application development. We believe in the power of technology to transform ideas
              into reality, and we're committed to delivering excellence in every project we undertake.
            </p>
          </section>

          <section className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-2xl font-bold mb-4 gradient-text">What We Do</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card p-6 group">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00FFFF]/20 to-[#66FCF1]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-[#00FFFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#E0E6ED]">3D Modeling</h3>
                <p className="text-[#C5C6C7]">
                  We create stunning 3D assets for games, visualizations, product renders, and architectural
                  visualizations. Our models are optimized for performance while maintaining exceptional visual
                  quality.
                </p>
              </div>
              <div className="card p-6 group">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FFD700]/20 to-[#FFA500]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-[#FFD700]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#E0E6ED]">Game Development</h3>
                <p className="text-[#C5C6C7]">
                  From concept to completion, we develop immersive gaming experiences with engaging gameplay,
                  compelling narratives, and breathtaking visuals that captivate players.
                </p>
              </div>
              <div className="card p-6 group">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00FFFF]/20 to-[#66FCF1]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-[#00FFFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#E0E6ED]">App Development</h3>
                <p className="text-[#C5C6C7]">
                  We build custom applications tailored to your specific needs, whether it's a mobile app, web
                  application, or desktop software. Our solutions are user-friendly, scalable, and robust.
                </p>
              </div>
              <div className="card p-6 group">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FFD700]/20 to-[#FFA500]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-[#FFD700]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#E0E6ED]">Creative Services</h3>
                <p className="text-[#C5C6C7]">
                  Beyond development, we offer creative consulting, asset creation, and technical artistry to
                  help bring your vision to life with precision and artistry.
                </p>
              </div>
            </div>
          </section>

          <section className="card p-8 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <h2 className="text-2xl font-bold mb-4 gradient-text">Our Values</h2>
            <ul className="space-y-4 text-[#C5C6C7]">
              <li className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-[#00FFFF]/10 flex items-center justify-center mr-4 flex-shrink-0">
                  <svg className="w-4 h-4 text-[#00FFFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span><strong className="text-[#E0E6ED]">Innovation:</strong> We constantly explore new technologies and techniques to stay at the forefront of digital creativity.</span>
              </li>
              <li className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-[#00FFFF]/10 flex items-center justify-center mr-4 flex-shrink-0">
                  <svg className="w-4 h-4 text-[#00FFFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span><strong className="text-[#E0E6ED]">Quality:</strong> We never compromise on quality, ensuring every deliverable meets the highest standards.</span>
              </li>
              <li className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-[#00FFFF]/10 flex items-center justify-center mr-4 flex-shrink-0">
                  <svg className="w-4 h-4 text-[#00FFFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span><strong className="text-[#E0E6ED]">Collaboration:</strong> We believe in the power of teamwork and work closely with our clients to achieve their goals.</span>
              </li>
              <li className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-[#00FFFF]/10 flex items-center justify-center mr-4 flex-shrink-0">
                  <svg className="w-4 h-4 text-[#00FFFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span><strong className="text-[#E0E6ED]">Integrity:</strong> We conduct our business with honesty, transparency, and respect for all stakeholders.</span>
              </li>
            </ul>
          </section>

          {teamData.length > 0 && (
            <section className="animate-fade-in" style={{ animationDelay: '0.8s' }}>
              <h2 className="text-2xl font-bold mb-6 gradient-text">Our Team</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teamData.map((member) => (
                  <div
                    key={member.id}
                    className="card p-6 text-center group"
                  >
                    {member.photoUrl && (
                      <div className="relative inline-block mb-4">
                        <img
                          src={member.photoUrl}
                          alt={member.name}
                          className="w-24 h-24 rounded-full mx-auto object-cover ring-4 ring-[#00FFFF]/20 group-hover:ring-[#00FFFF]/40 transition-all"
                        />
                      </div>
                    )}
                    <h3 className="text-xl font-bold mb-2 text-[#E0E6ED] group-hover:text-[#00FFFF] transition-colors">{member.name}</h3>
                    <p className="text-[#00FFFF] mb-3">{member.role}</p>
                    <p className="text-[#C5C6C7] text-sm mb-4">{member.bio}</p>
                    {member.socialLinks && (
                      <div className="flex justify-center space-x-4">
                        {member.socialLinks.youtube && (
                          <a
                            href={member.socialLinks.youtube}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-[#1F2833] flex items-center justify-center text-[#C5C6C7] hover:text-[#00FFFF] hover:bg-[#00FFFF]/10 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                            </svg>
                          </a>
                        )}
                        {member.socialLinks.twitter && (
                          <a
                            href={member.socialLinks.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-[#1F2833] flex items-center justify-center text-[#C5C6C7] hover:text-[#00FFFF] hover:bg-[#00FFFF]/10 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                          </a>
                        )}
                        {member.socialLinks.linkedin && (
                          <a
                            href={member.socialLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-[#1F2833] flex items-center justify-center text-[#C5C6C7] hover:text-[#00FFFF] hover:bg-[#00FFFF]/10 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
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
