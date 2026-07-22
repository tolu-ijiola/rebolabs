import Link from 'next/link'
import { ArrowLeft, Compass } from 'lucide-react'
import { BrandLogo } from '@/components/brand-logo'

const helpfulLinks = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Projects', href: '/dashboard/projects' },
  { label: 'Documentation', href: '/dashboard/documentation' },
  { label: 'Contact support', href: '/contact' },
]

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <nav className="rebo-container flex h-16 items-center">
        <Link href="/" className="inline-flex items-center">
          <BrandLogo />
        </Link>
      </nav>

      <div className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-[480px] text-center">
          <span className="mono section-label">404 error</span>
          <h1 className="display mt-4 text-6xl text-foreground sm:text-7xl">Page not found.</h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/dashboard" className="btn-ink">
              Go to dashboard
            </Link>
            <Link href="/" className="btn-paper">
              <ArrowLeft className="h-4 w-4" />
              Back home
            </Link>
          </div>

          <div className="mt-12 border-t border-border pt-8">
            <p className="mb-4 flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-wide text-[var(--subtle)]">
              <Compass className="h-3.5 w-3.5" />
              You might be looking for
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm">
              {helpfulLinks.map((link) => (
                <Link key={link.href} href={link.href} className="font-medium text-foreground hover:text-muted-foreground">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
