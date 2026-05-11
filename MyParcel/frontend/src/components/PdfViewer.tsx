import { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

export default function PdfViewer({ url }: { url: string }) {
  const [scale, setScale] = useState(1)
  const [numPages, setNumPages] = useState<number>(0)

  const zoomIn = () => setScale((s) => Math.min(s + 0.2, 2.5))
  const zoomOut = () => setScale((s) => Math.max(s - 0.2, 0.6))

  if (!url) return <div className="empty">Загрузите PDF-файл для просмотра</div>

  return (
    <div className="pdf-wrapper">
      <div className="pdf-toolbar">
        <button onClick={zoomOut}>-</button>
        <span>{Math.round(scale * 100)}%</span>
        <button onClick={zoomIn}>+</button>
      </div>

      <div className="pdf-scroll">
        <Document
          file={url}
          loading={<div className="empty">Загрузка PDF...</div>}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        >
          {Array.from(new Array(numPages), (_, index) => (
            <Page key={`page_${index + 1}`} pageNumber={index + 1} scale={scale} />
          ))}
        </Document>
      </div>
    </div>
  )
}