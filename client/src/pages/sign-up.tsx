import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { userQueries } from "@/lib/supabase-queries";
import logoPath from "@assets/logo_1759609546853.png";
import { Link } from "wouter";

interface SignUpProps {
  onSignUp: () => void;
}

export default function SignUp({ onSignUp }: SignUpProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [recipePreference, setRecipePreference] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Sign up failed",
          description: error.message,
        });
        setIsLoading(false);
        return;
      }

      if (data.user) {
        try {
          await userQueries.create({
            id: data.user.id,
            email: email,
            displayName: fullname,
            role: 'user',
            age,
            height,
            weight,
            recipePreference,
          });

          toast({
            title: "Account created successfully!",
            description: "You can now sign in with your credentials.",
          });
          
          onSignUp();
        } catch (profileError: any) {
          console.error("Profile creation error:", profileError);
          toast({
            variant: "destructive",
            title: "Profile creation failed",
            description: "Your account was created but the profile couldn't be set up. Please contact support.",
          });
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <img src={logoPath} alt="QEB Elite Logo" className="h-16" />
          </div>
          <CardTitle className="text-2xl font-bold">Create your account</CardTitle>
          <CardDescription>
            Fill in your details to get started
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
                minLength={6}
                data-testid="input-password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fullname">Full Name</Label>
              <Input
                id="fullname"
                type="text"
                placeholder="John Doe"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                required
                data-testid="input-fullname"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="text"
                  placeholder="25"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  data-testid="input-age"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height</Label>
                <Input
                  id="height"
                  type="text"
                  placeholder="5'10&quot;"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  data-testid="input-height"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Weight</Label>
                <Input
                  id="weight"
                  type="text"
                  placeholder="180 lbs"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  data-testid="input-weight"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="recipePreference">Recipe Pref.</Label>
                <Input
                  id="recipePreference"
                  type="text"
                  placeholder="Vegan"
                  value={recipePreference}
                  onChange={(e) => setRecipePreference(e.target.value)}
                  data-testid="input-recipe-preference"
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading} data-testid="button-sign-up">
              {isLoading ? "Creating account..." : "Sign up"}
            </Button>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/sign-in" className="text-primary hover:underline" data-testid="link-sign-in">
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
