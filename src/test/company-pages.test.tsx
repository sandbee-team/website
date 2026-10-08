import { fireEvent, render, screen } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
import { EnquiryComposer } from '@/components/contact/enquiry-composer'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import CompanyPage from '@/app/(marketing)/company/page'
import ContactPage from '@/app/(marketing)/contact/page'
import CustomTechnologyPage from '@/app/(marketing)/custom-technology/page'
import StoriesPage from '@/app/(marketing)/stories/page'
import StoryPage from '@/app/(marketing)/stories/[story]/page'

const navigation = vi.hoisted(() => ({ query: '' }))
vi.mock('next/navigation', async (importOriginal) => ({
  ...(await importOriginal<typeof import('next/navigation')>()),
  useSearchParams: () => new URLSearchParams(navigation.query),
}))
beforeEach(() => {
  navigation.query = ''
})

describe('company overview', () => {
  it('presents one brand and all four current offerings', () => {
    render(<CompanyPage />)
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(
      'One company. Many useful technologies.',
    )
    for (const [name, href] of [
      ['GSTIN', '/services/gst-api'],
      ['Document OCR', '/technology/aadhaar-pan-ocr'],
      ['Sandbee Messaging', '/services/whatsapp-sms-automation'],
      ['Sandbee POS', '/products/pos'],
    ])
      expect(screen.getByRole('link', { name }).getAttribute('href')).toBe(href)
  })
  it('explains operational ownership and avoids a free-hosting guarantee', () => {
    render(<CompanyPage />)
    expect(
      screen.getByText(/Sandbee POS is set up in your own Vercel account/),
    ).toBeDefined()
    expect(
      screen.getByText(/A one-time setup fee does not mean hosting is free/),
    ).toBeDefined()
    expect(
      screen.getByText(
        /Messaging onboarding and prepaid balance are currently arranged with Sandbee/,
      ),
    ).toBeDefined()
    expect(
      screen
        .getByRole('link', { name: 'Open Sandbee Store' })
        .getAttribute('href'),
    ).toBe('https://store.sandbee.in')
  })
  it('retains the qualified reuse story and visible breadcrumb schema', () => {
    const { container } = render(<CompanyPage />)
    expect(
      screen.getByText(/can lead to technology intended for reuse/),
    ).toBeDefined()
    expect(
      screen.getByText(/Not every client project should become a product/),
    ).toBeDefined()
    expect(
      screen
        .getByRole('link', { name: 'Read the desktop tracking origin story' })
        .getAttribute('href'),
    ).toBe('/stories/electron-tracking-origin')
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeDefined()
    const schema = JSON.parse(
      container.querySelector('script[type="application/ld+json"]')!.innerHTML,
    )
    expect(schema['@type']).toBe('BreadcrumbList')
  })
})

describe('custom-technology page (contract fidelity)', () => {
  it('renders deck h1/lede/sections; §11 principle quoted; no process claims', () => {
    const { container } = render(<CustomTechnologyPage />)
    expect(screen.getAllByRole('heading', { level: 1 })[0].textContent).toBe(
      'Custom technology',
    )
    const h2s = screen
      .getAllByRole('heading', { level: 2 })
      .map((h) => h.textContent)
    expect(h2s).toEqual([
      'When custom work makes sense',
      'The principle behind it',
      'How an engagement is shaped',
    ])
    expect(
      screen.getByText(
        /“Build for the client when necessary; productize the reusable\s+technology when it creates broader value\.”/,
      ),
    ).toBeDefined()
    // §11 honesty: no timelines, teams, SLAs, division/programme names.
    expect(container.textContent).not.toMatch(
      /SLA|timeline|sprint|dedicated team|division|programme|program\b/i,
    )
    expect(
      screen.getByRole('link', { name: 'Describe the requirement' }),
    ).toBeDefined()
  })
})

describe('stories index (contract fidelity)', () => {
  it('renders deck h1/lede, the one story entry, and the §9 pattern closer', async () => {
    render(await StoriesPage())
    expect(screen.getAllByRole('heading', { level: 1 })[0].textContent).toBe(
      'Engineering stories',
    )
    expect(
      screen.getByText(
        /Real problems, what existed, what was missing, what Sandbee engineered/,
      ),
    ).toBeDefined()
    expect(
      screen
        .getByRole('link', {
          name: 'Building the missing pieces of desktop tracking',
        })
        .getAttribute('href'),
    ).toBe('/stories/electron-tracking-origin')
    expect(
      screen.getByText(
        /A real client problem becomes a technical solution; the solution\s+becomes reusable technology; the technology becomes a package,\s+service or product\./,
      ),
    ).toBeDefined()
  })
})

