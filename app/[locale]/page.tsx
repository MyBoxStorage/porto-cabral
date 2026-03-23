import { HeroSection }     from '@/components/home/HeroSection'
import { DishesSection }   from '@/components/home/DishesSection'
import { HistorySection }  from '@/components/home/HistorySection'
import { VideoStrip }      from '@/components/home/VideoStrip'
import { Testimonials }    from '@/components/home/Testimonials'
import { LocationSection } from '@/components/home/LocationSection'
import { ReservaSection }  from '@/components/home/ReservaSection'
import { getLocale }       from 'next-intl/server'

export default async function HomePage() {
  const locale = (await getLocale()) as 'pt' | 'en' | 'es'

  return (
    <main className="overflow-x-hidden">
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
