
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import NavigationMenu from '@/components/NavigationMenu';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link href="/">
              <Image
                src="https://rallylive.net/wp-content/uploads/cropped-rallylive-logo-64-ico.png"
                alt="RallyLive Net Logo"
                width={32}
                height={32}
                className="h-8 w-8"
              />
            </Link>
            <Link href="/">
              <h1 className="text-2xl font-bold font-headline text-foreground">
                RallyLive
              </h1>
            </Link>
          </div>
          <NavigationMenu />
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-4">
            <Link href="/">
                <Button variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                </Button>
            </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>At www.rallylive.net, the privacy of our visitors is of extreme importance to us. This privacy policy document outlines the types of personal information is received and collected by www.rallylive.net and how it is used.</p>

            <h3>Log Files</h3>
            <p>Like many other Web sites, www.rallylive.net makes use of log files. The information inside the log files includes internet protocol ( IP ) addresses, type of browser, Internet Service Provider ( ISP ), date/time stamp, referring/exit pages, and number of clicks to analyze trends, administer the site, track user’s movement around the site, and gather demographic information. IP addresses, and other such information are not linked to any information that is personally identifiable.</p>

            <h3>Cookies &amp; Data</h3>
            <p>We use cookies on yourdomain.com. A cookie is a piece of data stored on a site visitor’s hard drive to help us improve your access to our site and identify repeat visitors to our site. Cookies may also enable us to track and target user interests to improve experience on our website in the future.</p>
            <ul className="list-disc pl-6">
                <li>We don’t collect personal information unless it is needed (ex, newsletter)</li>
                <li>We don’t share your personal information except to comply with the law</li>
                <li>We don’t store your personal information on our servers unless it’s required to operate one of our website services (ex, comments)</li>
            </ul>
            <p>Usage of a cookie is in no way linked to any personally identifiable information about you. Any personal information is only collected when you voluntarily provide it, such as providing your email address to subscribe to a newsletter.</p>
            <p>The following is a list of possible cookies and data collected when using RallyLive.net. Please refer to each service’s privacy policy for more information on the exact types of data collected:</p>
            <ul className="list-disc pl-6">
                <li>Google Analytics: _ga, _gid and _gat_gtag cookie data kept 26 months</li>
                <li>Cloudflare: _cfduid cookie data</li>
                <li>MailChimp: email address kept until you unsubscribe</li>
                <li>Rafflecopter: name, email address kept until a giveaway promotion winner is announced</li>
            </ul>
            <p>If you wish to disable cookies, you may do so through your individual browser options. More detailed information about cookie management with specific web browsers can be found at the browsers’ respective websites.</p>
            <ul className="list-disc pl-6">
                <li>Disable Cookies in Chrome</li>
                <li>Disable Cookies in Firefox</li>
                <li>Disable Cookies in Safari</li>
                <li>Disable Cookies in Internet Explorer</li>
            </ul>

            <h3>Newsletter</h3>
            <p>RallyLive.net does maintain a newsletter which visitors may signup for voluntarily using the subscription form in out footer and at the end of blog posts. To subscribe you must provide your email address via the MailChimp subscription form and confirm subscription using the double-optin form. RallyLive.net does not share this information.</p>

            <h3>Comments</h3>
            <p>When visitors leave comments on the site we collect the data shown in the comments form, and also the visitor’s IP address and browser user agent string to help spam detection. An anonymized string created from your email address (also called a hash) may be provided to the Gravatar service to see if you are using it. Please see the Gravatar service privacy policy for more information. After approval of your comment, your profile picture is visible to the public in the context of your comment.</p>
            <p>We use Akismet on RallyLive.net to help prevent spam. Any comments submitted through this service are not saved on our servers unless they were marked as false positives, in which case we store them long enough to use them to improve the service to avoid future false positives. Click here to learn how your comment data is processed by the Akismet service.</p>

            <h3>Protection of Information</h3>
            <p>Yourdomain.com takes all measures reasonably necessary to protect against the unauthorized access, use, alteration, or destruction of potentially personally-identifying and personally-identifying information.</p>

            <h3>Your Data Rights</h3>
            <p>If you have an account on this site, or have left comments, you can request to receive an exported file of the personal data we hold about you, including any data you have provided to us. You can also request that we erase any personal data we hold about you. This does not include any data we are obliged to keep for administrative, legal, or security purposes.</p>

            <h3>Privacy Policy Changes</h3>
            <p>RallyLive.net reserves the right to change this policy at any time. We encourage visitors to check this page for Privacy Policy updates regularly. Continued use of this website after any change in this Privacy Policy will constitute your acceptance of such change.</p>
            <p>If you require any more information or have any questions about our privacy policy, please feel free to contact us at contact[at]rallylive(dot)net</p>
          </CardContent>
        </Card>
      </main>
      <footer className="py-6 border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} RallyLive Net. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
