// Compose a real email; do not pretend an unconfigured backend has sent a request.
'use client'
import { useState, useSyncExternalStore, type FormEvent } from 'react'
import { useSearchParams } from 'next/navigation'
import { CATALOG } from '@/content/catalog'
import styles from './enquiry.module.css'

const subscribe = () => () => {}
const clientReady = () => true
const serverReady = () => false

export function EnquiryComposer({ email }: { email: string }) {
  const ready = useSyncExternalStore(subscribe, clientReady, serverReady)
  const searchParams = useSearchParams()
  const requested = searchParams.get('product')
  const [selection, setProduct] = useState<string | null>(null)
  const product =
    selection ??
    (CATALOG.some((p) => p.id === requested) ? requested! : 'general')
  const [message, setMessage] = useState('')
  const [emailHref, setEmailHref] = useState('')
  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = String(data.get('name') ?? '').trim()
    const bodyText = message.trim()
    if (name.length < 2 || bodyText.length < 15) {
      const field = event.currentTarget.elements.namedItem(name.length < 2 ? 'name' : 'message') as HTMLInputElement | HTMLTextAreaElement
      field.setCustomValidity(name.length < 2 ? 'Enter your name using at least two characters.' : 'Describe your workflow using at least 15 characters.')
      field.reportValidity()
      return
    }
    const chosen =
      CATALOG.find((p) => p.id === product)?.name ?? 'a custom requirement'
    const subject = `Sandbee enquiry: ${chosen}`
    const body = `Hello Sandbee,\n\nI would like to discuss ${chosen}.\n\nName: ${name}\nReply email: ${data.get('email')}\n\n${bodyText}`
    setEmailHref(
      `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
    )
  }
  return (
    <form
      method="post"
      onSubmit={prepare}
      className={styles.form}
      onChange={(event) => {
        const field = event.target
        if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) field.setCustomValidity('')
        setEmailHref('')
      }}
    >
      <fieldset disabled={!ready}>
        <fieldset>
          <legend>What can we help you with?</legend>
          <div className={styles.options}>
            {[
              ...CATALOG.map((p) => ({ id: p.id, name: p.name })),
              { id: 'general', name: 'Something else' },
            ].map((p) => (
              <label key={p.id}>
                <input
                  type="radio"
                  name="product"
                  value={p.id}
                  checked={product === p.id}
                  onChange={() => setProduct(p.id)}
                />
                <span>{p.name}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <div className={styles.fields}>
          <label>
            Your name
            <input
              name="name"
              autoComplete="name"
              required
              minLength={2}
              maxLength={100}
            />
          </label>
          <label>
            Work email
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
            />
          </label>
        </div>
        <label>
          Tell us a little about your workflow
          <textarea
            name="message"
            required
            minLength={15}
            maxLength={2000}
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What do you want to set up, connect or improve?"
          />
        </label>
        <button type="submit">
          Prepare my enquiry <span aria-hidden="true">→</span>
        </button>
        <p className={styles.note}>
          This prepares an email for your mail app. Your enquiry is sent only
          when you send that email.
        </p>
        {emailHref && (
          <div className={styles.ready} role="status">
            <strong>Your enquiry is ready.</strong>
            <p>
              Open your email app, review the message and send it to Sandbee.
            </p>
            <a href={emailHref}>Open email app →</a>
            <small>If no mail app is configured, email {email} directly.</small>
          </div>
        )}
      </fieldset>
      <noscript>
        <p>
          Email <a href={`mailto:${email}`}>{email}</a> directly. The enquiry
          composer needs JavaScript.
        </p>
      </noscript>
    </form>
  )
}
