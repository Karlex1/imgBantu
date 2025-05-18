import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 50"
      width="150"
      height="37.5"
      aria-label="imgBantu Logo"
      {...props}
    >
      <rect width="200" height="50" fill="transparent" />
      <text
        x="25"
        y="35"
        fontFamily="var(--font-geist-sans), Arial, sans-serif"
        fontSize="30"
        fontWeight="bold"
        fill="hsl(var(--primary))"
      >
        img
        <tspan fill="hsl(var(--accent-foreground))">Bantu</tspan>
      </text>
    </svg>
  );
}
