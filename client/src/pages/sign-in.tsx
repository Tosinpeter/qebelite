import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SignInProps {
  onSignIn: () => void;
}

export default function SignIn({ onSignIn }: SignInProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignIn();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <svg className="w-12 h-12" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M25.2 0H7.8C3.49218 0 0 3.49218 0 7.8V25.2C0 29.5078 3.49218 33 7.8 33H25.2C29.5078 33 33 29.5078 33 25.2V7.8C33 3.49218 29.5078 0 25.2 0Z" fill="currentColor" className="text-primary"/>
              <path d="M23.1 16.5L16.5 9.9L9.9 16.5L16.5 23.1L23.1 16.5Z" fill="white"/>
            </svg>
          </div>
          <CardTitle className="text-2xl font-bold">Sign in to Flowbite</CardTitle>
          <CardDescription>
            Enter your credentials to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                data-testid="input-email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                data-testid="input-password"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                  data-testid="checkbox-remember"
                />
                <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                  Remember me
                </Label>
              </div>
              <a href="#" className="text-sm text-primary hover:underline" data-testid="link-forgot-password">
                Forgot password?
              </a>
            </div>
            <Button type="submit" className="w-full" data-testid="button-sign-in">
              Sign in
            </Button>
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              Don't have an account?{" "}
              <a href="#" className="text-primary hover:underline" data-testid="link-sign-up">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
