export const brand = {
  colors: {
    textPrimary: "text-white",
    textMuted: "text-white/50",
    textCaption: "text-white/25",
    primaryText: "text-white/40",
    primaryTextHover: "text-white/60",
  },
  typography: {
    heading1: "text-5xl sm:text-6xl font-bold tracking-tight",
    heading4: "text-base font-semibold",
    body: "text-sm leading-relaxed",
    caption: "text-xs",
    labelWide: "text-xs uppercase tracking-[0.25em]",
  },
  spacing: {
    sectionPaddingLarge: "px-4 py-16 sm:py-24",
    stackGapLarge: "gap-20",
    stackGap: "gap-6",
    stackGapSmall: "gap-3",
    inlineGapSmall: "gap-4",
    cardPadding: "p-8",
    cardPaddingSmall: "p-5",
  },
  components: {
    cardPrimary: "rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl",
    cardSecondary: "rounded-2xl border border-white/6 bg-white/[0.03] backdrop-blur-xl",
    buttonPrimary: "px-6 py-3 rounded-xl text-sm font-medium bg-white/10 border border-white/20 text-white hover:bg-white/15 transition-all duration-200",
    buttonSecondary: "px-6 py-3 rounded-xl text-sm border border-white/8 text-white/50 hover:border-white/15 hover:text-white transition-all duration-200",
    badge: "border border-white/6 bg-white/[0.03]",
  },
  radius: {
    button: "rounded-xl",
    card: "rounded-2xl",
  },
} as const;