// Slim credit band that sits beneath the main Footer.
// Intentionally lightweight: no JS, no icons, no animation library — just CSS
// transitions on the link. Renders at the very bottom of every public page.
const PoweredByStrip = () => (
  <div className="border-t border-[#E5E7EB] bg-white">
    <div className="container-page py-4 sm:py-5 text-center">
      <p className="text-[12px] sm:text-[13px] text-[#6B7280] tracking-wide">
        Powered by{' '}
        <a
          href="https://www.rhobel.com"
          target="_blank"
          rel="noopener noreferrer"
          className="
            group relative inline-block font-semibold text-[#2563EB]
            transition-colors duration-200 ease-out
            hover:text-[#1D4ED8] focus-visible:text-[#1D4ED8]
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#93C5FD]
            focus-visible:ring-offset-2 rounded-sm
          "
        >
          Rhobel Inc.
          <span
            aria-hidden="true"
            className="
              pointer-events-none absolute left-0 right-0 -bottom-0.5 h-[1.5px]
              origin-left scale-x-0 bg-current
              transition-transform duration-300 ease-out
              group-hover:scale-x-100 group-focus-visible:scale-x-100
            "
          />
        </a>
      </p>
    </div>
  </div>
);

export default PoweredByStrip;
