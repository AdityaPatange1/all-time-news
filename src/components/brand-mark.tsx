import type { SVGProps } from "react";

/**
 * All Time News wordmark: globe meridians + latitude arcs with a twelve-o’clock
 * point suggesting continuous coverage across time. Uses currentColor for theming.
 */
export function BrandMark(props: SVGProps<SVGSVGElement>) {
  const { className, ...rest } = props;
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      {...rest}
    >
      <circle
        cx="20"
        cy="20"
        r="16.5"
        stroke="currentColor"
        strokeWidth="1.75"
        className="opacity-[0.92]"
      />
      <ellipse
        cx="20"
        cy="20"
        rx="7.5"
        ry="16.5"
        stroke="currentColor"
        strokeWidth="1.5"
        className="opacity-80"
      />
      <path
        d="M4.5 14.5c4-2.2 8.8-3.5 15.5-3.5s11.5 1.3 15.5 3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className="opacity-75"
      />
      <path
        d="M4.5 25.5c4 2.2 8.8 3.5 15.5 3.5s11.5-1.3 15.5-3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className="opacity-75"
      />
      <path
        d="M3.5 20h33"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        className="opacity-35"
      />
      <circle cx="20" cy="5.25" r="2.35" fill="currentColor" />
    </svg>
  );
}
