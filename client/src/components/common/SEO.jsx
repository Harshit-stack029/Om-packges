import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://www.ompack.in';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;
const SITE_NAME = 'OM Packagings';

/**
 * Reusable SEO wrapper.
 *   <SEO
 *     title="Wooden Crates — OM Packaging"
 *     description="…"
 *     image="https://…/cover.jpg"
 *     type="article"
 *     jsonLd={{ '@context': 'https://schema.org', '@type': 'Product', … }}
 *   />
 */
const SEO = ({
  title,
  description,
  image = DEFAULT_OG_IMAGE,
  type = 'website',
  noIndex = false,
  jsonLd = null,
  keywords,
}) => {
  const { pathname } = useLocation();
  const url = `${SITE_URL}${pathname}`;
  const fullTitle = title?.includes(SITE_NAME) ? title : `${title} — ${SITE_NAME}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={url} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={image} />

      {jsonLd && (Array.isArray(jsonLd) ? jsonLd : [jsonLd]).map((block, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(block)}
        </script>
      ))}
    </Helmet>
  );
};

export const ORG_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'OM Packagings',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description: 'Industrial packaging manufacturer in Bengaluru — wooden crates, corrugated boxes, pallets, and custom export packaging.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'No. 15, Dhana Lakshmi Layout, Vidhyaranya Pura',
    addressLocality: 'K.G. Shyamarajapura, Bengaluru',
    addressRegion: 'Karnataka',
    postalCode: '560097',
    addressCountry: 'IN',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+91-99452-66092',
    contactType: 'sales',
    email: 'info@ompackagings.in',
    areaServed: 'IN',
    availableLanguage: ['en', 'hi', 'kn'],
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.0',
    reviewCount: '52',
    bestRating: '5',
  },
  sameAs: [],
};

export const breadcrumbJsonLd = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, idx) => ({
    '@type': 'ListItem',
    position: idx + 1,
    name: item.label,
    item: `${SITE_URL}${item.path}`,
  })),
});

export default SEO;
