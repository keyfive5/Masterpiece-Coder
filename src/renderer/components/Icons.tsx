import React from 'react';

type P = { size?: number; className?: string };

const svg = (path: React.ReactNode, viewBox = '0 0 24 24') =>
  function Icon({ size = 15, className }: P) {
    return (
      <svg
        width={size}
        height={size}
        viewBox={viewBox}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
      >
        {path}
      </svg>
    );
  };

export const Chevron = svg(<path d="M9 6l6 6-6 6" />);
export const Folder = svg(<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />);
export const FileIcon = svg(
  <>
    <path d="M14 3v5h5" />
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9l5 5v11a2 2 0 0 1-2 2z" />
  </>,
);
export const Sparkle = svg(<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" />);
export const Play = svg(<path d="M7 4l12 8-12 8z" />);
export const Stop = svg(<rect x="6" y="6" width="12" height="12" rx="2" />);
export const Gear = svg(
  <>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
  </>,
);
export const History = svg(
  <>
    <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
    <path d="M3 3v5h5" />
    <path d="M12 7v5l3 2" />
  </>,
);
export const Diff = svg(
  <>
    <path d="M12 3v18M4 8h6M4 16h6M14 12h6" />
    <path d="M17 9l3 3-3 3" />
  </>,
);
export const Eye = svg(
  <>
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z" />
    <circle cx="12" cy="12" r="3" />
  </>,
);
export const Code = svg(<path d="M9 18l-6-6 6-6M15 6l6 6-6 6" />);
export const Plus = svg(<path d="M12 5v14M5 12h14" />);
export const Refresh = svg(
  <>
    <path d="M21 12a9 9 0 1 1-2.6-6.4L21 8" />
    <path d="M21 3v5h-5" />
  </>,
);
export const Terminal = svg(
  <>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M7 9l3 3-3 3M13 15h4" />
  </>,
);
export const Trash = svg(
  <>
    <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    <path d="M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" />
  </>,
);
export const Check = svg(<path d="M4 12l5 5L20 6" />);
export const X = svg(<path d="M6 6l12 12M18 6L6 18" />);
export const Brain = svg(
  <>
    <path d="M9.5 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5.2A3 3 0 0 0 7 17.6 3 3 0 0 0 12 19V5.5A1.5 1.5 0 0 0 10.5 4z" />
    <path d="M14.5 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5.2 3 3 0 0 1-2.5 5.4A3 3 0 0 1 12 19" />
  </>,
);
export const Save = svg(
  <>
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <path d="M17 21v-8H7v8M7 3v5h8" />
  </>,
);
export const Send = svg(<path d="M4 12l16-8-6 16-2.5-6.2z" />);
export const Undo = svg(
  <>
    <path d="M3 8h11a6 6 0 0 1 0 12H8" />
    <path d="M3 8l4-4M3 8l4 4" />
  </>,
);
export const External = svg(
  <>
    <path d="M14 4h6v6" />
    <path d="M20 4l-9 9" />
    <path d="M19 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5" />
  </>,
);
export const Minus = svg(<path d="M5 12h14" />);
export const Square = svg(<rect x="5" y="5" width="14" height="14" rx="2" />);
