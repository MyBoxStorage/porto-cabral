'use client'
import { HeroSection }     from '@/components/home/HeroSection'
import { DishesSection }   from '@/components/home/DishesSection'
import { HistorySection }  from '@/components/home/HistorySection'
import { VideoStrip }      from '@/components/home/VideoStrip'
import { Testimonials }    from '@/components/home/Testimonials'
import { LocationSection } from '@/components/home/LocationSection'
import { ReservaSection }  from '@/components/home/ReservaSection'
import { useLocale }       from 'next-intl'

export default function HomePage() {
  const locale = useLocale() as 'pt' | 'en' | 'es'

  return (
    <main>
      <HeroSection />
      <DishesSection />
      <HistorySection />
      <VideoStrip locale={locale} />
      <Testimonials />
      <LocationSection />
      <ReservaSection />
    </main>
  )
}
