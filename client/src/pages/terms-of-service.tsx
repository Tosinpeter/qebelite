import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { FileText, ArrowLeft, AlertCircle, Scale, Ban, UserX, DollarSign, Shield } from "lucide-react";
import { useLocation } from "wouter";
import logoImage from "@assets/logo_1759665184540.png";

export default function TermsOfService() {
  const [, setLocation] = useLocation();

  const sections = [
    {
      icon: FileText,
      title: "Acceptance of Terms",
      content: [
        "By accessing and using QB Elite, you accept and agree to be bound by these Terms of Service.",
        "If you do not agree to these terms, please do not use our services.",
        "We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of modified terms.",
        "You must be at least 13 years old to use our services. Users under 18 require parental consent."
      ]
    },
    {
      icon: UserX,
      title: "Account Registration",
      content: [
        "You must provide accurate, current, and complete information during registration.",
        "You are responsible for maintaining the confidentiality of your account credentials.",
        "You must notify us immediately of any unauthorized use of your account.",
        "One person or entity may not maintain more than one account.",
        "We reserve the right to suspend or terminate accounts that violate these terms."
      ]
    },
    {
      icon: AlertCircle,
      title: "Acceptable Use",
      content: [
        "You agree to use QB Elite only for lawful purposes and in accordance with these Terms.",
        "You will not use the service to harass, abuse, or harm another person.",
        "You will not transmit any viruses, malware, or other malicious code.",
        "You will not attempt to gain unauthorized access to our systems or other users' accounts.",
        "You will not use the service for any commercial purposes without our written consent.",
        "You will not impersonate any person or entity or misrepresent your affiliation."
      ]
    },
    {
      icon: Scale,
      title: "Intellectual Property",
      content: [
        "All content on QB Elite, including text, graphics, logos, videos, and software, is our property or our licensors'.",
        "You may not copy, modify, distribute, sell, or lease any part of our services without permission.",
        "User-generated content remains your property, but you grant us a license to use it.",
        "We reserve the right to remove any content that violates these terms or infringes on others' rights.",
        "Trademarks, service marks, and logos used on our platform are protected by law."
      ]
    },
    {
      icon: DollarSign,
      title: "Payments and Subscriptions",
      content: [
        "Subscription fees are billed in advance on a recurring basis (monthly or annually).",
        "Payment information must be accurate and up-to-date.",
        "We offer a free trial period for new users. You will be charged when the trial ends unless you cancel.",
        "Subscription fees are non-refundable except as required by law or stated in our refund policy.",
        "We reserve the right to change pricing with 30 days' notice to existing subscribers.",
        "You may cancel your subscription at any time, with access continuing until the end of the billing period."
      ]
    },
    {
      icon: Ban,
      title: "Prohibited Activities",
      content: [
        "Using the service for any illegal or unauthorized purpose.",
        "Violating any laws in your jurisdiction (including copyright laws).",
        "Transmitting spam, chain letters, or unsolicited communications.",
        "Interfering with or disrupting the service or servers.",
        "Collecting or harvesting any information from other users.",
        "Creating accounts through automated means or under false pretenses.",
        "Engaging in any activity that could damage our reputation or business."
      ]
    },
    {
      icon: Shield,
      title: "Limitation of Liability",
      content: [
        "QB Elite is provided 'as is' without warranties of any kind, express or implied.",
        "We do not guarantee that the service will be uninterrupted, secure, or error-free.",
        "We are not liable for any indirect, incidental, or consequential damages.",
        "Our total liability shall not exceed the amount you paid us in the 12 months before the claim.",
        "Some jurisdictions do not allow limitation of liability, so these may not apply to you.",
        "You use the service at your own risk and are responsible for your fitness and health decisions."
      ]
    }
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
            <FileText className="w-4 h-4 mr-1" />
            Legal Agreement
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Terms of Service
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
            Please read these terms carefully before using QB Elite. These terms govern your use of our services.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Last Updated: October 26, 2025
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Introduction */}
          <Card className="mb-12 border-2">
            <CardContent className="p-8">
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                These Terms of Service ("Terms") govern your access to and use of QB Elite's mobile application, 
                website, and services (collectively, the "Service"). By using our Service, you agree to be bound by 
                these Terms and our Privacy Policy.
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                Please read these Terms carefully. If you do not agree to these Terms, you may not access or use the Service.
              </p>
            </CardContent>
          </Card>

          {/* Terms Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <section.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {section.title}
                      </h2>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {section.content.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 mt-2" />
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {item}
                        </p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Health Disclaimer */}
          <Card className="mt-8 border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Health & Fitness Disclaimer
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                QB Elite provides general fitness and nutritional information for educational purposes only. 
                Our service is not a substitute for professional medical advice, diagnosis, or treatment.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Always consult with a qualified healthcare provider before beginning any exercise program or 
                making changes to your diet. If you experience pain, dizziness, or discomfort during exercise, 
                stop immediately and seek medical attention.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                You assume all risks associated with your use of the fitness programs, nutrition plans, and 
                coaching services provided through QB Elite.
              </p>
            </CardContent>
          </Card>

          {/* Termination */}
          <Card className="mt-8">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Termination
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                We reserve the right to suspend or terminate your account and access to the Service at any time, 
                with or without notice, for any violation of these Terms or for any other reason.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Upon termination, your right to use the Service will immediately cease. All provisions of these 
                Terms which by their nature should survive termination shall survive, including ownership provisions, 
                warranty disclaimers, and limitations of liability.
              </p>
            </CardContent>
          </Card>

          {/* Governing Law */}
          <Card className="mt-8">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Governing Law and Disputes
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                These Terms shall be governed by and construed in accordance with the laws of the State of California, 
                United States, without regard to its conflict of law provisions.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Any disputes arising from these Terms or your use of the Service shall be resolved through binding 
                arbitration in accordance with the rules of the American Arbitration Association.
              </p>
            </CardContent>
          </Card>

          {/* Contact Section */}
          <Card className="mt-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-2">
            <CardContent className="p-8 text-center">
              <Scale className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Questions About These Terms?
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="space-y-2 text-gray-700 dark:text-gray-300">
                <p className="font-semibold">Email: legal@qebelite.com</p>
                <p className="font-semibold">Phone: +1 (555) 123-4567</p>
                <p>Address: 123 Elite Fitness Way, San Francisco, CA 94102</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-8 bg-white/50 dark:bg-gray-800/50 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © 2025 QB Elite. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

