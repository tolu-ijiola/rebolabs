import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Database, Eye, Lock, Mail, Shield, Users, type LucideIcon } from 'lucide-react'

const sections: Array<{ icon: LucideIcon; title: string; body: React.ReactNode }> = [
  {
    icon: Eye,
    title: 'Introduction',
    body: (
      <>
        <p>
          At Rebolabs, we are committed to protecting your privacy and ensuring the security of your personal information. This
          Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our monetization
          platform and services.
        </p>
        <p className="mt-3">
          By using our services, you agree to the collection and use of information in accordance with this policy. If you do
          not agree with the terms of this Privacy Policy, please do not access or use our services.
        </p>
      </>
    ),
  },
  {
    icon: Database,
    title: 'Information we collect',
    body: (
      <>
        <p className="font-semibold text-foreground">Personal information</p>
        <p className="mt-2">We may collect the following types of personal information:</p>
        <List
          items={[
            ['Account information', 'Name, email address, password, and profile information'],
            ['Contact information', 'Phone number, mailing address, and other contact details'],
            ['Payment information', 'Billing address, payment method details, and transaction history'],
            ['Usage data', 'Information about how you use our platform, including pages visited and features used'],
            ['Device information', 'IP address, browser type, operating system, and device identifiers'],
          ]}
        />
        <p className="mt-5 font-semibold text-foreground">Automatically collected information</p>
        <p className="mt-2">We automatically collect certain information when you use our services:</p>
        <ul className="mt-3 list-disc space-y-1.5 pl-5">
          <li>Log data and analytics information</li>
          <li>Cookies and similar tracking technologies</li>
          <li>Usage patterns and preferences</li>
          <li>Error reports and performance data</li>
        </ul>
      </>
    ),
  },
  {
    icon: Users,
    title: 'How we use your information',
    body: (
      <>
        <p>We use the collected information for the following purposes:</p>
        <List
          items={[
            ['Service provision', 'To provide, maintain, and improve our monetization platform'],
            ['Account management', 'To create and manage your account, process transactions, and provide customer support'],
            ['Communication', 'To send you important updates, notifications, and marketing communications'],
            ['Analytics', 'To analyze usage patterns and improve our services'],
            ['Security', 'To protect against fraud, abuse, and security threats'],
            ['Legal compliance', 'To comply with applicable laws and regulations'],
          ]}
        />
      </>
    ),
  },
  {
    icon: Lock,
    title: 'Information sharing and disclosure',
    body: (
      <>
        <p>We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:</p>
        <List
          items={[
            ['Service providers', 'With trusted third-party service providers who assist us in operating our platform'],
            ['Business transfers', 'In connection with a merger, acquisition, or sale of assets'],
            ['Legal requirements', 'When required by law or to protect our rights and interests'],
            ['Consent', 'When you have given us explicit consent to share your information'],
          ]}
        />
      </>
    ),
  },
  {
    icon: Shield,
    title: 'Data security',
    body: (
      <>
        <p>We implement appropriate technical and organizational measures to protect your personal information:</p>
        <ul className="mt-3 list-disc space-y-1.5 pl-5">
          <li>Encryption of data in transit and at rest</li>
          <li>Regular security assessments and updates</li>
          <li>Access controls and authentication mechanisms</li>
          <li>Employee training on data protection practices</li>
          <li>Incident response procedures</li>
        </ul>
        <p className="mt-4">
          However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect
          your personal information, we cannot guarantee absolute security.
        </p>
      </>
    ),
  },
  {
    icon: Users,
    title: 'Your rights and choices',
    body: (
      <>
        <p>You have the following rights regarding your personal information:</p>
        <List
          items={[
            ['Access', 'Request access to your personal information'],
            ['Correction', 'Request correction of inaccurate or incomplete information'],
            ['Deletion', 'Request deletion of your personal information'],
            ['Portability', 'Request a copy of your data in a portable format'],
            ['Objection', 'Object to certain processing of your personal information'],
            ['Withdrawal of consent', 'Withdraw consent for data processing where applicable'],
          ]}
        />
      </>
    ),
  },
  {
    icon: Shield,
    title: 'Cookies and tracking technologies',
    body: (
      <p>
        We use cookies and similar tracking technologies to enhance your experience on our platform. You can control cookie
        settings through your browser preferences. For more information, see our{' '}
        <a href="/cookie-policy" className="font-medium text-foreground underline underline-offset-2">Cookie Policy</a>.
      </p>
    ),
  },
  {
    icon: Mail,
    title: 'Contact us',
    body: (
      <>
        <p>If you have any questions about this Privacy Policy or our data practices, please contact us:</p>
        <ul className="mt-3 space-y-1.5">
          <li><strong className="font-semibold text-foreground">Email:</strong> privacy@rebolabs.com</li>
          <li><strong className="font-semibold text-foreground">Address:</strong> Available on request for verified privacy notices</li>
        </ul>
      </>
    ),
  },
  {
    icon: Eye,
    title: 'Changes to this policy',
    body: (
      <p>
        We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy
        Policy on this page and updating the &ldquo;Last updated&rdquo; date. We encourage you to review this Privacy Policy
        periodically for any changes.
      </p>
    ),
  },
]

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pb-24 pt-32">
        <div className="rebo-container-narrow">
          <div className="section-label">Legal</div>
          <h1 className="display mt-4 text-5xl text-foreground sm:text-6xl">Privacy policy.</h1>
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

function List({ items }: { items: Array<[string, string]> }) {
  return (
    <ul className="mt-3 space-y-2">
      {items.map(([label, body]) => (
        <li key={label}>
          <strong className="font-semibold text-foreground">{label}:</strong> {body}
        </li>
      ))}
    </ul>
  )
}
