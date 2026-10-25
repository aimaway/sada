import { useTranslations } from 'next-intl'
import { useState } from 'react'

export default function FairPrice() {
  const t = useTranslations('landing')
  const [selectedService, setSelectedService] = useState('oil_change')
  const [selectedVehicle, setSelectedVehicle] = useState('car')

  // Mock price data
  const priceData = {
    oil_change: { min: 200, max: 400, avg: 300, sample_size: 145 },
    battery: { min: 400, max: 800, avg: 600, sample_size: 89 },
    brakes: { min: 300, max: 700, avg: 500, sample_size: 67 },
    tires: { min: 200, max: 600, avg: 400, sample_size: 112 },
  }

  const currentPrice = priceData[selectedService as keyof typeof priceData]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="section-title">{t('fair_price.title')}</h2>
          <p className="section-subtitle">{t('fair_price.subtitle')}</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="card">
            {/* Service selector */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-navy-900 mb-3">
                {t('fair_price.select_service')}
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.keys(priceData).map((service) => (
                  <button
                    key={service}
                    onClick={() => setSelectedService(service)}
                    className={`p-4 rounded-card border-2 transition-all ${
                      selectedService === service
                        ? 'border-orange bg-orange-50'
                        : 'border-navy-200 hover:border-navy-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">
                      {service === 'oil_change' && '🛢️'}
                      {service === 'battery' && '🔋'}
                      {service === 'brakes' && '🔧'}
                      {service === 'tires' && '🛞'}
                    </div>
                    <p className="text-sm font-medium capitalize">
                      {service.replace('_', ' ')}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Vehicle selector */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-navy-900 mb-3">
                {t('fair_price.select_vehicle')}
              </label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {['car', 'motorcycle', 'scooter', 'van', 'taxi', 'ebike'].map((vehicle) => (
                  <button
                    key={vehicle}
                    onClick={() => setSelectedVehicle(vehicle)}
                    className={`p-3 rounded-card border-2 transition-all ${
                      selectedVehicle === vehicle
                        ? 'border-orange bg-orange-50'
                        : 'border-navy-200 hover:border-navy-300'
                    }`}
                  >
                    <div className="text-xl mb-1">
                      {vehicle === 'car' && '🚗'}
                      {vehicle === 'motorcycle' && '🏍️'}
                      {vehicle === 'scooter' && '🛵'}
                      {vehicle === 'van' && '🚐'}
                      {vehicle === 'taxi' && '🚕'}
                      {vehicle === 'ebike' && '🚲'}
                    </div>
                    <p className="text-xs font-medium capitalize">{vehicle}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Price display */}
            <div className="bg-navy-50 rounded-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-navy-600">{t('fair_price.typical_range')}</span>
                <span className="text-2xl font-bold text-navy-900">
                  {currentPrice.min} - {currentPrice.max} MAD
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-navy-600">{t('fair_price.average_price')}</span>
                <span className="text-xl font-semibold text-emerald">
                  {currentPrice.avg} MAD
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-navy-500">{t('fair_price.based_on')}</span>
                <span className="text-navy-600 font-medium">
                  {currentPrice.sample_size} {t('fair_price.jobs')}
                </span>
              </div>

              {/* Verdict example */}
              <div className="pt-4 border-t border-navy-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl">✅</span>
                  </div>
                  <div>
                    <p className="font-semibold text-navy-900">
                      {t('fair_price.sample_verdict.title')}
                    </p>
                    <p className="text-sm text-navy-600">
                      {t('fair_price.sample_verdict.description')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-6 text-center">
              <button className="btn-primary">
                {t('fair_price.cta')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
