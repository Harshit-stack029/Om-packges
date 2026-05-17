import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Home, Package, ArrowLeft } from 'lucide-react';

const NotFound = () => (
  <>
    <Helmet>
      <title>Page Not Found — OM Packaging</title>
      <meta name="robots" content="noindex" />
    </Helmet>

    <section className="min-h-[70vh] flex items-center justify-center px-4 py-20 bg-light-gray">
      <div className="max-w-lg text-center">
        <div className="relative mb-8">
          <p className="text-[120px] sm:text-[160px] font-bold text-orange/15 leading-none font-[family-name:var(--font-heading)] select-none">
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-2xl bg-white shadow-lg flex items-center justify-center">
              <Package size={36} className="text-orange" />
            </div>
          </div>
        </div>

        <h1 className="text-2xl lg:text-3xl font-bold text-navy mb-3 font-[family-name:var(--font-heading)]">
          Page not found
        </h1>
        <p className="text-om-gray text-base mb-8 font-[family-name:var(--font-caption)]">
          The page you're looking for may have moved, been renamed, or never existed. Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-orange hover:bg-orange-light text-white font-semibold px-6 py-3 rounded-lg transition-colors font-[family-name:var(--font-heading)]"
          >
            <Home size={16} /> Go to Home
          </Link>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-white border border-[#E5E7EB] hover:border-navy/30 text-navy font-semibold px-6 py-3 rounded-lg transition-colors font-[family-name:var(--font-heading)]"
          >
            <ArrowLeft size={16} /> Browse Products
          </Link>
        </div>
      </div>
    </section>
  </>
);

export default NotFound;
