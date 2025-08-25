
import RallySlider from '@/components/RallySlider';
import Image from 'next/image';
import AdMob from '@/components/AdMob';
import RallyNews from '@/components/RallyNews';
import NavigationMenu from '@/components/NavigationMenu';
import LiveRallies from '@/components/LiveRallies';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Image
              src="https://rallylive.net/wp-content/uploads/cropped-rallylive-logo-64-ico.png"
              alt="RallyLive Net Logo"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <h1 className="text-2xl font-bold font-headline text-foreground">
              RallyLive
            </h1>
          </div>
          <NavigationMenu />
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <section className="mb-12">
          <RallySlider />
        </section>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
          <section className="lg:col-span-2">
            <RallyNews />
          </section>
          <section>
            <LiveRallies />
          </section>
        </div>
        <section className="w-full">
          <AdMob adSlot="9476568198" />
        </section>
      </main>
      <footer className="py-6 border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} RallyLive Net. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
