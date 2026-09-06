const About = () => {
  return (
    <div className="py-32 px-4">
      <div className="container mx-auto">
        <h1 className="text-4xl md:text-5xl font-semibold text-white mb-16">About Mescript Labs</h1>

        <div className="max-w-3xl space-y-16">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-6">Our Mission</h2>
            <p className="text-lg text-[#a0a0a0]">
              At Mescript Labs, we are driven by a passion for innovation and creativity. Our mission is to craft
              exceptional digital experiences that push the boundaries of what's possible in 3D modeling, game
              development, and application development.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-8">What We Do</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">3D Modeling</h3>
                <p className="text-[#a0a0a0]">
                  We create stunning 3D assets for games, visualizations, product renders, and architectural
                  visualizations.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Game Development</h3>
                <p className="text-[#a0a0a0]">
                  From concept to completion, we develop immersive gaming experiences with engaging gameplay
                  and compelling narratives.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">App Development</h3>
                <p className="text-[#a0a0a0]">
                  We build custom applications tailored to your specific needs, whether it's a mobile app, web
                  application, or desktop software.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Creative Services</h3>
                <p className="text-[#a0a0a0]">
                  Beyond development, we offer creative consulting, asset creation, and technical artistry.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-8">Our Values</h2>
            <ul className="space-y-4 text-[#a0a0a0]">
              <li><strong className="text-white">Innovation:</strong> We constantly explore new technologies and techniques to stay at the forefront of digital creativity.</li>
              <li><strong className="text-white">Quality:</strong> We never compromise on quality, ensuring every deliverable meets the highest standards.</li>
              <li><strong className="text-white">Collaboration:</strong> We believe in the power of teamwork and work closely with our clients to achieve their goals.</li>
              <li><strong className="text-white">Integrity:</strong> We conduct our business with honesty, transparency, and respect for all stakeholders.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}

export default About
