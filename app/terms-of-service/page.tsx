import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { AlertTriangle, DollarSign, FileText, Scale, Shield, Users, type LucideIcon } from 'lucide-react'

const sections: Array<{ icon: LucideIcon; title: string; body: React.ReactNode }> = [
  {
    icon: FileText,
    title: 'Agreement to terms',
    body: (
      <>
        <p>
          These Terms of Service (&ldquo;Terms&rdquo;) govern your use of Rebolabs&apos; monetization platform and services
          (collectively, the &ldquo;Service&rdquo;) operated by Rebolabs (&ldquo;us&rdquo;, &ldquo;we&rdquo;, or &ldquo;our&rdquo;).
        </p>
        <p className="mt-3">
          By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of these
          terms, then you may not access the Service.
        </p>
      </>
    ),
  },
  {
    icon: DollarSign,
    title: 'Description of service',
    body: (
      <>
        <p>
          Rebolabs provides a monetization platform that enables app developers and publishers to integrate rewarded offers
          and other revenue-generating opportunities into their applications. Our services include:
        </p>
        <ul className="mt-3 list-disc space-y-1.5 pl-5">
          <li>Rewarded offerwall integration and management</li>
          <li>Revenue tracking and analytics</li>
          <li>Payment processing and payouts</li>
          <li>User engagement tools and features</li>
          <li>API access and developer tools</li>
        </ul>
      </>
    ),
  },
  {
    icon: Users,
    title: 'User accounts',
    body: (
      <>
        <p className="font-semibold text-foreground">Account creation</p>
        <p className="mt-2">To use our Service, you must create an account. You are responsible for:</p>
        <ul className="mt-3 list-disc space-y-1.5 pl-5">
          <li>Providing accurate and complete information</li>
          <li>Maintaining the security of your account credentials</li>
          <li>All activities that occur under your account</li>
          <li>Notifying us immediately of any unauthorized use</li>
        </ul>
        <p className="mt-5 font-semibold text-foreground">Account requirements</p>
        <p className="mt-2">You must be at least 18 years old to create an account and use our Service. By creating an account, you represent and warrant that:</p>
        <ul className="mt-3 list-disc space-y-1.5 pl-5">
          <li>You are of legal age to form a binding contract</li>
          <li>You have the authority to enter into these Terms</li>
          <li>All information you provide is accurate and current</li>
        </ul>
      </>
    ),
  },
  {
    icon: Shield,
    title: 'Acceptable use policy',
    body: (
      <>
        <p>You agree to use our Service only for lawful purposes and in accordance with these Terms. You agree not to:</p>
        <ul className="mt-3 list-disc space-y-1.5 pl-5">
          <li>Violate any applicable laws or regulations</li>
          <li>Infringe on the rights of others</li>
          <li>Transmit or distribute malicious code or harmful content</li>
          <li>Attempt to gain unauthorized access to our systems</li>
          <li>Use the Service for fraudulent or deceptive practices</li>
          <li>Interfere with the proper functioning of the Service</li>
          <li>Collect or harvest user information without consent</li>
          <li>Engage in any activity that could harm our reputation</li>
        </ul>
      </>
    ),
  },
  {
    icon: DollarSign,
    title: 'Payment terms',
    body: (
      <>
        <p className="font-semibold text-foreground">Revenue sharing</p>
        <p className="mt-2">
          Revenue generated through our platform is shared according to the terms specified in your publisher agreement.
          Payment schedules and minimum payout thresholds are outlined in your account settings.
        </p>
        <p className="mt-5 font-semibold text-foreground">Payment processing</p>
        <p className="mt-2">
          We use third-party payment processors to handle transactions. By using our Service, you agree to the terms and
          conditions of our payment processors.
        </p>
        <p className="mt-5 font-semibold text-foreground">Taxes</p>
        <p className="mt-2">
          You are responsible for reporting and paying any applicable taxes on revenue earned through our platform. We may
          provide tax documentation as required by law.
        </p>
      </>
    ),
  },
  {
    icon: Scale,
    title: 'Intellectual property rights',
    body: (
      <>
        <p className="font-semibold text-foreground">Our content</p>
        <p className="mt-2">
          The Service and its original content, features, and functionality are owned by Rebolabs and are protected by
          international copyright, trademark, patent, trade secret, and other intellectual property laws.
        </p>
        <p className="mt-5 font-semibold text-foreground">Your content</p>
        <p className="mt-2">
          You retain ownership of any content you submit to our Service. By submitting content, you grant us a license to
          use, modify, and distribute such content as necessary to provide our Service.
        </p>
      </>
    ),
  },
  {
    icon: Shield,
    title: 'Privacy and data protection',
    body: (
      <p>
        Your privacy is important to us. Our collection and use of personal information is governed by our{' '}
        <a href="/privacy-policy" className="font-medium text-foreground underline underline-offset-2">Privacy Policy</a>,
        which is incorporated into these Terms by reference.
      </p>
    ),
  },
  {
    icon: AlertTriangle,
    title: 'Disclaimers and limitations',
    body: (
      <>
        <p className="font-semibold text-foreground">Service availability</p>
        <p className="mt-2">
          We strive to maintain high service availability, but we do not guarantee that the Service will be uninterrupted or
          error-free. We may temporarily suspend the Service for maintenance or updates.
        </p>
        <p className="mt-5 font-semibold text-foreground">Limitation of liability</p>
        <p className="mt-2">
          To the maximum extent permitted by law, Rebolabs shall not be liable for any indirect, incidental, special,
          consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other
          intangible losses.
        </p>
        <p className="mt-5 font-semibold text-foreground">No warranties</p>
        <p className="mt-2">
          The Service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without any warranties of any kind,
          either express or implied.
        </p>
      </>
    ),
  },
  {
    icon: FileText,
    title: 'Termination',
    body: (
      <>
        <p>
          We may terminate or suspend your account immediately, without prior notice or liability, for any reason
          whatsoever, including without limitation if you breach the Terms.
        </p>
        <p className="mt-3">
          Upon termination, your right to use the Service will cease immediately. All provisions of the Terms which by their
          nature should survive termination shall survive termination.
        </p>
      </>
    ),
  },
  {
    icon: Scale,
    title: 'Governing law',
    body: (
      <p>
        These Terms shall be interpreted and governed by the laws of the jurisdiction in which Rebolabs is registered,
        without regard to its conflict of law provisions. Any disputes arising from these Terms shall be subject to the
        exclusive jurisdiction of the courts in that jurisdiction.
      </p>
    ),
  },
  {
    icon: FileText,
    title: 'Changes to terms',
    body: (
      <>
        <p>
          We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is
          material, we will try to provide at least 30 days notice prior to any new terms taking effect.
        </p>
        <p className="mt-3">
          By continuing to access or use our Service after those revisions become effective, you agree to be bound by the
          revised terms.
        </p>
      </>
    ),
  },
  {
    icon: Users,
    title: 'Contact information',
    body: (
      <>
        <p>If you have any questions about these Terms of Service, please contact us:</p>
        <ul className="mt-3 space-y-1.5">
          <li><strong className="font-semibold text-foreground">Email:</strong> legal@rebolabs.com</li>
          <li><strong className="font-semibold text-foreground">Address:</strong> Available on request for verified legal notices</li>
        </ul>
      </>
    ),
  },
]

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pb-24 pt-32">
        <div className="rebo-container-narrow">
          <div className="section-label">Legal</div>
          <h1 className="display mt-4 text-5xl text-foreground sm:text-6xl">Terms of service.</h1>
          <p className="mt-4 text-sm text-muted-foreground">Last updated: September 11, 2025</p>

          <div className="rebo-card mt-10 divide-y divide-border">
            {sections.map((section) => (
              <section key={section.title} className="p-6 sm:p-8">
                <h2 className="flex items-center gap-3 text-base font-semibold text-foreground">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary">
                    <section.icon className="h-4 w-4 text-muted-foreground" />
                  </span>
                  {section.title}
                </h2>
                <div className="mt-4 text-sm leading-relaxed text-muted-foreground">{section.body}</div>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
