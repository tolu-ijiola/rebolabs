import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Cookie, Settings, Shield, Eye, BarChart3, Users } from 'lucide-react'

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <h1 className="text-3xl font-bold text-foreground">Cookie Policy</h1>
          </div>
          <p className="text-muted-foreground">
            Last updated: 11th September, 2025.
          </p>
        </div>

        {/* Introduction */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Cookie className="w-6 h-6 mr-2" />
              What Are Cookies?
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-slate dark:prose-invert max-w-none">
            <p>
              Cookies are small text files that are placed on your computer or mobile device when you visit a website. 
              They are widely used to make websites work more efficiently and to provide information to website owners.
            </p>
            <p>
              This Cookie Policy explains how ReboLabs uses cookies and similar technologies when you visit our website 
              and use our monetization platform. It explains what these technologies are and why we use them, as well as 
              your rights to control our use of them.
            </p>
          </CardContent>
        </Card>

        {/* Types of Cookies */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-6 h-6 mr-2" />
              Types of Cookies We Use
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-slate dark:prose-invert max-w-none">
            <h3>Essential Cookies</h3>
            <p>
              These cookies are necessary for the website to function and cannot be switched off in our systems. 
              They are usually only set in response to actions made by you which amount to a request for services.
            </p>
            <ul>
              <li>Authentication and security cookies</li>
              <li>Load balancing cookies</li>
              <li>User interface customization cookies</li>
              <li>Shopping cart and checkout cookies</li>
            </ul>

            <h3>Performance and Analytics Cookies</h3>
            <p>
              These cookies allow us to count visits and traffic sources so we can measure and improve the performance 
              of our site. They help us to know which pages are the most and least popular.
            </p>
            <ul>
              <li>Google Analytics cookies</li>
              <li>Page load time tracking</li>
              <li>User journey analysis</li>
              <li>Error tracking and reporting</li>
            </ul>

            <h3>Functional Cookies</h3>
            <p>
              These cookies enable the website to provide enhanced functionality and personalization. 
              They may be set by us or by third party providers whose services we have added to our pages.
            </p>
            <ul>
              <li>Language preference cookies</li>
              <li>Theme and appearance settings</li>
              <li>User preference storage</li>
              <li>Chat widget functionality</li>
            </ul>

            <h3>Targeting and Advertising Cookies</h3>
            <p>
              These cookies may be set through our site by our advertising partners to build a profile of your interests 
              and show you relevant adverts on other sites.
            </p>
            <ul>
              <li>Social media advertising cookies</li>
              <li>Retargeting cookies</li>
              <li>Cross-site tracking cookies</li>
              <li>Interest-based advertising cookies</li>
            </ul>
          </CardContent>
        </Card>

        {/* Specific Cookies */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-6 h-6 mr-2" />
              Specific Cookies We Use
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border p-3 text-left">Cookie Name</th>
                    <th className="border border-border p-3 text-left">Purpose</th>
                    <th className="border border-border p-3 text-left">Type</th>
                    <th className="border border-border p-3 text-left">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-border p-3 font-mono">session_id</td>
                    <td className="border border-border p-3">Maintains user session</td>
                    <td className="border border-border p-3">Essential</td>
                    <td className="border border-border p-3">Session</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3 font-mono">auth_token</td>
                    <td className="border border-border p-3">User authentication</td>
                    <td className="border border-border p-3">Essential</td>
                    <td className="border border-border p-3">30 days</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3 font-mono">_ga</td>
                    <td className="border border-border p-3">Google Analytics</td>
                    <td className="border border-border p-3">Analytics</td>
                    <td className="border border-border p-3">2 years</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3 font-mono">_gid</td>
                    <td className="border border-border p-3">Google Analytics</td>
                    <td className="border border-border p-3">Analytics</td>
                    <td className="border border-border p-3">24 hours</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3 font-mono">theme_preference</td>
                    <td className="border border-border p-3">User theme setting</td>
                    <td className="border border-border p-3">Functional</td>
                    <td className="border border-border p-3">1 year</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-3 font-mono">language_preference</td>
                    <td className="border border-border p-3">User language setting</td>
                    <td className="border border-border p-3">Functional</td>
                    <td className="border border-border p-3">1 year</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Third Party Cookies */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-6 h-6 mr-2" />
              Third-Party Cookies
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-slate dark:prose-invert max-w-none">
            <p>
              We may also use third-party cookies from trusted partners to enhance your experience and provide 
              additional functionality. These include:
            </p>
            <ul>
              <li><strong>Google Analytics:</strong> For website analytics and performance monitoring</li>
              <li><strong>Stripe:</strong> For payment processing and fraud prevention</li>
              <li><strong>Intercom:</strong> For customer support and chat functionality</li>
              <li><strong>Hotjar:</strong> For user experience analysis and heatmaps</li>
              <li><strong>Facebook Pixel:</strong> For advertising and retargeting</li>
            </ul>
            <p>
              These third parties may use cookies to collect information about your online activities across 
              different websites. We do not control these third-party cookies, and you should review their 
              respective privacy policies for more information.
            </p>
          </CardContent>
        </Card>

        {/* Cookie Management */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-6 h-6 mr-2" />
              Managing Cookies
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-slate dark:prose-invert max-w-none">
            <h3>Browser Settings</h3>
            <p>
              Most web browsers allow you to control cookies through their settings preferences. You can:
            </p>
            <ul>
              <li>View what cookies are stored on your device</li>
              <li>Delete cookies individually or all at once</li>
              <li>Block cookies from specific websites</li>
              <li>Block third-party cookies</li>
              <li>Set your browser to notify you when cookies are set</li>
            </ul>

            <h3>Browser-Specific Instructions</h3>
            <ul>
              <li><strong>Chrome:</strong> Settings  Privacy and security  Cookies and other site data</li>
              <li><strong>Firefox:</strong> Options    Privacy & Security Cookies and Site Data</li>
              <li><strong>Safari:</strong> Preferences  Privacy  Manage Website Data</li>
              <li><strong>Edge:</strong> Settings    Cookies and site permissions</li>
            </ul>

            <h3>Cookie Consent</h3>
            <p>
              When you first visit our website, you will see a cookie consent banner. You can:
            </p>
            <ul>
              <li>Accept all cookies</li>
              <li>Reject non-essential cookies</li>
              <li>Customize your cookie preferences</li>
              <li>Change your preferences at any time</li>
            </ul>
          </CardContent>
        </Card>

        {/* Impact of Disabling Cookies */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Eye className="w-6 h-6 mr-2" />
              Impact of Disabling Cookies
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-slate dark:prose-invert max-w-none">
            <p>
              If you choose to disable cookies, some features of our website may not function properly:
            </p>
            <ul>
              <li>You may need to log in repeatedly</li>
              <li>Your preferences may not be saved</li>
              <li>Some interactive features may not work</li>
              <li>We may not be able to provide personalized content</li>
              <li>Analytics and performance monitoring may be affected</li>
            </ul>
            <p>
              Essential cookies cannot be disabled as they are necessary for the basic functionality of our website.
            </p>
          </CardContent>
        </Card>

        {/* Data Protection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-6 h-6 mr-2" />
              Data Protection and Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-slate dark:prose-invert max-w-none">
            <p>
              We are committed to protecting your privacy and personal data. Our use of cookies is governed by our 
              <a href="/privacy-policy" className="text-primary hover:underline"> Privacy Policy</a>, 
              which explains how we collect, use, and protect your information.
            </p>
            <p>
              We only use cookies for legitimate business purposes and do not sell or share cookie data with 
              third parties for their own marketing purposes.
            </p>
          </CardContent>
        </Card>

        {/* Updates to Policy */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Updates to This Cookie Policy</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-slate dark:prose-invert max-w-none">
            <p>
              We may update this Cookie Policy from time to time to reflect changes in our practices or for 
              other operational, legal, or regulatory reasons. We will notify you of any material changes by 
              posting the updated policy on our website.
            </p>
            <p>
              We encourage you to review this Cookie Policy periodically to stay informed about our use of cookies.
            </p>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-slate dark:prose-invert max-w-none">
            <p>
              If you have any questions about our use of cookies or this Cookie Policy, please contact us:
            </p>
            <ul>
              <li><strong>Email:</strong> privacy@rebolabs.com</li>
              <li><strong>Address:</strong> ReboLabs Privacy Team, [Your Address]</li>
              <li><strong>Phone:</strong> [Your Phone Number]</li>
            </ul>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  )
}
