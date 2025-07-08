import RallySlider from '@/components/RallySlider';
import { Flag } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center">
          <div className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-8 w-8 text-primary"
            >
              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
              <line x1="4" y1="22" x2="4" y2="15"></line>
            </svg>
            <h1 className="text-2xl font-bold font-headline text-foreground">
              RallyLive Net
            </h1>
          </div>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <section className="mb-12">
          <h2 className="text-4xl font-bold font-headline text-center mb-2">Live Rallies</h2>
          <p className="text-center text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Follow the action as it happens from stages around the world.
          </p>
          <RallySlider />
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
