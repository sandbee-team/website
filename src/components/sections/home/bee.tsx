import styles from './bee.module.css'

/*
 * The Sandbee bee — an original anatomical vector: three body regions, six jointed legs,
 * veined wings (reference: ASU honey-bee anatomy, see .memory/research/
 * 2026-09-08-premium-bee-motion.md). Drawn for a 20–30px rendering, not a mascot.
 * Colour and wing motion live in bee.module.css and are keyed on ANCESTOR state
 * attributes (`data-arrival` on the wordmark, `data-in-view` on a scene,
 * `html[data-motion='paused']`), so the header and the hero share one animation source.
 */
export function Bee({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 180 120"
      className={`${styles.bee} ${className}`}
      aria-hidden="true"
      focusable="false"
      data-bee
    >
      <g className={`${styles.legs} ${styles.legsBack}`} fill="none">
        <path d="M83 70L66 82L53 96L43 99M96 73L102 93L119 103L129 104M113 75L135 85L151 104L161 105" />
      </g>
      <path
        className={styles.abdomen}
        d="M112 54C132 47 158 57 170 72C165 88 140 94 120 84L105 71Z"
      />
      <path
        className={styles.bands}
        d="M127 53Q120 69 130 88M143 56Q135 73 145 87M157 62Q151 75 158 82"
        fill="none"
      />
      <path
        className={styles.abdomenLight}
        d="M124 57Q145 56 160 68"
        fill="none"
      />
      <g className={`${styles.wing} ${styles.wingBack}`} data-wing>
        <path d="M91 57C101 38 140 14 157 25C164 38 129 63 96 66Z" />
        <path
          className={styles.veins}
          d="M94 60L150 28M115 48L119 34M115 48L137 45M130 40L137 28"
          fill="none"
        />
      </g>
      <path
        className={styles.thorax}
        d="M71 52C81 42 102 45 113 56C124 69 113 85 97 84C77 84 64 69 71 52Z"
      />
      <path
        className={styles.fuzz}
        d="M74 49l-3-5m9 3l-1-5m8 3l1-5m7 6l3-4m5 8l4-4M74 72l-5 3m11 3l-3 5m12-2l-1 5m11-4l2 5m7-9l5 2"
        fill="none"
      />
      <g className={`${styles.wing} ${styles.wingFront}`} data-wing>
        <path d="M85 58C85 34 111 6 133 10C151 18 124 50 92 65Z" />
        <path
          className={styles.veins}
          d="M89 60L130 15M101 46L100 31M101 46L119 41M115 31L114 20M115 31L131 28"
          fill="none"
        />
      </g>
      <path
        className={styles.head}
        d="M72 51C64 44 49 47 44 57C37 68 49 80 64 77L78 66Z"
      />
      <ellipse
        className={styles.eye}
        cx="50"
        cy="60"
        rx="4"
        ry="7"
        transform="rotate(19 50 60)"
      />
      <path className={styles.eyeLight} d="M49 55L48 59" />
      <g className={styles.antennae} fill="none">
        <path d="M51 51L43 36L30 31M61 49L59 33L49 24M44 73L34 78" />
      </g>
      <g className={styles.legs} fill="none">
        <path d="M77 72L63 85L55 106L44 108M94 78L93 97L106 111L117 111M108 77L132 88L142 107L152 109" />
      </g>
    </svg>
  )
}
