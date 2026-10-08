'use client'

import { useActionState, useEffect, useRef } from 'react'

import {
  Button,
  Notice,
  TextAreaField,
  TextField,
} from '@/components/primitives'
import { submitContactMessage } from '@/lib/forms/action'
import { CONTACT_FORM_INITIAL } from '@/lib/forms/state'
import { CATALOG, type ProductId } from '@/content/catalog'

/*
 * Contact form — the site's one interactive client leaf so far (ADR-0007 §6 boundary
 * rule: 'use client' only where interactivity lives). Progressive enhancement per
 * ADR-0007 §8: <form action> + useActionState with the /contact permalink, so a no-JS
 * POST re-renders the page with the returned state and sticky values. Microcopy is
 * deck-verbatim (.memory/content/contact.md). Success line renders ONLY on a genuine
 * delivery (the action never fakes one — ADR-0014 Q14).
 *
 * Focus management (field.tsx CALLER CONTRACT; 06d perf-a11y findings 1–2):
 * - no-JS: the first invalid control carries the HTML autofocus attribute on the
 *   server-rendered error page, so keyboard/SR users land on the failure.
 * - JS: autofocus does not refire on a useActionState re-render, so an effect moves
 *   focus to the first invalid control (or the focusable form-level alert) whenever an
 *   error state arrives.
 */
const FIELD_ORDER = ['name', 'email', 'message'] as const

export function ContactForm({ permalink = '/contact', product }: { permalink?: string; product?: ProductId }) {
  const [state, formAction] = useActionState(
    submitContactMessage,
    CONTACT_FORM_INITIAL,
    permalink,
  )
  const formRef = useRef<HTMLFormElement>(null)
  const firstInvalid = state.fieldErrors
    ? FIELD_ORDER.find((field) => state.fieldErrors?.[field])
    : undefined
  useEffect(() => {
    if (state.status !== 'error' || !formRef.current) return
    const target = formRef.current.querySelector<HTMLElement>(
      '[aria-invalid="true"], [data-form-alert]',
    )
    target?.focus()
  }, [state])
  if (state.status === 'success') {
    return (
      <Notice kind="success" role="status">
        Received. We will reply by email.
      </Notice>
    )
  }
  return (
    <form
      ref={formRef}
      action={formAction}
      className="flex form-block flex-col gap-5"
    >
      {product && <><input type="hidden" name="product" value={product}/><p className="type-caption">Enquiry about {CATALOG.find(entry => entry.id === product)?.name}</p></>}
      {state.formError ? (
        <Notice kind="error" role="alert" data-form-alert tabIndex={-1}>
          Error — {state.formError}
        </Notice>
      ) : null}
      <TextField
        id="name"
        name="name"
        label="Name"
        autoComplete="name"
        autoFocus={firstInvalid === 'name'}
        defaultValue={state.values?.name}
        error={state.fieldErrors?.name}
      />
      <TextField
        id="email"
        name="email"
        type="email"
        label="Email"
        autoComplete="email"
        autoFocus={firstInvalid === 'email'}
        defaultValue={state.values?.email}
        error={state.fieldErrors?.email}
      />
      <TextAreaField
        id="message"
        name="message"
        label="What are you building?"
        hint="The requirement, the current setup, and what you want it to do."
        autoFocus={firstInvalid === 'message'}
        defaultValue={state.values?.message}
        error={state.fieldErrors?.message}
      />
      {/* Honeypot (ADR-0007 §8): visually hidden, must stay empty; labelled so the
          rare screen-reader encounter reads as an instruction to skip it. Name has no
          autofill-profile semantics + new-password suppresses Chromium autofill (06d
          perf-a11y finding 4 — 'website' was autofill-prone). */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="hp_field">Leave this field empty</label>
        <input
          id="hp_field"
          name="hp_field"
          type="text"
          tabIndex={-1}
          autoComplete="new-password"
        />
      </div>
      <div>
        <Button type="submit">Send the message</Button>
      </div>
    </form>
  )
}
