import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFThumbnailProps {
  url: string;
  className?: string;
}

export const PDFThumbnail: React.FC<PDFThumbnailProps> = ({ url, className = '' }) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
  };

  return (
    <Document
      file={url}
      onLoadSuccess={onDocumentLoadSuccess}
      loading={
        <div className={`flex items-center justify-center bg-surface-dark ${className}`}>
          <div className="animate-pulse text-white/40">加载中...</div>
        </div>
      }
      error={
        <div className={`flex items-center justify-center bg-surface-dark ${className}`}>
          <span className="text-white/40 text-sm">无法加载预览</span>
        </div>
      }
    >
      <Page
        pageNumber={1}
        width={200}
        renderTextLayer={false}
        renderAnnotationLayer={false}
        className={className}
        canvasClassName={className}
      />
    </Document>
  );
};

export const PDFPreview: React.FC<{ url: string; className?: string }> = ({ url, className = '' }) => {
  return (
    <Document
      file={url}
      loading={
        <div className={`flex items-center justify-center ${className}`}>
          <div className="animate-pulse text-white/40">加载中...</div>
        </div>
      }
    >
      <Page
        pageNumber={1}
        className={className}
        renderTextLayer={true}
        renderAnnotationLayer={true}
      />
    </Document>
  );
};