import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { ImageResponse } from 'next/og'

/*
 * Root OG image (ADR-0007 §3): the brand ground + the live type, never the generic docs
 * template. Colours are parsed from the token file at build time (single source —
 * check:rules R1 stays clean: no raw hex here). Type is Manrope 700 from a
 * BUILD-TIME-ONLY TTF in src/assets/og/ (satori cannot consume woff2; the two served
 * woff2 files and the ADR-0009 §3 budget are untouched). The mark is the header's own
 * geometry. Copy is limited to the brand name and domain — no unapproved taglines
 * (facts boundary).
 */

export const alt = 'Sandbee'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

function tokens(): Record<string, string> {
  const css = readFileSync(
    join(process.cwd(), 'src', 'app', 'globals.css'),
    'utf8',
  )
  const out: Record<string, string> = {}
  for (const match of css.matchAll(/--color-([a-z-]+):\s*(#[0-9a-fA-F]{6})/g)) {
    out[match[1]] = match[2]
  }
  return out
}

export default async function OpenGraphImage() {
  const colour = tokens()
  const manrope = readFileSync(
    join(process.cwd(), 'src', 'assets', 'og', 'manrope-700.ttf'),
  )
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: colour['canvas'],
        color: colour['ink'],
        padding: 72,
        fontFamily: 'Manrope',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <svg width="72" height="72" viewBox="0 0 64 64" fill={colour['ink']}>
          <path d="M4 7L25 21L28 30L25 32L4 17ZM4 22L23 35L18 38L4 29ZM60 7L39 21L36 30L39 32L60 17ZM60 22L41 35L46 38L60 29ZM32 27L34 30H30Z" />
          <path
            fill={colour['honey']}
            d="M20 41L32 33L44 41V47L32 39L20 47ZM20 50L32 42L44 50V56L32 48L20 56ZM24 57L32 51L40 57L32 64Z"
          />
        </svg>
        <div style={{ fontSize: 30, color: colour['ink-muted'] }}>
          sandbee.in
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 168, lineHeight: 1, letterSpacing: -5 }}>
          Sandbee
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 44,
            height: 10,
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              width: 220,
              height: 10,
              borderRadius: 5,
              backgroundColor: colour['sky'],
            }}
          />
          <div
            style={{
              display: 'flex',
              marginLeft: 12,
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: colour['honey'],
            }}
          />
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [{ name: 'Manrope', data: manrope, weight: 700, style: 'normal' }],
    },
  )
}
