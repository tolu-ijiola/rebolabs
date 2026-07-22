import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Rebolabs â€” Offerwall Monetization for Apps and Websites'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#101712',
          padding: '72px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              border: '3px solid #f2f7f4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f2f7f4',
              fontSize: 30,
              fontWeight: 700,
            }}
          >
            R
          </div>
          <div style={{ color: '#f2f7f4', fontSize: 30, fontWeight: 600, letterSpacing: -1 }}>Rebolabs</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ color: '#f2f7f4', fontSize: 68, fontWeight: 700, lineHeight: 1.05, maxWidth: 900 }}>
            Offerwall monetization built for publishers.
          </div>
          <div style={{ color: '#9db0a5', fontSize: 30, maxWidth: 820, lineHeight: 1.4 }}>
            Real-time analytics, signed postbacks, and monthly Net 30 payouts.
          </div>
        </div>

        <div style={{ display: 'flex', gap: 14 }}>
          {['Net 30 payouts', '70% revenue share', 'Signed postbacks'].map((chip) => (
            <div
              key={chip}
              style={{
                border: '1px solid #33403a',
                borderRadius: 999,
                padding: '10px 22px',
                color: '#d7e2db',
                fontSize: 24,
              }}
            >
              {chip}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  )
}
