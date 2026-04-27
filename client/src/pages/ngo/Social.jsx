import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Link2, 
  MapPin, 
  Tag, 
  Share2, 
  FileText, 
  CheckCircle2,
  Database,
  Shield,
  Droplets,
  GraduationCap,
  Building2
} from 'lucide-react';

/**
 * Social & Impact Feed — "Verified Social & Impact Feed" Stitch screen
 * 
 * Layout: 8-column feed + 4-column sidebar (matching Stitch grid)
 * Design: Government-grade institutional look with 1px borders, 
 *         status badges with dot indicators, Inter font throughout
 */

const socialPosts = [
  {
    id: 1,
    org: 'Global Health Initiative',
    orgImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwcYi6unq0YjvQV5_kSbvCGVUeEx_qGbJyYh1IEsCUMiGVuajFzDVgoEEVO8-TYy35x6kWT--PPnvnNMLGwrJofu5BFOCnR37HegpyPIQPHZKjfTISM1NPVZ4c2H6_Ptk-K265oEuP2UMo4AZ0aMwcCH8er-uQfOJKCLb7lDz0vht4O42eIuxX4Hj7Oo5rANnDS94O6OLPsXC4stCLrW0QBVM6eb-n6Sucy-AZS0U8YPr664kXZx4dTcOmTMkeIZsmgy3uCVywrXo',
    time: '14 mins ago',
    badge: { label: 'Urgent Need', color: 'bg-error-container text-on-error-container', dot: 'bg-error' },
    borderColor: 'border-l-error',
    title: 'Critical Medical Supply Shortage: Region 7 Transit',
    body: 'Logistics failure has resulted in a 48-hour delay for essential medical cargo. We require immediate localized transport support for cold-chain insulin storage in the Northern Corridor. Institutional clearance is pre-approved for all registered volunteers.',
    tags: [
      { icon: 'inventory', label: 'Supply Chain Crisis' },
      { icon: 'location_on', label: 'Northern Corridor, Sector B' },
    ],
    actions: [
      { label: 'INTERNAL SHARE', icon: Share2 },
      { label: 'VIEW MANIFEST', icon: FileText },
    ],
    cta: { label: 'JOIN INITIATIVE', className: 'bg-error text-white' },
  },
  {
    id: 2,
    org: 'TerraRenew Reforestation',
    orgImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDT0N-s-5DW4vWhRQv2feeMYhyYA5cN5c9OJlXdyrz1oHXbgRR1DIP2amJi2D-bPuoV-OAmAbktphvxvs9rwjuMr31p8SdfhbMjKpf9hfWGvYED8IMIzGbr-5XV3CqvtFAYhpzaYSbPIEsv9o5WeoBWMbtGCukxFYG_Jj5eGVEXJpkSHroYFdBbpt33YzqBJln4GVgLCYGRlW3O4Xty1wHtYzV_qikcrYSjZ2y6IThGbbZnjo5sMRyQVlUjfGq7DFHAKYb95MlX3KI',
    time: '4 hours ago',
    badge: { label: 'Impact Report', color: 'bg-surface-container text-on-surface-variant', dot: 'bg-outline' },
    borderColor: '',
    title: 'Q3 Reforestation Audit: 1.2M Saplings Verified',
    body: 'Official satellite validation has confirmed the survival rate of the Amazon Basin project at 94.2%. This exceeds our initial performance projection of 88%. Detailed data sheets are available for institutional partners.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbJT2ZgPLNUIYqucAi_Gf9tp5FGXgavt--fxVAdXs7Pnt7KIyizycMHnSkz5Wp0huxSp5DM-ujiNBhEGPOyY6pCb6kKKlwZ4f9KH9U9-SuvIpbOdSvDX3CXQTgzjnvpPArh09Me1OA2eLmchO76cfRHL8SARVWNte_vzZkc67w662IadGqnajytvBXBefWg2PNwNy3DHyTpgMzU2sYq7ERP3QWqUVTZm--APHhN_DyowDcAPcgxypx0c4xI-uCCoz9fAndIA5lEWQ',
    imageStats: [
      { label: 'Survival', value: '94.2%', color: 'text-green-600' },
      { label: 'Area', value: '4.5k ha', color: 'text-on-surface' },
    ],
    tags: [],
    actions: [
      { label: 'FOLLOWED', icon: CheckCircle2, active: true },
      { label: 'RAW DATA', icon: Database },
    ],
    cta: { label: 'VIEW FULL REPORT', className: 'bg-primary text-on-primary' },
  },
];

