
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, LogInIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import NavigationMenu from '@/components/NavigationMenu';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}>
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.902,35.619,44,30.412,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
    </svg>
);


export default function LoginPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleGoogleLoginSuccess = (credentialResponse: CredentialResponse) => {
    console.log('Google Login Success:', credentialResponse);
    setLoading(true);

    // TODO: Send credentialResponse.credential (the JWT token) to your WordPress backend
    // Your backend should verify the token with Google and then create a session for the user.

    toast({
      title: "Login Successful",
      description: "You've successfully logged in with Google. You would now be redirected.",
    });

    // You would typically redirect the user after a successful login
    // e.g., window.location.href = '/dashboard';
    
    setTimeout(() => setLoading(false), 1000);
  };

  const handleGoogleLoginError = () => {
    console.error('Google Login Failed');
    toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Google login failed. Please try again.",
    });
  };


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
                unoptimized
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
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex items-center justify-center">
        <div className="w-full max-w-md">
            <div className="mb-4">
                 <Link href="/">
                    <Button variant="outline">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Home
                    </Button>
                </Link>
            </div>
            <Card>
                <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold font-headline flex items-center justify-center">
                    <LogInIcon className="mr-2 h-6 w-6" />
                    Login
                </CardTitle>
                <CardDescription>
                    Sign in with your Google account to continue.
                </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center space-y-4">
                    {loading ? (
                        <p>Signing in...</p>
                    ) : (
                       <GoogleLogin
                         onSuccess={handleGoogleLoginSuccess}
                         onError={handleGoogleLoginError}
                         theme="outline"
                         shape="rectangular"
                       />
                    )}
                </CardContent>
            </Card>
        </div>
      </main>
       <footer className="py-6 border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} RallyLive Net. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
