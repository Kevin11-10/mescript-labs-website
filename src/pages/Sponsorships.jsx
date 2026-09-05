import { useState } from 'react'

const Sponsorships = () => {
  const [selectedTier, setSelectedTier] = useState(null)

  const tiers = [
    {
      id: 'bronze',
      name: 'Bronze',
      price: '$5-10',
      color: '#CD7F32',
      benefits: [
        'Basic support tier',
        'Name in supporters list',
        'Access to supporter Discord channel',
      ],
    },
    {
      id: 'silver',
      name: 'Silver',
      price: '$25-50',
      color: '#C0C0C0',
      benefits: [
        'All Bronze benefits',
        '10% discount on marketplace items',
        'Early access to new releases',
        'Monthly supporter updates',
      ],
    },
    {
      id: 'gold',
      name: 'Gold',
      price: '$100-250',
      color: '#FFD700',
      benefits: [
        'All Silver benefits',
        '20% discount on marketplace items',
        'Priority support',
        'Behind-the-scenes content access',
        'Beta access to new projects',
      ],
    },
    {
      id: 'platinum',
      name: 'Platinum',
      price: '$500+',
      color: '#E5E4E2',
      benefits: [
        'All Gold benefits',
        '30% discount on marketplace items',
        'Cameo in products/games',
        'Custom asset request (monthly)',
        'Direct team communication',
      ],
    },
    {
      id: 'diamond',
      name: 'Diamond',
      price: '$1000+',
      color: '#B9F2FF',
      benefits: [
        'All Platinum benefits',
        '50% discount on marketplace items',
        'Major cameo in projects',
        'Exclusive Diamond-only events',
        'Lifetime supporter status',
        'Custom project consultation',
      ],
    },
  ]

  const goals = [
    {
      id: 1,
      title: 'Domain Name',
      description: 'Help us purchase a custom domain for the website',
      target: 20,
      current: 0,
      currency: 'USDT',
    },
    {
      id: 2,
      title: 'Company Emails',
      description: 'Set up professional email addresses for the team',
      target: 50,
      current: 0,
      currency: 'USDT',
    },
  ]

  const handleSponsor = (tier) => {
    setSelectedTier(tier)
    // In production, this would integrate with Creem payment processing
    alert(`Sponsorship tier: ${tier.name}\nPrice: ${tier.price}\n\nPayment integration coming soon!`)
  }

  const handleDonate = () => {
    // In production, this would integrate with Creem payment processing
    alert('One-time donation feature coming soon!')
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center text-[#00FFFF]">Support Our Work</h1>
        <p className="text-center text-[#C5C6C7] mb-12 max-w-2xl mx-auto">
          Become a sponsor and help us continue creating amazing digital experiences. Choose a tier that suits you or make a one-time donation.
        </p>

        {/* Sponsorship Tiers */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-[#FFD700]">Sponsorship Tiers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className="bg-[#1F2833] p-6 rounded-lg border border-[#0B0C10] hover:border-[#00FFFF] transition-all hover:scale-105"
              >
                <div
                  className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold"
                  style={{ backgroundColor: tier.color, color: '#0B0C10' }}
                >
                  {tier.name[0]}
                </div>
                <h3 className="text-xl font-bold text-center mb-2 text-[#E0E6ED]">{tier.name}</h3>
                <p className="text-center text-[#00FFFF] font-semibold mb-4">{tier.price}</p>
                <ul className="space-y-2 mb-6 text-sm text-[#C5C6C7]">
                  {tier.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-[#00FFFF] mr-2">✓</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleSponsor(tier)}
                  className="w-full px-4 py-2 bg-[#00FFFF] text-[#0B0C10] rounded-lg font-semibold hover:bg-[#FFD700] transition-colors"
                >
                  Sponsor
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Goal-Based Sponsorships */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-[#FFD700]">Goal-Based Sponsorships</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {goals.map((goal) => (
              <div key={goal.id} className="bg-[#1F2833] p-6 rounded-lg border border-[#0B0C10]">
                <h3 className="text-xl font-bold mb-2 text-[#E0E6ED]">{goal.title}</h3>
                <p className="text-[#C5C6C7] mb-4">{goal.description}</p>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-[#C5C6C7]">
                      ${goal.current} / ${goal.target} {goal.currency}
                    </span>
                    <span className="text-[#00FFFF]">
                      {Math.round((goal.current / goal.target) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-[#0B0C10] rounded-full h-3">
                    <div
                      className="h-3 rounded-full transition-all duration-300"
                      style={{
                        width: `${(goal.current / goal.target) * 100}%`,
                        backgroundColor: '#00FFFF',
                      }}
                    ></div>
                  </div>
                </div>
                <button
                  onClick={() => alert(`Contribute to ${goal.title} - Payment integration coming soon!`)}
                  className="w-full px-4 py-2 bg-[#00FFFF] text-[#0B0C10] rounded-lg font-semibold hover:bg-[#FFD700] transition-colors"
                >
                  Contribute
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* One-Time Donation */}
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-4 text-[#FFD700]">One-Time Donation</h2>
          <p className="text-[#C5C6C7] mb-6 max-w-xl mx-auto">
            Prefer to make a one-time contribution? Every bit helps us continue our work!
          </p>
          <button
            onClick={handleDonate}
            className="px-8 py-3 bg-[#00FFFF] text-[#0B0C10] rounded-lg font-semibold hover:bg-[#FFD700] transition-colors"
          >
            Buy Us a Coffee
          </button>
          <p className="mt-4 text-sm text-[#8B949E]">
            Powered by Creem - Secure payment processing
          </p>
        </section>
      </div>
    </div>
  )
}

export default Sponsorships
