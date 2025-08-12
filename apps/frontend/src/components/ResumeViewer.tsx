import React, { useState } from 'react';

interface ResumeViewerProps {
  resumeUrl?: string;
  applicantName?: string;
  className?: string;
}

export function ResumeViewer({
  resumeUrl,
  applicantName,
  className = '',
}: ResumeViewerProps) {
  const [showModal, setShowModal] = useState(false);
  const [iframeError, setIframeError] = useState(false);

  if (!resumeUrl) {
    return (
      <button
        disabled
        className={`${className} disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        No Resume
      </button>
    );
  }

  // Check if it's a backend-served file
  const isBackendFile =
    resumeUrl.startsWith('/uploads/') ||
    resumeUrl.startsWith('http://localhost:3000/uploads/');

  // Extract filename from resume URL
  const getFilenameFromUrl = (url: string): string => {
    if (url.startsWith('/uploads/resumes/')) {
      return url.replace('/uploads/resumes/', '');
    }
    if (url.includes('/uploads/resumes/')) {
      return url.split('/uploads/resumes/')[1];
    }
    return url.split('/').pop() || 'resume.pdf';
  };

  const filename = getFilenameFromUrl(resumeUrl);
  const backendBaseUrl = window.location.origin.replace('5173', '3000');
  const directPdfUrl = isBackendFile
    ? `${backendBaseUrl}/uploads/resumes/${filename}`
    : resumeUrl;

  // Use different strategies for PDF viewing
  const viewerUrl = directPdfUrl;
  const downloadUrl = directPdfUrl;

  const handleViewResume = () => {
    if (isBackendFile) {
      setShowModal(true);
    } else {
      // For external URLs, try to open in new tab
      window.open(resumeUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download =
      (applicantName && `${applicantName.replace(/\s+/g, '_')}_resume.pdf`) ||
      'resume.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          onClick={handleViewResume}
          className={`${className} flex items-center justify-center gap-2`}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          View Resume
        </button>

        <button
          onClick={handleDownload}
          className="btn-secondary text-sm px-3 py-1 flex items-center gap-1"
          title="Download Resume"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Download
        </button>
      </div>

      {/* Resume Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl h-5/6 flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-medium text-black">
                {applicantName ? `${applicantName}'s Resume` : 'Resume'}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownload}
                  className="btn-secondary text-sm px-3 py-1 flex items-center gap-1"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Download
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-primary-500 hover:text-primary-700 p-1"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex-1 p-4">
              {!iframeError ? (
                <iframe
                  src={viewerUrl}
                  className="w-full h-full border border-primary-200 rounded"
                  title="Resume Viewer"
                  onLoad={() => {
                    // Check if iframe loaded successfully
                    const iframe = document.querySelector(
                      'iframe[title="Resume Viewer"]',
                    ) as HTMLIFrameElement | null;
                    if (iframe) {
                      try {
                        // Try to access iframe content to detect loading issues
                        if (iframe.contentDocument === null) {
                          // PDF might be loading, this is normal
                          return;
                        }
                      } catch {
                        // Cross-origin or other error, but iframe might still work for PDFs
                        return;
                      }
                    }
                  }}
                  onError={() => {
                    console.error('Failed to load resume in iframe');
                    setIframeError(true);
                  }}
                />
              ) : (
                <div className="w-full h-full border border-primary-200 rounded bg-gray-50 flex items-center justify-center">
                  <div className="text-center p-8">
                    <svg
                      className="w-16 h-16 text-gray-400 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Preview Not Available
                    </h3>
                    <p className="text-gray-600 mb-4">
                      The resume preview cannot be displayed in this browser.
                    </p>
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={() => setIframeError(false)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        Try Again
                      </button>
                      <button onClick={handleDownload} className="btn-primary">
                        Download Resume
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t text-sm text-primary-600 text-center">
              {!iframeError
                ? "If the resume doesn't display properly, please use the download button above."
                : 'Having trouble viewing? Try downloading the resume or use a different browser.'}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
