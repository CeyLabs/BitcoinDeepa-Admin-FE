import { cn } from "cn"

/** Bitcoin Deepa logo (same files as the TMA); swaps for dark mode via CSS. */
export function Logo({ className }: { className?: string }) {
  return (
    <>
      <img
        src="/BDLogo_Black.svg"
        alt="Bitcoin Deepa"
        className={cn("object-contain dark:hidden", className)}
      />
      <img
        src="/BDLogo_White.svg"
        alt=""
        aria-hidden
        className={cn("hidden object-contain dark:block", className)}
      />
    </>
  )
}
