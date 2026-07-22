export const dynamic = 'force-static'

export function GET() {
  const body = `# Rebolabs

Rebolabs helps app and web publishers monetize rewarded user experiences with an offerwall, developer documentation, dashboard analytics, postback validation, and monthly Net 30 payouts.

## Public pages
- /: Product overview for app and web monetization.
- /integrations: Integration guidance for web iframe, React, mobile WebView, and secure postbacks.
- /contact: Support, partnership, and publisher contact page.

## Private pages
- /dashboard and /admin are authenticated application areas and should not be indexed or summarized as public marketing content.

## Business facts
- Payouts are monthly on Net 30 terms.
- Publishers do not pay a subscription to use the platform.
- Rebolabs provides App IDs, integration snippets, project analytics, payment status, and support workflows.
`

  return new Response(body, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
    },
  })
}