describe('story page (contract fidelity; MDX body stubbed here, asserted in e2e)', () => {
  it('renders the story h1/summary/date, breadcrumbs and related links', async () => {
    render(
      await StoryPage({
        params: Promise.resolve({ story: 'electron-tracking-origin' }),
        searchParams: Promise.resolve({}),
      }),
    )
    expect(screen.getAllByRole('heading', { level: 1 })[0].textContent).toBe(
      'Building the missing pieces of desktop tracking',
    )
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeDefined()
    expect(
      screen
        .getByRole('link', { name: 'See the package this became' })
        .getAttribute('href'),
    ).toBe('/technology/electron-tracking')
  })
})

describe('contact enquiry composer', () => {
  it('presents real contact channels and an honest email composition flow', () => {
    render(<ContactPage />)
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(
      'Let\u2019s find the right fit.',
    )
    expect(
      screen
        .getByRole('link', { name: /Open Sandbee Store/ })
        .getAttribute('href'),
    ).toBe('https://store.sandbee.in')
    expect(
      screen
        .getAllByRole('link', { name: 'sandbee.team@gmail.com' })[0]
        .getAttribute('href'),
    ).toBe('mailto:sandbee.team@gmail.com')
    expect(
      screen.getByText(/Your enquiry is sent only when you send that email/),
    ).toBeDefined()
    expect(screen.queryByRole('status')).toBeNull()
  })
  it('preselects valid product requests and falls back for unknown products', () => {
    navigation.query = 'product=pos'
    const { unmount } = render(<ContactPage />)
    expect(
      (screen.getByRole('radio', { name: 'Sandbee POS' }) as HTMLInputElement)
        .checked,
    ).toBe(true)
    unmount()
    navigation.query = 'product=not-a-product'
    render(<ContactPage />)
    expect(
      (
        screen.getByRole('radio', {
          name: 'Something else',
        }) as HTMLInputElement
      ).checked,
    ).toBe(true)
  })
  it('prepares an encoded email without claiming to send and invalidates it on edit', () => {
    navigation.query = 'product=messaging'
    const { container } = render(<ContactPage />)
    fireEvent.change(screen.getByLabelText('Your name'), {
      target: { value: 'Example User' },
    })
    fireEvent.change(screen.getByLabelText('Work email'), {
      target: { value: 'example@example.test' },
    })
    const message =
      'Connect my order workflow & keep the reply address unchanged.'
    fireEvent.change(
      screen.getByLabelText('Tell us a little about your workflow'),
      { target: { value: message } },
    )
    fireEvent.submit(container.querySelector('form')!)
    expect(screen.getByRole('status').textContent).toContain(
      'Your enquiry is ready.',
    )
    const href = screen
      .getByRole('link', { name: /Open email app/ })
      .getAttribute('href')!
    const url = new URL(href)
    expect(url.protocol).toBe('mailto:')
    expect(url.pathname).toBe('sandbee.team@gmail.com')
    expect(url.searchParams.get('subject')).toBe(
      'Sandbee enquiry: Sandbee Messaging',
    )
    expect(url.searchParams.get('body')).toContain(
      'Reply email: example@example.test',
    )
    expect(url.searchParams.get('body')).toContain(message)
    expect(url.searchParams.size).toBe(2)
    expect(container.textContent).not.toMatch(
      /successfully sent|request received/i,
    )
    fireEvent.change(screen.getByLabelText('Your name'), {
      target: { value: 'Changed User' },
    })
    expect(screen.queryByRole('status')).toBeNull()
  })
  it('retains validation, direct-email fallback and avoids invented response promises', () => {
    const { container } = render(<ContactPage />)
    const email = screen.getByLabelText('Work email') as HTMLInputElement
    expect(email.required).toBe(true)
    expect(email.type).toBe('email')
    expect(
      (screen.getByLabelText('Your name') as HTMLInputElement).required,
    ).toBe(true)
    expect(
      (
        screen.getByLabelText(
          'Tell us a little about your workflow',
        ) as HTMLTextAreaElement
      ).minLength,
    ).toBe(15)
    const serverMarkup = renderToStaticMarkup(
      <EnquiryComposer email="sandbee.team@gmail.com" />,
    )
    expect(serverMarkup).toContain(
      '<noscript><p>Email <a href="mailto:sandbee.team@gmail.com">',
    )
    expect(serverMarkup).toContain('<fieldset disabled="">')
    expect(container.textContent).not.toMatch(
      /within \d+|response time|24 hours|our team of|engineering side/i,
    )
  })
})
