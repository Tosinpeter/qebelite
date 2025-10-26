import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { 
  Users, 
  Calendar, 
  Video, 
  Dumbbell, 
  Apple,
  Trophy,
  TrendingUp,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle2,
  LogIn,
  Smartphone,
  Heart,
  Target,
  Clock,
  Star,
  Play
} from "lucide-react";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import logoImage from "@assets/logo_1759665184540.png";

export default function Landing() {
  const [, setLocation] = useLocation();
  const [scrollY, setScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: Dumbbell,
      title: "Smart Workouts",
      description: "Access expertly designed workout programs tailored to your fitness level and goals. Follow along with video demonstrations.",
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-100 dark:bg-orange-900/20"
    },
    {
      icon: Apple,
      title: "Nutrition Guidance",
      description: "Get personalized meal plans, healthy recipes, and nutrition tips to fuel your fitness journey effectively.",
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/20"
    },
    {
      icon: Users,
      title: "Group Huddles",
      description: "Join live group training sessions and connect with a community of athletes pursuing similar goals.",
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/20"
    },
    {
      icon: Trophy,
      title: "Personal Coaching",
      description: "Book one-on-one sessions with certified coaches who provide personalized guidance and accountability.",
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900/20"
    },
    {
      icon: Target,
      title: "Track Progress",
      description: "Monitor your fitness journey with detailed analytics, workout logs, and achievement milestones.",
      color: "text-pink-600 dark:text-pink-400",
      bgColor: "bg-pink-100 dark:bg-pink-900/20"
    },
    {
      icon: Video,
      title: "Video Library",
      description: "Learn proper form and technique with our extensive library of exercise tutorials and training content.",
      color: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-100 dark:bg-indigo-900/20"
    }
  ];

  const stats = [
    { value: "10K+", label: "Active Users" },
    { value: "500+", label: "Workouts" },
    { value: "50+", label: "Expert Coaches" },
    { value: "4.9★", label: "App Rating" }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Athlete",
      content: "This app transformed my training routine. The workout plans are incredible and the coaches are so supportive!",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Fitness Enthusiast",
      content: "Best fitness app I've used. Love the nutrition guidance and the community huddles keep me motivated.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Runner",
      content: "The personal coaching feature is worth it alone. My coach helped me achieve my marathon goal!",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation Header */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-md' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setLocation('/')}>
              <img src={logoImage} alt="QEB Elite Logo" className="h-8 w-auto" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                QEB Elite
              </span>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Button 
                variant="ghost"
                onClick={() => setLocation('/sign-in')}
                className="hidden sm:flex"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Admin Login
              </Button>
              <Button 
                onClick={() => {
                  document.getElementById('download')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Download App
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden pt-16">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-3xl"
            style={{ transform: `translateY(${scrollY * 0.2}px)` }}
          />
          <div 
            className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-purple-400/10 dark:bg-purple-600/10 rounded-full blur-3xl"
            style={{ transform: `translateY(${-scrollY * 0.2}px)` }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2">
                <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
                  <Smartphone className="w-4 h-4 mr-1" />
                  Your Personal Fitness Coach
                </Badge>
              </div>

              {/* Main Heading */}
              <div className="space-y-6">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                    QEB Elite
                  </span>
                  <br />
                  <span className="text-gray-900 dark:text-white">
                    Premium Fitness Training
                  </span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-xl">
                  Join elite athletes who train smarter with personalized workouts, 
                  expert coaching, and a supportive community—all in one powerful app.
                </p>
              </div>

              {/* Download Buttons */}
              <div id="download" className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto text-base px-8 py-6 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all"
                >
                  <Apple className="mr-2 h-6 w-6" />
                  <div className="text-left">
                    <div className="text-xs">Download on the</div>
                    <div className="text-sm font-semibold">App Store</div>
                  </div>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="w-full sm:w-auto text-base px-8 py-6 border-2 shadow-lg hover:shadow-xl transition-all"
                >
                  <Play className="mr-2 h-6 w-6" />
                  <div className="text-left">
                    <div className="text-xs">Get it on</div>
                    <div className="text-sm font-semibold">Google Play</div>
                  </div>
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center lg:text-left">
                    <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Phone Mockup */}
            <div className="relative lg:block hidden">
              <div className="relative mx-auto" style={{ width: '320px', height: '650px' }}>
                {/* Phone Frame */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-[3rem] shadow-2xl p-3">
                  <div className="w-full h-full bg-white dark:bg-gray-800 rounded-[2.5rem] overflow-hidden">
                    {/* Phone Screen Content */}
                    <div className="relative h-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-8 flex flex-col items-center justify-center text-white">
                      <div className="space-y-6 text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm">
                          <Dumbbell className="h-10 w-10" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold mb-2">Your Workouts</h3>
                          <p className="text-sm text-white/90">Track & Train</p>
                        </div>
                        <div className="space-y-3 w-full">
                          {['Upper Body', 'Cardio', 'Core Training'].map((workout, i) => (
                            <div key={i} className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-left">
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-sm">{workout}</span>
                                <CheckCircle2 className="h-5 w-5" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Notch */}
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 w-24 h-6 bg-gray-900 rounded-full"></div>
                </div>
                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg font-semibold text-sm">
                  <Heart className="inline h-4 w-4 mr-1" /> Active
                </div>
                <div className="absolute -bottom-4 -left-4 bg-orange-500 text-white px-4 py-2 rounded-full shadow-lg font-semibold text-sm">
                  <Trophy className="inline h-4 w-4 mr-1" /> Top Rated
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="relative py-24 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              <Zap className="w-4 h-4 mr-1" />
              Powerful Features
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              From beginner to elite athlete, our app has all the tools you need to reach your fitness goals
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/20 bg-white dark:bg-gray-800"
              >
                <CardContent className="p-8">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${feature.bgColor} mb-6 group-hover:scale-110 transition-transform`}>
                    <feature.icon className={`h-8 w-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="relative py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              <Star className="w-4 h-4 mr-1 fill-current" />
              Testimonials
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Loved by Athletes Everywhere
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Don't just take our word for it—here's what our community has to say
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white dark:bg-gray-800 hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed italic">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="relative py-24 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              Simple Process
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Get Started in 3 Easy Steps
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "1",
                icon: Smartphone,
                title: "Download the App",
                description: "Get QEB Elite from the App Store or Google Play and create your free account"
              },
              {
                step: "2",
                icon: Target,
                title: "Set Your Goals",
                description: "Tell us about your fitness level and what you want to achieve"
              },
              {
                step: "3",
                icon: Trophy,
                title: "Start Training",
                description: "Follow personalized workouts and track your progress to success"
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="relative inline-block mb-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto">
                    <step.icon className="h-12 w-12 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center text-lg">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative overflow-hidden rounded-3xl">
            <Card className="border-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white">
              <CardContent className="p-12 sm:p-16 relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-10 left-10 w-32 h-32 border-4 border-white rounded-full"></div>
                  <div className="absolute bottom-10 right-10 w-40 h-40 border-4 border-white rounded-full"></div>
                  <div className="absolute top-1/2 left-1/4 w-24 h-24 border-4 border-white rounded-full"></div>
                </div>
                
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-6">
                    <Heart className="h-8 w-8" />
                  </div>
                  <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                    Ready to Transform Your Fitness?
                  </h2>
                  <p className="text-xl mb-10 text-white/90 max-w-2xl mx-auto">
                    Join thousands of athletes who are already achieving their goals with QEB Elite. 
                    Download now and get your first week free!
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button 
                      size="lg" 
                      className="w-full sm:w-auto text-base px-8 py-6 bg-white text-purple-600 hover:bg-gray-100 shadow-xl"
                    >
                      <Apple className="mr-2 h-6 w-6" />
                      <div className="text-left">
                        <div className="text-xs">Download on the</div>
                        <div className="text-sm font-semibold">App Store</div>
                      </div>
                    </Button>
                    <Button 
                      size="lg" 
                      className="w-full sm:w-auto text-base px-8 py-6 bg-white text-purple-600 hover:bg-gray-100 shadow-xl"
                    >
                      <Play className="mr-2 h-6 w-6" />
                      <div className="text-left">
                        <div className="text-xs">Get it on</div>
                        <div className="text-sm font-semibold">Google Play</div>
                      </div>
                    </Button>
                  </div>
                  <p className="text-sm mt-6 text-white/80">
                    <CheckCircle2 className="inline h-4 w-4 mr-1" />
                    No credit card required • Cancel anytime
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-12 bg-white/50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <img src={logoImage} alt="QEB Elite Logo" className="h-8 w-auto" />
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  QEB Elite
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 max-w-md">
                Your complete fitness companion. Train smarter, eat better, and achieve your goals with personalized guidance from elite coaches.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Features</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                <li>Workout Programs</li>
                <li>Nutrition Plans</li>
                <li>Personal Coaching</li>
                <li>Progress Tracking</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Company</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                <li>
                  <button 
                    onClick={() => setLocation('/about-us')}
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setLocation('/contact-us')}
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Contact
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setLocation('/privacy-policy')}
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setLocation('/terms-of-service')}
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Terms of Service
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © 2025 QEB Elite. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setLocation('/sign-in')}
                className="text-gray-600 dark:text-gray-400"
              >
                <Shield className="h-4 w-4 mr-2" />
                Admin Portal
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

