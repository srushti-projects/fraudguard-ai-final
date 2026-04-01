import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import FilterBar from '../components/FilterBar';
import PostCard from '../components/PostCard';
import CreatePostModal from '../components/CreatePostModal';
import DashboardLayout from '../components/DashboardLayout';

const API = 'http://localhost:8000';
const FILTERS = ['Trending', 'Most Trusted', 'Latest'];

export default function Community() {
  const [posts, setPosts]           = useState([]);
  const [activeFilter, setActiveFilter] = useState('Trending');
  const [isModalOpen, setIsModalOpen]   = useState(false);
  const [loading, setLoading]           = useState(true);

  // ── Fetch posts on mount ───────────────────────────────────────────────
  useEffect(() => {
    fetch(`${API}/community/posts`)
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(p => ({
          id:        p.id,
          username:  'Anonymous Node',
          avatar:    null,
          type:      normaliseType(p.type),
          content:   p.content,
          image:     null,
          likes:     p.likes_count || p.votes || 0,
          dislikes:  0,
          comments_count: p.comments_count || 0,
          comments:  [],
          timestamp: new Date((p.created_at || p.timestamp) + 'Z').toLocaleDateString(),
          score:     p.engagement_score || p.votes || 0,
        }));
        setPosts(formatted);
      })
      .catch(err => console.error('[Community] fetch error:', err))
      .finally(() => setLoading(false));
  }, []);

  // ── Create post ─────────────────────────────────────────────────────────
  const handleCreatePost = (newPostData) => {
    fetch(`${API}/community/post`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title:       `New ${newPostData.type} Threat`,
        description: 'Community generated alert.',
        type:        newPostData.type.toLowerCase(),
        content:     newPostData.content,
      }),
    })
      .then(res => res.json())
      .then(p => {
        const newPost = {
          id:        p.id,
          username:  'You',
          avatar:    null,
          type:      normaliseType(p.type),
          content:   p.content,
          image:     newPostData.image || null,
          likes:     p.likes_count || p.votes || 0,
          dislikes:  0,
          comments:  [],
          timestamp: 'Just now',
          score:     p.engagement_score || p.votes || 0,
        };
        setPosts(prev => [newPost, ...prev]);
        setIsModalOpen(false);
      })
      .catch(err => console.error('[Community] create post error:', err));
  };

  // ── Sort ────────────────────────────────────────────────────────────────
  const sortedPosts = useMemo(() => {
    const copy = [...posts];
    if (activeFilter === 'Trending')     return copy.sort((a, b) => b.score - a.score);
    if (activeFilter === 'Most Trusted') return copy.sort((a, b) => (b.likes - b.dislikes) - (a.likes - a.dislikes));
    if (activeFilter === 'Latest')       return copy.sort((a, b) => b.id - a.id);
    return copy;
  }, [posts, activeFilter]);

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center w-full relative z-20"
      >
        <div className="w-full flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-orbitron font-bold text-white mb-2 flex items-center gap-3">
              THREAT <span className="text-sage-400 drop-shadow-[0_0_15px_rgba(0,255,157,0.8)] animate-pulse">FEED</span>
            </h1>
            <p className="text-gray-400 font-inter text-sm md:text-base tracking-wide">
              Decentralized intelligence reporting. Stay ahead of zero-days.
            </p>
          </div>
        </div>

        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="w-full sm:w-auto overflow-x-auto scrollbar-hide">
            <FilterBar filters={FILTERS} activeFilter={activeFilter} onSelect={setActiveFilter} />
          </div>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-white/5 border border-sage-500/50 text-sage-400 hover:bg-sage-500/20 hover:text-white hover:border-sage-400 shadow-[0_0_15px_rgba(0,255,157,0.1)] hover:shadow-[0_0_20px_rgba(0,255,157,0.4)] transition-all font-orbitron font-semibold tracking-wide text-sm"
          >
            <Plus className="w-4 h-4" /> Create Post
          </button>
        </div>

        <div className="w-full pb-24">
          {loading ? (
            <div className="text-center text-gray-400 py-16 font-orbitron tracking-widest animate-pulse">
              Loading threat feed...
            </div>
          ) : sortedPosts.length === 0 ? (
            <div className="text-center text-gray-500 py-16 font-orbitron tracking-widest">
              No posts yet. Be the first to report a threat.
            </div>
          ) : (
          <AnimatePresence mode="popLayout">
            {sortedPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </AnimatePresence>
        )}
        </div>

        {isModalOpen && (
          <CreatePostModal onClose={() => setIsModalOpen(false)} onSubmit={handleCreatePost} />
        )}
      </motion.div>
    </DashboardLayout>
  );
}

// ── Helper ──────────────────────────────────────────────────────────────────
function normaliseType(raw = '') {
  const t = raw.toLowerCase();
  if (t === 'sms')   return 'SMS';
  if (t === 'email') return 'Email';
  if (t === 'url')   return 'URL';
  if (t === 'image') return 'Image';
  if (t === 'audio') return 'Audio';
  if (t === 'video') return 'Video';
  if (t === 'prompt') return 'Prompt Injection';
  if (t === 'jailbreak') return 'Jailbreak';
  return 'SMS';
}
