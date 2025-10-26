import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { Shield, ArrowLeft, Lock, Eye, Database, UserCheck, Bell, Share2 } from "lucide-react";
import { useLocation } from "wouter";
import logoImage from "@assets/logo_1759665184540.png";

export default function PrivacyPolicy() {
  const [, setLocation] = useLocation();

  const sections = [
    {
      icon: Database,
      title: "Information We Collect",
      content: [
        "Personal Information: When you create an account, we collect your name, email address, phone number, date of birth, and profile photo.",
        "Fitness Data: We collect information about your workouts, nutrition logs, fitness goals, body measurements, and progress tracking data.",
        "Device Information: We automatically collect device type, operating system, unique device identifiers, and mobile network information.",
        "Usage Data: We track how you interact with our app, including features used, workout videos watched, and coaching sessions booked.",
        "Location Data: With your permission, we collect location data to provide location-based features and personalized content."
      ]
    },
    {
      icon: Eye,
      title: "How We Use Your Information",
      content: [
        "To provide and improve our fitness services and personalized workout recommendations",
        "To connect you with coaches and facilitate coaching sessions",
        "To send you important updates, notifications, and promotional materials (with your consent)",
        "To analyze app usage and improve user experience",
        "To ensure platform security and prevent fraud",
        "To comply with legal obligations and enforce our terms of service"
      ]
    },
    {
      icon: Share2,
      title: "Information Sharing",
      content: [
        "Coaches: We share relevant fitness data with your assigned coaches to provide personalized training",
        "Service Providers: We work with trusted third-party service providers who help us operate our platform",
        "Analytics Partners: We use analytics services to understand app usage and improve our services",
        "Legal Requirements: We may disclose information when required by law or to protect our rights",
        "Business Transfers: In the event of a merger or acquisition, your information may be transferred"
      ]
    },
    {
      icon: Lock,
      title: "Data Security",
      content: [
        "We use industry-standard encryption to protect your data during transmission and storage",
        "Our servers are hosted in secure facilities with multiple layers of physical and digital security",
        "We implement strict access controls and regularly audit our security practices",
        "All payment information is processed through PCI-DSS compliant payment processors",
        "We conduct regular security assessments and vulnerability testing"
      ]
    },
    {
      icon: UserCheck,
      title: "Your Rights",
      content: [
        "Access: You can request a copy of your personal data at any time",
        "Correction: You can update or correct your information through your account settings",
        "Deletion: You can request deletion of your account and associated data",
        "Opt-Out: You can opt out of marketing communications at any time",
        "Data Portability: You can request your data in a machine-readable format",
        "Withdraw Consent: You can withdraw consent for data processing where applicable"
      ]
    },
    {
      icon: Bell,
      title: "Cookies and Tracking",
      content: [
        "We use cookies and similar technologies to enhance your experience and analyze usage",
        "Essential cookies are necessary for the app to function properly",
        "Analytics cookies help us understand how users interact with our platform",
        "Marketing cookies may be used to show you relevant advertisements",
        "You can manage cookie preferences through your browser settings"
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
              <img src={logoImage} alt="QEB Elite Logo" className="h-8 w-auto" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                QEB Elite
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
            <Shield className="w-4 h-4 mr-1" />
            Legal Information
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
            Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
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
                Welcome to QEB Elite. We are committed to protecting your privacy and ensuring the security of your personal information. 
                This Privacy Policy describes how we collect, use, disclose, and safeguard your information when you use our mobile 
                application and services.
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                By using QEB Elite, you agree to the collection and use of information in accordance with this policy. 
                If you do not agree with our policies and practices, please do not use our services.
              </p>
            </CardContent>
          </Card>

          {/* Policy Sections */}
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

          {/* Children's Privacy */}
          <Card className="mt-8 border-2 border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Children's Privacy
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                QEB Elite is not intended for children under the age of 13. We do not knowingly collect personal 
                information from children under 13. If you are a parent or guardian and believe your child has 
                provided us with personal information, please contact us immediately.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Users between 13 and 18 years old must have parental consent to use our services.
              </p>
            </CardContent>
          </Card>

          {/* Changes to Policy */}
          <Card className="mt-8">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Changes to This Privacy Policy
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting 
                the new Privacy Policy on this page and updating the "Last Updated" date at the top of this policy.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                We encourage you to review this Privacy Policy periodically for any changes. Changes to this 
                Privacy Policy are effective when they are posted on this page.
              </p>
            </CardContent>
          </Card>

          {/* Contact Section */}
          <Card className="mt-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-2">
            <CardContent className="p-8 text-center">
              <Shield className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Questions About Privacy?
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <div className="space-y-2 text-gray-700 dark:text-gray-300">
                <p className="font-semibold">Email: privacy@qebelite.com</p>
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
            © 2025 QEB Elite. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

