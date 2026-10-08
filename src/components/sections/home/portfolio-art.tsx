import styles from './portfolio.module.css'

/** Concept illustrations: product, connection and reusable code; not product screenshots. */
export function PortfolioArt({ kind }: { kind: string }) {
  return (
    <svg
      className={styles.art}
      viewBox="0 0 360 220"
      aria-hidden="true"
      focusable="false"
    >
      <ellipse className={styles.orbit} cx="180" cy="125" rx="149" ry="78" />
      {kind === 'Products' ? (
        <g className={styles.object}>
          <rect
            className={styles.back}
            x="70"
            y="54"
            width="194"
            height="130"
            rx="8"
          />
          <rect
            className={styles.sheet}
            x="87"
            y="37"
            width="194"
            height="130"
            rx="8"
          />
          <path
            className={styles.line}
            d="M87 67H281M108 51H113M122 51H127M136 51H141M107 88H153M107 100H140"
          />
          <rect
            className={styles.tile}
            x="107"
            y="119"
            width="40"
            height="29"
            rx="4"
          />
          <rect
            className={styles.tile}
            x="157"
            y="99"
            width="40"
            height="49"
            rx="4"
          />
          <rect
            className={styles.solid}
            x="207"
            y="81"
            width="53"
            height="67"
            rx="4"
          />
        </g>
      ) : kind === 'Services' ? (
        <g className={styles.object}>
          <path
            className={styles.line}
            d="M61 120C100 120 96 64 145 64H179M180 67C244 67 228 145 290 145M178 69V171"
          />
          <circle className={styles.sheet} cx="61" cy="120" r="22" />
          <circle className={styles.sheet} cx="290" cy="145" r="22" />
          <circle className={styles.tile} cx="178" cy="171" r="14" />
          <rect
            className={styles.solid}
            x="150"
            y="35"
            width="58"
            height="58"
            rx="12"
          />
          <path className={styles.light} d="M163 66L174 77L195 53" />
          <circle className={styles.solid} cx="61" cy="120" r="5" />
          <circle className={styles.solid} cx="290" cy="145" r="5" />
        </g>
      ) : (
        <g className={styles.object}>
          <rect
            className={styles.back}
            x="88"
            y="53"
            width="192"
            height="131"
            rx="8"
          />
          <rect
            className={styles.sheet}
            x="74"
            y="36"
            width="192"
            height="131"
            rx="8"
          />
          <path className={styles.line} d="M74 65H266M93 51H117M130 51H151" />
          <path
            className={styles.code}
            d="M139 88L113 111L139 134M201 88L227 111L201 134M184 82L160 139"
          />
          <rect
            className={styles.solid}
            x="239"
            y="143"
            width="40"
            height="40"
            rx="7"
          />
          <path className={styles.light} d="M250 163L257 170L269 155" />
        </g>
      )}
    </svg>
  )
}
