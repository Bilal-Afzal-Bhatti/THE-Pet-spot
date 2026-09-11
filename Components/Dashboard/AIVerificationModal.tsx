import React from "react";

interface AIVerificationModalProps {
  isOpen: boolean;
  expectedCategory: string; // what the user selected, e.g. "cat"
  detectedCategory: string; // what the AI detected, e.g. "dog"
  confidence: number; // 0-100
  onChoosePhoto: () => void; // triggers file picker / lets them re-upload
  onClose: () => void; // dismiss without changing anything
}

export default function AIVerificationModal({
  isOpen,
  expectedCategory,
  detectedCategory,
  confidence,
  onChoosePhoto,
  onClose,
}: AIVerificationModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-verification-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start gap-3 border-b border-slate-100 px-5 pt-5 pb-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100">
            <svg
              className="h-5 w-5 text-amber-600"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 9v4m0 4h.01M10.29 3.86l-8.18 14.18A1.5 1.5 0 0 0 3.5 20.5h17a1.5 1.5 0 0 0 1.39-2.46L13.71 3.86a1.5 1.5 0 0 0-2.42 0Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <h2
              id="ai-verification-title"
              className="text-base font-semibold text-slate-900"
            >
              Photo doesn't match selected category
            </h2>
          </div>
        </div>

        {/* Body */}
        <div className="px-5 py-4">
          <p className="text-sm leading-relaxed text-slate-600">
            You selected{" "}
            <span className="font-medium text-slate-900 capitalize">
              {expectedCategory}
            </span>
            , but the photo you uploaded looks like a{" "}
            <span className="font-medium text-slate-900 capitalize">
              {detectedCategory}
            </span>{" "}
            ({confidence}% confidence).
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Upload a photo of your {expectedCategory}, or change the category
            to match the photo.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 border-t border-slate-100 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Keep this photo
          </button>
          <button
            type="button"
            onClick={onChoosePhoto}
            className="flex-1 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Choose different photo
          </button>
        </div>
      </div>
    </div>
  );
}