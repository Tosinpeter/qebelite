import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { 
  Heart, 
  ArrowLeft, 
  Target, 
  Users, 
  Trophy, 
  Lightbulb,
  Rocket,
  Shield,
  Zap,
  CheckCircle2
} from "lucide-react";
import { useLocation } from "wouter";
import logoImage from "@assets/logo_1759665184540.png";

export default function AboutUs() {
  const [, setLocation] = useLocation();

  const values = [
    {
      icon: Heart,
      title: "Passion for Fitness",
      description: "We believe fitness transforms lives. Our mission is to make expert training accessible to everyone, everywhere."
    },
    {
      icon: Users,
      title: "Community First",
      description: "We foster a supportive community where athletes of all levels encourage and inspire each other to reach their goals."
    },
    {
      icon: Shield,
      title: "Trust & Safety",
      description: "Your privacy and safety are paramount. We maintain the highest standards of data security and user protection."
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "We continuously innovate to bring you the latest in fitness technology and training methodologies."
    }
  ];

  const team = [
    {
      name: "Alex Morrison",
      role: "Founder & CEO",
      bio: "Former Olympic athlete with 15+ years of coaching experience. Passionate about making fitness accessible to all.",
      initial: "A",
      color: "from-blue-500 to-blue-600"
    },
    {
      name: "Sarah Chen",
      role: "Head of Coaching",
      bio: "Certified nutritionist and strength coach. Believes in sustainable, science-based fitness approaches.",
      initial: "S",
      color: "from-purple-500 to-purple-600"
    },
    {
      name: "Marcus Williams",
      role: "Chief Technology Officer",
      bio: "Tech innovator building the future of digital fitness. Previously led development at major health tech companies.",
      initial: "M",
      color: "from-green-500 to-green-600"
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Community",
      bio: "Expert in building engaged fitness communities. Ensures every member feels supported and motivated.",
      initial: "E",
      color: "from-orange-500 to-orange-600"
    }
  ];

  const milestones = [
    { year: "2020", event: "QB Elite Founded", description: "Started with a vision to revolutionize elite fitness training" },
    { year: "2021", event: "1,000 Users", description: "Reached our first thousand active users" },
    { year: "2022", event: "Coach Network Launch", description: "Connected users with certified elite coaches" },
    { year: "2023", event: "10,000 Users", description: "Expanded to 10K users across 20 countries" },
    { year: "2024", event: "Series A Funding", description: "Raised $10M to scale our platform" },
    { year: "2025", event: "50+ Elite Coaches", description: "Built a network of expert elite coaches and trainers" }
  ];

  const stats = [
    { value: "10K+", label: "Active Users" },
    { value: "50+", label: "Expert Coaches" },
    { value: "500+", label: "Workout Programs" },
    { value: "4.9★", label: "User Rating" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setLocation('/')}>
              <img src={logoImage} alt="QB Elite Logo" className="h-8 w-auto" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                QB Elite
              </span>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Button 
                variant="ghost"
                onClick={() => setLocation('/')}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-purple-400/10 dark:bg-purple-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="secondary" className="mb-6">
            <Heart className="w-4 h-4 mr-1" />
            Our Story
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            About QB Elite
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            We're on a mission to empower elite athletes and fitness enthusiasts worldwide to achieve their goals through 
            personalized training, expert coaching, and a supportive community.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative py-16 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <p className="text-gray-600 dark:text-gray-400 font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="relative py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-2 overflow-hidden">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2">
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-12 text-white flex flex-col justify-center">
                  <Target className="h-16 w-16 mb-6" />
                  <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                  <p className="text-white/90 text-lg leading-relaxed">
                    To make world-class fitness training accessible to everyone, regardless of location, 
                    experience level, or budget. We believe everyone deserves the opportunity to live a 
                    healthier, stronger life.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-12 text-white flex flex-col justify-center">
                  <Rocket className="h-16 w-16 mb-6" />
                  <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
                  <p className="text-white/90 text-lg leading-relaxed">
                    To become the world's most trusted fitness platform, where millions of people 
                    achieve their health and fitness goals through personalized guidance and community support.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Values Section */}
      <div className="relative py-16 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              <Zap className="w-4 h-4 mr-1" />
              Our Values
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What We Stand For
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              These core values guide everything we do at QB Elite
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-6">
                    <value.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="relative py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              <Users className="w-4 h-4 mr-1" />
              Meet the Team
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              The People Behind QB Elite
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our diverse team brings together expertise in fitness, technology, and community building
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center text-white text-3xl font-bold`}>
                      {member.initial}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        {member.name}
                      </h3>
                      <p className="text-blue-600 dark:text-blue-400 font-semibold mb-3">
                        {member.role}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {member.bio}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="relative py-16 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              <Trophy className="w-4 h-4 mr-1" />
              Our Journey
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Key Milestones
            </h2>
          </div>

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="relative pl-8 border-l-4 border-blue-600 dark:border-blue-400">
                <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-blue-600 dark:bg-blue-400 border-4 border-white dark:border-gray-900"></div>
                <div className="pb-8">
                  <Badge className="mb-2">{milestone.year}</Badge>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {milestone.event}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {milestone.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white">
            <CardContent className="p-12 text-center">
              <Heart className="h-16 w-16 mx-auto mb-6" />
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Join Our Elite Community
              </h2>
              <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
                Be part of an elite movement that's transforming lives through fitness. Download QB Elite today 
                and start your journey to a healthier, stronger you.
              </p>
              <Button 
                size="lg" 
                className="bg-white text-purple-600 hover:bg-gray-100 shadow-xl"
                onClick={() => setLocation('/')}
              >
                Download the App
                <CheckCircle2 className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-8 bg-white/50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © 2025 QB Elite. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