const networkHealth = [
  { label: 'Active Missions', value: '142', color: 'bg-primary' },
  { label: 'Urgent Alerts', value: '12', color: 'bg-error', valueColor: 'text-error' },
  { label: 'Pending Reports', value: '04', color: 'bg-outline-variant' },
];

const priorityKeywords = [
  '#LogisticsCrisis', '#SupplyChain', '#Reforestation2024',
  '#DroughtAlert', '#WaterEquity',
];

const trustedPartners = [
  { name: 'World Relief Org', icon: Shield, following: false },
  { name: 'Pure Aqua Global', icon: Droplets, following: false },
  { name: 'EduForAll Int.', icon: GraduationCap, following: true },
];

const NGOSocial = () => {
  const [postTitle, setPostTitle] = useState('');
  const [postBody, setPostBody] = useState('');

  return (
    <div className="space-y-0">
      {/* Top Bar */}
      <div className="sticky top-0 z-40 bg-surface-container-lowest border-b border-outline-variant -mx-[24px] px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-h3 text-on-surface">Institutional Feed</h2>
          <span className="bg-primary-fixed text-primary px-2 py-0.5 rounded text-label-caps uppercase tracking-widest">
            Verified
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
            <input
              type="text"
              placeholder="Search verified updates..."
              className="pl-10 pr-4 py-1.5 bg-surface-container-low border border-outline-variant rounded-lg text-body-sm w-64 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <button className="bg-primary text-on-primary px-4 py-2 rounded text-label-caps flex items-center gap-2 hover:bg-primary/90 transition-colors">
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            CREATE POST
          </button>
        </div>
      </div>

      {/* Content Grid: 8 + 4 */}
      <div className="grid grid-cols-12 gap-8 pt-6">
        {/* Feed Column */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Create Post Composer */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6">
            <div className="flex gap-4">
              <div className="h-10 w-10 bg-surface-container rounded flex items-center justify-center border border-outline-variant shrink-0">
                <Building2 className="w-5 h-5 text-on-surface-variant" />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  placeholder="Update Title"
                  className="w-full border-none p-0 text-h3 bg-transparent focus:ring-0 focus:outline-none placeholder:text-outline-variant font-semibold"
                />
                <textarea
                  value={postBody}
                  onChange={(e) => setPostBody(e.target.value)}
                  placeholder="Share an institutional update, impact report, or urgent need..."
                  className="w-full border-none p-0 mt-2 text-body-base bg-transparent focus:ring-0 focus:outline-none placeholder:text-on-surface-variant/50 resize-none h-20"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-outline-variant/30">
              <div className="flex gap-4">
                <button className="flex items-center gap-1.5 text-on-surface-variant hover:text-primary transition-colors">
                  <Link2 className="w-4 h-4" />
                  <span className="text-label-caps">PROJECT</span>
                </button>
                <button className="flex items-center gap-1.5 text-on-surface-variant hover:text-primary transition-colors">
                  <MapPin className="w-4 h-4" />
                  <span className="text-label-caps">LOCATION</span>
                </button>
                <button className="flex items-center gap-1.5 text-on-surface-variant hover:text-primary transition-colors">
                  <Tag className="w-4 h-4" />
                  <span className="text-label-caps">TYPE</span>
                </button>
              </div>
              <button className="bg-primary-container text-on-primary-container px-6 py-2 rounded text-label-caps hover:opacity-90 transition-opacity">
                PUBLISH UPDATE
              </button>
            </div>
          </section>

          {/* Posts */}
          {socialPosts.map((post) => (
            <article
              key={post.id}
              className={`bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden ${
                post.borderColor ? `border-l-4 ${post.borderColor}` : ''
              }`}
            >
              <div className="p-6">
                {/* Post Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-3">
                    <img
                      className="w-10 h-10 rounded border border-outline-variant/30 object-cover"
                      alt={post.org}
                      src={post.orgImg}
                    />
                    <div>
                      <h4 className="font-bold text-on-surface text-body-base">{post.org}</h4>
                      <p className="text-label-caps text-on-surface-variant/70 uppercase tracking-wider">
                        Posted {post.time} • verified
                      </p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-2 ${post.badge.color} px-3 py-1 rounded text-label-caps`}>
                    <span className={`w-1.5 h-1.5 ${post.badge.dot} rounded-full`} />
                    {post.badge.label}
                  </div>
                </div>

                {/* Post Content */}
                <h2 className="text-h2 text-on-surface mb-3">{post.title}</h2>
                <p className="text-body-base text-on-surface-variant mb-6 leading-relaxed">{post.body}</p>

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {post.tags.map((tag, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-1.5 bg-surface-container text-on-surface-variant px-3 py-1 rounded-lg text-body-sm font-medium"
                      >
                        <span className="material-symbols-outlined text-[16px]">{tag.icon}</span>
                        {tag.label}
                      </div>
                    ))}
                  </div>
                )}

                {/* Image */}
                {post.image && (
                  <div className="aspect-video w-full rounded-lg bg-surface-container mb-6 overflow-hidden border border-outline-variant relative">
                    <img className="w-full h-full object-cover" alt={post.title} src={post.image} />
                    {post.imageStats && (
                      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-2 rounded-lg flex items-center gap-3">
                        {post.imageStats.map((stat, i) => (
                          <div
                            key={i}
                            className={`text-center ${i < post.imageStats.length - 1 ? 'border-r border-outline-variant pr-3' : ''}`}
                          >
                            <p className="text-label-caps text-on-surface-variant uppercase">{stat.label}</p>
                            <p className={`text-body-sm font-bold ${stat.color}`}>{stat.value}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-outline-variant/30">
                  <div className="flex gap-4">
                    {post.actions.map((action, i) => (
                      <button
                        key={i}
                        className={`flex items-center gap-2 text-label-caps hover:text-primary transition-colors ${
                          action.active ? 'text-primary' : 'text-on-surface-variant'
                        }`}
                      >
                        <action.icon className="w-4 h-4" />
                        {action.label}
                      </button>
                    ))}
                  </div>
                  <button className={`${post.cta.className} px-5 py-2 rounded text-label-caps hover:opacity-90 transition-opacity`}>
                    {post.cta.label}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Network Health */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6">
            <h3 className="text-label-caps text-on-surface-variant/60 mb-6 uppercase tracking-widest">
              Network Health
            </h3>
            <div className="space-y-5">
              {networkHealth.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-1 w-8 ${item.color} rounded`} />
                    <span className="text-body-sm font-medium text-on-surface">{item.label}</span>
                  </div>
                  <span className={`font-bold text-tabular-nums ${item.valueColor || 'text-on-surface'}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Priority Keywords */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6">
            <h3 className="text-label-caps text-on-surface-variant/60 mb-4 uppercase tracking-widest">
              Priority Keywords
            </h3>
            <div className="flex flex-wrap gap-2">
              {priorityKeywords.map((kw, i) => (
                <span
                  key={i}
                  className="text-body-sm font-semibold px-3 py-1.5 bg-surface-container-low border border-outline-variant/30 text-on-surface-variant rounded"
                >
                  {kw}
                </span>
              ))}
            </div>
          </section>

          {/* Trusted Partners */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6">
            <h3 className="text-label-caps text-on-surface-variant/60 mb-6 uppercase tracking-widest">
              Trusted Partners
            </h3>
            <div className="space-y-4">
              {trustedPartners.map((partner, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center">
                      <partner.icon className="w-4 h-4 text-on-surface-variant" />
                    </div>
                    <span className="text-body-sm font-bold text-on-surface">{partner.name}</span>
                  </div>
                  <button
                    className={`font-bold text-label-caps uppercase ${
                      partner.following ? 'text-on-surface-variant' : 'text-primary'
                    }`}
                  >
                    {partner.following ? 'Following' : 'Follow'}
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default NGOSocial;
