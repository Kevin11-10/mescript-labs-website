const TermsOfService = () => {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-[#00FFFF]">Terms of Service</h1>

        <div className="bg-[#1F2833] p-8 rounded-lg border border-[#0B0C10] space-y-6">
          <section>
            <h2 className="text-2xl font-bold mb-4 text-[#FFD700]">Acceptance of Terms</h2>
            <p className="text-[#C5C6C7]">
              By accessing and using the Mescript Labs website, you accept and agree to be bound by the terms and provisions of this agreement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-[#FFD700]">Use License</h2>
            <p className="text-[#C5C6C7]">
              Permission is granted to temporarily download one copy of the materials on Mescript Labs' website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#C5C6C7] mt-2">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose</li>
              <li>Attempt to reverse engineer any software contained on the website</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-[#FFD700]">Disclaimer</h2>
            <p className="text-[#C5C6C7]">
              The materials on Mescript Labs' website are provided on an 'as is' basis. Mescript Labs makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-[#FFD700]">Limitations</h2>
            <p className="text-[#C5C6C7]">
              In no event shall Mescript Labs or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Mescript Labs' website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-[#FFD700]">Accuracy of Materials</h2>
            <p className="text-[#C5C6C7]">
              The materials appearing on Mescript Labs' website could include technical, typographical, or photographic errors. Mescript Labs does not warrant that any of the materials on its website are accurate, complete, or current.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-[#FFD700]">Links</h2>
            <p className="text-[#C5C6C7]">
              Mescript Labs has not reviewed all of the sites linked to our website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Mescript Labs of the site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-[#FFD700]">Modifications</h2>
            <p className="text-[#C5C6C7]">
              Mescript Labs may revise these terms of service at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-[#FFD700]">Governing Law</h2>
            <p className="text-[#C5C6C7]">
              These terms and conditions are governed by and construed in accordance with the laws of your jurisdiction and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.
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

export default TermsOfService
