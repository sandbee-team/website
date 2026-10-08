/*
 * LazyMotion feature bundle (ADR-0007 §6 Level 2): loaded at runtime via
 * `features={() => import('./motion-features').then((r) => r.default)}` so the
 * animation engine never enters a route's initial JS — only the tiny m/LazyMotion
 * wrappers do, and those live in an ssr:false island chunk themselves (07d).
 */
import { domAnimation } from 'motion/react'

export default domAnimation
