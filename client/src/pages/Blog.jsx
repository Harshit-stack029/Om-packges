import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO, { breadcrumbJsonLd } from '../components/common/SEO';
import { ArrowLeft, Clock, Tag, Search, X } from 'lucide-react';
import PageHero from '../components/common/PageHero';
import CTABanner from '../components/common/CTABanner';
import api from '../services/api';
import blogHero from '../assets/blog-hero.webp';

/* ─── Blog List ─────────────────────────────────────────────── */
const PostCard = ({ post, index }) => (
  <motion.article
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.35, delay: index * 0.06 }}
  >
    <Link
      to={`/blog/${post.slug}`}
      className="group block bg-white rounded-xl border border-[#E5E7EB] overflow-hidden hover:border-orange/40 hover:shadow-lg transition-all duration-300 h-full"
    >
      <div className="aspect-[16/9] bg-light-gray overflow-hidden">
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-navy/10 to-orange/10 flex items-center justify-center">
            <span className="text-4xl opacity-30">📰</span>
          </div>
        )}
      </div>
      <div className="p-5">
        {post.tags?.length > 0 && (
          <span className="text-[10px] font-semibold text-orange uppercase tracking-widest font-[family-name:var(--font-caption)]">
            {post.tags[0]}
          </span>
        )}
        <h2 className="font-bold text-navy text-base mt-1 mb-2 line-clamp-2 font-[family-name:var(--font-heading)] group-hover:text-orange transition-colors">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="text-om-gray text-sm line-clamp-3 leading-relaxed font-[family-name:var(--font-caption)]">
            {post.excerpt}
          </p>
        )}
        <div className="flex items-center gap-3 mt-4 text-xs text-[#9CA3AF] font-[family-name:var(--font-caption)]">
          <span className="flex items-center gap-1"><Clock size={11} /> {post.readTime} min read</span>
          {post.publishedAt && (
            <span>{new Date(post.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          )}
        </div>
      </div>
    </Link>
  </motion.article>
);

const PostSkeleton = () => (
  <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden animate-pulse">
    <div className="aspect-[16/9] bg-[#E5E7EB]" />
    <div className="p-5 space-y-2.5">
      <div className="h-3 w-16 bg-[#E5E7EB] rounded" />
      <div className="h-4 w-full bg-[#E5E7EB] rounded" />
      <div className="h-4 w-4/5 bg-[#E5E7EB] rounded" />
      <div className="h-3 w-full bg-[#E5E7EB] rounded" />
      <div className="h-3 w-3/4 bg-[#E5E7EB] rounded" />
    </div>
  </div>
);

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [activeTag, setActiveTag] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(search); setPage(1); }, 350);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => { setPage(1); }, [activeTag]);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 9 });
    if (debouncedSearch) params.set('search', debouncedSearch);
    if (activeTag) params.set('tag', activeTag);
    api.get(`/blog?${params}`)
      .then(({ data }) => { setPosts(data.data || []); setTotalPages(data.totalPages || 1); })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [debouncedSearch, activeTag, page]);

  return (
    <>
      <SEO
        title="Blog — OM Packaging"
        description="Insights on industrial packaging, trends, and best practices from the OM Packaging team."
        jsonLd={breadcrumbJsonLd([{ label: 'Home', path: '/' }, { label: 'Blog', path: '/blog' }])}
      />

      <PageHero
        title="Blog & Insights"
        subtitle="Packaging trends, industry knowledge, and OM Packaging news."
        breadcrumbs={[{ label: 'Blog' }]}
        image={blogHero}
      />

      <section className="section-y bg-[#FAFAFA]">
        <div className="container-page">
          {/* Search bar */}
          <div className="mb-8 flex flex-col sm:flex-row gap-4">
            <div className="relative max-w-xs">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles…"
                className="w-full pl-9 pr-8 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange font-[family-name:var(--font-caption)] placeholder:text-[#9CA3AF]"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-navy">
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <PostSkeleton key={i} />)}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-4xl mb-4">📝</p>
              <p className="text-om-gray font-[family-name:var(--font-caption)]">
                {debouncedSearch ? `No articles match "${debouncedSearch}".` : 'No blog posts published yet.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, i) => <PostCard key={post._id} post={post} index={i} />)}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors font-[family-name:var(--font-caption)] ${
                    p === page ? 'bg-orange text-white' : 'bg-white border border-[#E5E7EB] text-navy hover:border-orange/40'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <CTABanner />
    </>
  );
};

/* ─── Blog Detail ─────────────────────────────────────────────── */
const BlogDetail = ({ slug }) => {
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    api.get(`/blog/slug/${slug}`)
      .then(({ data }) => setPost(data.data || data))
      .catch(() => navigate('/blog', { replace: true }))
      .finally(() => setLoading(false));
  }, [slug, navigate]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-orange border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!post) return null;

  return (
    <>
      <SEO
        title={`${post.title} — OM Packaging Blog`}
        description={post.excerpt || `${post.title} — OM Packaging blog.`}
        image={post.coverImage}
        type="article"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.excerpt,
            image: post.coverImage,
            datePublished: post.publishedAt || post.createdAt,
            dateModified: post.updatedAt,
            author: { '@type': 'Person', name: post.author || 'OM Packaging Team' },
            publisher: {
              '@type': 'Organization',
              name: 'OM Packaging',
              logo: { '@type': 'ImageObject', url: 'https://www.ompack.in/og-image.jpg' },
            },
          },
          breadcrumbJsonLd([
            { label: 'Home', path: '/' },
            { label: 'Blog', path: '/blog' },
            { label: post.title, path: `/blog/${post.slug}` },
          ]),
        ]}
      />

      <PageHero
        title={post.title}
        breadcrumbs={[
          { label: 'Blog', to: '/blog' },
          { label: post.title },
        ]}
      />

      <article className="section-y bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-om-gray font-[family-name:var(--font-caption)] mb-8 pb-6 border-b border-[#E5E7EB]">
            <span className="flex items-center gap-1"><Clock size={14} /> {post.readTime} min read</span>
            {post.publishedAt && (
              <span>{new Date(post.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            )}
            <span>By {post.author}</span>
            {post.tags?.map((tag) => (
              <span key={tag} className="flex items-center gap-1 bg-orange/10 text-orange text-xs font-semibold px-2.5 py-1 rounded-full">
                <Tag size={10} /> {tag}
              </span>
            ))}
          </div>

          {/* Cover image */}
          {post.coverImage && (
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full rounded-xl object-cover mb-8 aspect-[16/9]"
            />
          )}

          {/* Content — rendered as HTML from the rich text editor */}
          <div
            className="prose prose-navy max-w-none font-[family-name:var(--font-caption)] prose-headings:font-[family-name:var(--font-heading)] prose-headings:text-navy prose-a:text-orange prose-strong:text-navy"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="mt-10 pt-6 border-t border-[#E5E7EB]">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-orange font-semibold text-sm hover:gap-3 transition-all font-[family-name:var(--font-caption)]"
            >
              <ArrowLeft size={14} /> Back to Blog
            </Link>
          </div>
        </div>
      </article>

      <CTABanner />
    </>
  );
};

/* ─── Router shim ─────────────────────────────────────────────── */
const Blog = () => {
  const { slug } = useParams();
  return slug ? <BlogDetail slug={slug} /> : <BlogList />;
};

export default Blog;
