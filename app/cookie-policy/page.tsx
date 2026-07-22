import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { BarChart3, Cookie, Eye, Settings, Shield, Users, type LucideIcon } from 'lucide-react'

const cookieTable = [
  ['session_id', 'Maintains user session', 'Essential', 'Session'],
  ['auth_token', 'User authentication', 'Essential', '30 days'],
  ['_ga', 'Google Analytics', 'Analytics', '2 years'],
  ['_gid', 'Google Analytics', 'Analytics', '24 hours'],
  ['theme_preference', 'User theme setting', 'Functional', '1 year'],
  ['language_preference', 'User language setting', 'Functional', '1 year'],
]

const sections: Array<{ icon: LucideIcon; title: string; body: React.ReactNode }> = [
  {
    icon: Cookie,
    title: 'What are cookies?',
    body: (
      <>
        <p>
          Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are
          widely used to make websites work more efficiently and to provide information to website owners.
        </p>
        <p className="mt-3">
          This Cookie Policy explains how Rebolabs uses cookies and similar technologies when you visit our website and use
          our monetization platform. It explains what these technologies are and why we use them, as well as your rights to
          control our use of them.
        </p>
      </>
    ),
  },
  {
    icon: Settings,
    title: 'Types of cookies we use',
    body: (
      <>
        <p className="font-semibold text-foreground">Essential cookies</p>
        <p className="mt-2">
          These cookies are necessary for the website to function and cannot be switched off in our systems. They are usually
          only set in response to actions made by you which amount to a request for services.
        </p>
        <ul className="mt-3 list-disc space-y-1.5 pl-5">
          <li>Authentication and security cookies</li>
          <li>Load balancing cookies</li>
          <li>User interface customization cookies</li>
        </ul>

        <p className="mt-5 font-semibold text-foreground">Performance and analytics cookies</p>
        <p className="mt-2">
          These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our
          site. They help us know which pages are the most and least popular.
        </p>
        <ul className="mt-3 list-disc space-y-1.5 pl-5">
          <li>Google Analytics cookies</li>
          <li>Page load time tracking</li>
          <li>User journey analysis</li>
          <li>Error tracking and reporting</li>
        </ul>

        <p className="mt-5 font-semibold text-foreground">Functional cookies</p>
        <p className="mt-2">
          These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by
          third-party providers whose services we have added to our pages.
        </p>
        <ul className="mt-3 list-disc space-y-1.5 pl-5">
          <li>Language preference cookies</li>
          <li>Theme and appearance settings</li>
          <li>User preference storage</li>
        </ul>

        <p className="mt-5 font-semibold text-foreground">Targeting and advertising cookies</p>
        <p className="mt-2">
          These cookies may be set through our site by our advertising partners to build a profile of your interests and
          show you relevant adverts on other sites.
        </p>
        <ul className="mt-3 list-disc space-y-1.5 pl-5">
          <li>Social media advertising cookies</li>
          <li>Retargeting cookies</li>
          <li>Cross-site tracking cookies</li>
        </ul>
      </>
    ),
  },
  {
    icon: BarChart3,
    title: 'Specific cookies we use',
    body: (
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[480px] text-left">
          <thead>
            <tr className="bg-secondary">
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Cookie</th>
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Purpose</th>
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Type</th>
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Duration</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {cookieTable.map(([name, purpose, type, duration]) => (
              <tr key={name}>
                <td className="mono px-4 py-2.5 text-xs text-foreground">{name}</td>
                <td className="px-4 py-2.5 text-sm text-muted-foreground">{purpose}</td>
                <td className="px-4 py-2.5 text-sm text-muted-foreground">{type}</td>
                <td className="px-4 py-2.5 text-sm text-muted-foreground">{duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ),
  },
  {
    icon: Users,
    title: 'Third-party cookies',
    body: (
      <>
        <p>We may also use third-party cookies from trusted partners to enhance your experience and provide additional functionality. These include:</p>
        <ul className="mt-3 space-y-1.5">
          <li><strong className="font-semibold text-foreground">Google Analytics:</strong> For website analytics and performance monitoring</li>
          <li><strong className="font-semibold text-foreground">Stripe:</strong> For payment processing and fraud prevention</li>
          <li><strong className="font-semibold text-foreground">Intercom:</strong> For customer support and chat functionality</li>
          <li><strong className="font-semibold text-foreground">Hotjar:</strong> For user experience analysis and heatmaps</li>
        </ul>
        <p className="mt-4">
          These third parties may use cookies to collect information about your online activities across different
          websites. We do not control these third-party cookies, and you should review their respective privacy policies for
          more information.
        </p>
      </>
    ),
  },
  {
    icon: Settings,
    title: 'Managing cookies',
    body: (
      <>
        <p className="font-semibold text-foreground">Browser settings</p>
        <p className="mt-2">Most web browsers allow you to control cookies through their settings preferences. You can:</p>
        <ul className="mt-3 list-disc space-y-1.5 pl-5">
          <li>View what cookies are stored on your device</li>
          <li>Delete cookies individually or all at once</li>
          <li>Block cookies from specific websites or block third-party cookies</li>
          <li>Set your browser to notify you when cookies are set</li>
        </ul>
        <p className="mt-5 font-semibold text-foreground">Cookie consent</p>
        <p className="mt-2">When you first visit our website, you will see a cookie consent banner. You can:</p>
        <ul className="mt-3 list-disc space-y-1.5 pl-5">
          <li>Accept all cookies</li>
          <li>Reject non-essential cookies</li>
          <li>Customize your cookie preferences at any time</li>
        </ul>
      </>
    ),
  },
  {
    icon: Eye,
    title: 'Impact of disabling cookies',
    body: (
      <>
        <p>If you choose to disable cookies, some features of our website may not function properly:</p>
        <ul className="mt-3 list-disc space-y-1.5 pl-5">
          <li>You may need to log in repeatedly</li>
          <li>Your preferences may not be saved</li>
          <li>Some interactive features may not work</li>
          <li>Analytics and performance monitoring may be affected</li>
        </ul>
        <p className="mt-4">Essential cookies cannot be disabled as they are necessary for the basic functionality of our website.</p>
      </>
    ),
  },
  {
    icon: Shield,
    title: 'Data protection and privacy',
    body: (
      <>
        <p>
          We are committed to protecting your privacy and personal data. Our use of cookies is governed by our{' '}
          <a href="/privacy-policy" className="font-medium text-foreground underline underline-offset-2">Privacy Policy</a>,
          which explains how we collect, use, and protect your information.
        </p>
        <p className="mt-3">
          We only use cookies for legitimate business purposes and do not sell or share cookie data with third parties for
          their own marketing purposes.
        </p>
      </>
    ),
  },
  {
    icon: Cookie,
    title: 'Updates to this cookie policy',
    body: (
      <>
        <p>
          We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational,
          legal, or regulatory reasons. We will notify you of any material changes by posting the updated policy on our
          website.
        </p>
        <p className="mt-3">We encourage you to review this Cookie Policy periodically to stay informed about our use of cookies.</p>
      </>
    ),
  },
  {
    icon: Users,
    title: 'Contact us',
    body: (
      <>
        <p>If you have any questions about our use of cookies or this Cookie Policy, please contact us:</p>
        <ul className="mt-3 space-y-1.5">
          <li><strong className="font-semibold text-foreground">Email:</strong> privacy@rebolabs.com</li>
          <li><strong className="font-semibold text-foreground">Address:</strong> Available on request for verified privacy notices</li>
        </ul>
      </>
    ),
  },
]

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pb-24 pt-32">
        <div className="rebo-container-narrow">
          <div className="section-label">Legal</div>
          <h1 className="display mt-4 text-5xl text-foreground sm:text-6xl">Cookie policy.</h1>
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
