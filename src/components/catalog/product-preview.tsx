import type { ProductId } from '@/content/catalog'
import { ProductIcon } from './product-icon'
import styles from './product-preview.module.css'

/** Static, illustrative product states. No network request or fabricated live usage. */
export function ProductPreview({
  id,
  compact = false,
}: {
  id: ProductId
  compact?: boolean
}) {
  return (
    <div
      className={`${styles.preview} ${compact ? styles.compact : ''}`}
      data-product-preview={id}
    >
      <div className={styles.toolbar}>
        <span>
          <ProductIcon id={id} />
          {id === 'gst'
            ? 'GSTIN lookup'
            : id === 'ocr'
              ? 'Document studio'
              : id === 'messaging'
                ? 'Messages'
                : 'Your counter'}
        </span>
        <small>Illustrative preview</small>
      </div>
      {id === 'gst' && (
        <div className={styles.gst}>
          <div className={styles.field}>
            <span>GST number</span>
            <code>YOUR_CUSTOMER_GSTIN</code>
            <b aria-hidden="true">↗</b>
          </div>
          <div className={styles.code}>
            <div>
              <i /> JSON response <span>Business details</span>
            </div>
            <pre>
              {
                '{\n  "gstin": "…",\n  "businessName": "…",\n  "registrationStatus": "…",\n  "address": { … }\n}'
              }
            </pre>
          </div>
          <div className={styles.footnote}>
            <span>Server → GST API → Your workflow</span>
            <strong>API key required</strong>
          </div>
        </div>
      )}
      {id === 'ocr' && (
        <div className={styles.ocr}>
          <div className={styles.document}>
            <span>Sample document</span>
            <strong>
              Text, ready
              <br />
              to work with.
            </strong>
            <i />
            <i />
            <i />
            <div className={styles.scan} />
            <small>Processed on your server</small>
          </div>
          <div className={styles.extracted}>
            <span>Structured output</span>
            <dl>
              <dt>Document</dt>
              <dd>Sample image</dd>
              <dt>Extracted text</dt>
              <dd>Text, ready to work with.</dd>
              <dt>Next step</dt>
              <dd>Review fields</dd>
            </dl>
            <div className={styles.local}>↳ Local processing</div>
          </div>
        </div>
      )}
      {id === 'messaging' && (
        <div className={styles.messaging}>
          <div className={styles.session}>
            <span className={styles.avatar}>S</span>
            <div>
              <strong>Your business</strong>
              <small>QR-connected session</small>
            </div>
            <span className={styles.balance}>Prepaid balance</span>
          </div>
          <div className={styles.chat}>
            <small>Message example</small>
            <p>
              Hello! Your order is ready for pickup.
              <span>Sent from your application</span>
            </p>
            <div>Thanks, I’m on my way.</div>
          </div>
          <div className={styles.compose}>
            <span>Panel or API. Your choice.</span>
            <b aria-hidden="true">↑</b>
          </div>
        </div>
      )}
      {id === 'pos' && (
        <div className={styles.pos}>
          <div className={styles.menu}>
            <span>Counter menu</span>
            <div>
              <b>
                <svg
                  width="34"
                  height="34"
                  viewBox="0 0 32 32"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <path d="M6 11h16v8a7 7 0 0 1-7 7h-2a7 7 0 0 1-7-7ZM22 13h3a4 4 0 0 1 0 8h-4M9 5v3M14 4v4M19 5v3M4 29h23" />
                </svg>
              </b>
              <strong>Coffee</strong>
              <small>Sample item</small>
            </div>
            <div>
              <b>
                <svg
                  width="34"
                  height="34"
                  viewBox="0 0 32 32"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <path d="m5 24 12-17 11 17H5Zm0 4h23M10 20h12M15 15h3" />
                </svg>
              </b>
              <strong>Sandwich</strong>
              <small>Sample item</small>
            </div>
          </div>
          <div className={styles.receipt}>
            <strong>Order preview</strong>
            <div>
              <span>Coffee</span>
              <span>× 2</span>
            </div>
            <div>
              <span>Sandwich</span>
              <span>× 1</span>
            </div>
            <hr />
            <div>
              <span>Order type</span>
              <span>Dine-in</span>
            </div>
            <div>
              <span>Table</span>
              <span>04</span>
            </div>
            <p>Counter → Kitchen</p>
            <small>Your account. Your deployment.</small>
          </div>
        </div>
      )}
    </div>
  )
}
