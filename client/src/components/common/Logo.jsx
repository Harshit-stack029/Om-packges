import omLogo from '../../assets/om-packings.webp';

const Logo = ({ size = 'md', className = '' }) => {
  const presetScale = { sm: 0.85, md: 1, lg: 1.15 };
  const scale =
    typeof size === 'number'
      ? Math.max(0.7, Math.min(1.6, size / 36))
      : presetScale[size] ?? 1;

  const imgSize = `${3.0 * scale}rem`;
  const omSize  = `${1.5 * scale}rem`;
  const pkgSize = `${1.25 * scale}rem`;

  return (
    <span className={`inline-flex items-center gap-2 leading-none ${className}`}>
      <img
        src={omLogo}
        alt=""
        aria-hidden="true"
        width="48"
        height="48"
        decoding="async"
        fetchpriority="high"
        style={{ width: imgSize, height: imgSize, objectFit: 'contain' }}
        draggable={false}
      />
      <span className="inline-flex items-baseline gap-1.5">
        <span
          className="font-[family-name:var(--font-heading)] font-bold"
          style={{ fontSize: omSize, letterSpacing: '-0.01em', color: '#C0392B' }}
        >
          OM
        </span>
        <span
          className="font-[family-name:var(--font-heading)] font-medium tracking-[0.08em]"
          style={{ fontSize: pkgSize, color: '#1B2A4A' }}
        >
          PACKAGING
        </span>
      </span>
    </span>
  );
};

export default Logo;
