import Image from "next/image"

// The real application screenshot, presented as a polished marketing hero image.
// Kept faithful to the actual UI — framed, subtly desaturated and lit to match
// the site's monochrome dark aesthetic.
export function AppMock() {
  return (
    <div className="relative">
      {/* soft ambient shadow underneath the window */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 bottom-0 -z-10 h-16 rounded-[50%] bg-foreground/20 blur-2xl"
      />

      {/* premium glass window frame */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0b] shadow-2xl shadow-black/60 ring-1 ring-black/50">
        <Image
          src="/images/app-hero.png"
          alt="Productivity Timesheet desktop app showing a 15-minute planning and activity log with progress, focus score and a planned-versus-actual timeline"
          width={2244}
          height={1240}
          priority
          className="h-auto w-full select-none [filter:grayscale(1)_contrast(1.06)_brightness(0.98)]"
        />

        {/* subtle vignette to keep focus on the app */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 [box-shadow:inset_0_0_120px_30px_rgba(0,0,0,0.55)]"
        />

        {/* faint top glass highlight */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/10"
        />
      </div>
    </div>
  )
}
