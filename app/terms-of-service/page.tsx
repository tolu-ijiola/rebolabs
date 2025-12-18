import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { FileText, Scale, AlertTriangle, Users, Shield, DollarSign } from 'lucide-react'

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <h1 className="text-3xl font-bold text-foreground">Terms of Service</h1>
          </div>
          <p className="text-muted-foreground">
            Last updated: 11th September, 2025.
          </p>
        </div>

        {/* Introduction */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              Agreement to Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-slate dark:prose-invert max-w-none">
            <p>
              These Terms of Service ("Terms") govern your use of ReboLabs' monetization platform and services 
              (collectively, the "Service") operated by ReboLabs ("us", "we", or "our").
            </p>
            <p>
              By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any 
              part of these terms, then you may not access the Service.
            </p>
          </CardContent>
        </Card>

        {/* Service Description */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="w-6 h-6 mr-2" />
              Description of Service
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-slate dark:prose-invert max-w-none">
            <p>
              ReboLabs provides a monetization platform that enables app developers and publishers to integrate 
              survey offers and other revenue-generating opportunities into their applications. Our services include:
            </p>
            <ul>
              <li>Survey offer integration and management</li>
              <li>Revenue tracking and analytics</li>
              <li>Payment processing and payouts</li>
              <li>User engagement tools and features</li>
              <li>API access and developer tools</li>
            </ul>
          </CardContent>
        </Card>

        {/* User Accounts */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-6 h-6 mr-2" />
              User Accounts
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-slate dark:prose-invert max-w-none">
            <h3>Account Creation</h3>
            <p>
              To use our Service, you must create an account. You are responsible for:
            </p>
            <ul>
              <li>Providing accurate and complete information</li>
              <li>Maintaining the security of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use</li>
            </ul>

            <h3>Account Requirements</h3>
            <p>You must be at least 18 years old to create an account and use our Service. By creating an account, you represent and warrant that:</p>
            <ul>
              <li>You are of legal age to form a binding contract</li>
              <li>You have the authority to enter into these Terms</li>
              <li>All information you provide is accurate and current</li>
            </ul>
          </CardContent>
        </Card>

        {/* Acceptable Use */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-6 h-6 mr-2" />
              Acceptable Use Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-slate dark:prose-invert max-w-none">
            <p>You agree to use our Service only for lawful purposes and in accordance with these Terms. You agree not to:</p>
            <ul>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on the rights of others</li>
              <li>Transmit or distribute malicious code or harmful content</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Use the Service for fraudulent or deceptive practices</li>
              <li>Interfere with the proper functioning of the Service</li>
              <li>Collect or harvest user information without consent</li>
              <li>Engage in any activity that could harm our reputation</li>
            </ul>
          </CardContent>
        </Card>

        {/* Payment Terms */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="w-6 h-6 mr-2" />
              Payment Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-slate dark:prose-invert max-w-none">
            <h3>Revenue Sharing</h3>
            <p>
              Revenue generated through our platform is shared according to the terms specified in your 
              publisher agreement. Payment schedules and minimum payout thresholds are outlined in your account settings.
            </p>

            <h3>Payment Processing</h3>
            <p>
              We use third-party payment processors to handle transactions. By using our Service, you agree 
              to the terms and conditions of our payment processors.
            </p>

            <h3>Taxes</h3>
            <p>
              You are responsible for reporting and paying any applicable taxes on revenue earned through our platform. 
              We may provide tax documentation as required by law.
            </p>
          </CardContent>
        </Card>

        {/* Intellectual Property */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Intellectual Property Rights</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-slate dark:prose-invert max-w-none">
            <h3>Our Content</h3>
            <p>
              The Service and its original content, features, and functionality are owned by ReboLabs and are 
              protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>

            <h3>Your Content</h3>
            <p>
              You retain ownership of any content you submit to our Service. By submitting content, you grant us 
              a license to use, modify, and distribute such content as necessary to provide our Service.
            </p>
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Privacy and Data Protection</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-slate dark:prose-invert max-w-none">
            <p>
              Your privacy is important to us. Our collection and use of personal information is governed by our 
              <a href="/privacy-policy" className="text-primary hover:underline"> Privacy Policy</a>, 
              which is incorporated into these Terms by reference.
            </p>
          </CardContent>
        </Card>

        {/* Disclaimers */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="w-6 h-6 mr-2" />
              Disclaimers and Limitations
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-slate dark:prose-invert max-w-none">
            <h3>Service Availability</h3>
            <p>
              We strive to maintain high service availability, but we do not guarantee that the Service will be 
              uninterrupted or error-free. We may temporarily suspend the Service for maintenance or updates.
            </p>

            <h3>Limitation of Liability</h3>
            <p>
              To the maximum extent permitted by law, ReboLabs shall not be liable for any indirect, incidental, 
              special, consequential, or punitive damages, including without limitation, loss of profits, data, 
              use, goodwill, or other intangible losses.
            </p>

            <h3>No Warranties</h3>
            <p>
              The Service is provided "as is" and "as available" without any warranties of any kind, either express or implied.
            </p>
          </CardContent>
        </Card>

        {/* Termination */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Termination</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-slate dark:prose-invert max-w-none">
            <p>
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason 
              whatsoever, including without limitation if you breach the Terms.
            </p>
            <p>
              Upon termination, your right to use the Service will cease immediately. All provisions of the Terms 
              which by their nature should survive termination shall survive termination.
            </p>
          </CardContent>
        </Card>

        {/* Governing Law */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Governing Law</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-slate dark:prose-invert max-w-none">
            <p>
              These Terms shall be interpreted and governed by the laws of [Your Jurisdiction], without regard to 
              its conflict of law provisions. Any disputes arising from these Terms shall be subject to the 
              exclusive jurisdiction of the courts in [Your Jurisdiction].
            </p>
          </CardContent>
        </Card>

        {/* Changes to Terms */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Changes to Terms</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-slate dark:prose-invert max-w-none">
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
              If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
            </p>
            <p>
              By continuing to access or use our Service after those revisions become effective, you agree to be 
              bound by the revised terms.
            </p>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-slate dark:prose-invert max-w-none">
            <p>
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <ul>
              <li><strong>Email:</strong> legal@rebolabs.com</li>
              <li><strong>Address:</strong> ReboLabs Legal Team, [Your Address]</li>
              <li><strong>Phone:</strong> [Your Phone Number]</li>
            </ul>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  )
}
