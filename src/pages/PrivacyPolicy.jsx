const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-[#00FFFF]">Privacy Policy</h1>

        <div className="bg-[#1F2833] p-8 rounded-lg border border-[#0B0C10] space-y-6">
          <section>
            <h2 className="text-2xl font-bold mb-4 text-[#FFD700]">Introduction</h2>
            <p className="text-[#C5C6C7]">
              At Mescript Labs, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information when you visit our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-[#FFD700]">Information We Collect</h2>
            <ul className="list-disc list-inside space-y-2 text-[#C5C6C7]">
              <li>Contact form submissions (name, email, subject, message)</li>
              <li>Authentication data for admin users (email, password hash)</li>
              <li>Transaction data for sponsorships and marketplace purchases</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-[#FFD700]">How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2 text-[#C5C6C7]">
              <li>To respond to your inquiries via contact form</li>
              <li>To process payments and deliver purchased assets</li>
              <li>To track sponsorship transactions and goal progress</li>
              <li>To provide admin access to authorized users</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-[#FFD700]">Data Storage and Security</h2>
            <p className="text-[#C5C6C7]">
              We use Supabase as our database provider. Your data is stored securely and we implement industry-standard security measures to protect it. Passwords are hashed using bcrypt before storage.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-[#FFD700]">Third-Party Services</h2>
            <p className="text-[#C5C6C7]">
              We use the following third-party services:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#C5C6C7] mt-2">
              <li><strong>Creem.io:</strong> Payment processing and asset delivery</li>
              <li><strong>Supabase:</strong> Database and authentication</li>
              <li><strong>Netlify:</strong> Website hosting and deployment</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-[#FFD700]">Cookies</h2>
            <p className="text-[#C5C6C7]">
              We use minimal cookies for essential functionality only, such as maintaining admin sessions. We do not use tracking cookies for analytics purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-[#FFD700]">Your Rights</h2>
            <p className="text-[#C5C6C7]">
              You have the right to request access to, correction of, or deletion of your personal data. To make such a request, please contact us at mescriptlabs@gmail.com.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-[#FFD700]">Contact Us</h2>
            <p className="text-[#C5C6C7]">
              If you have any questions about this Privacy Policy, please contact us at mescriptlabs@gmail.com.
            </p>
          </section>

          <section>
            <p className="text-sm text-[#8B949E]">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
