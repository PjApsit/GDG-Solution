/**
 * NGODirectory.jsx
 * Shows all registered NGOs with Follow/Unfollow.
 * Pagination: 3 NGOs per page.
 * When a volunteer follows an NGO, that NGO can view their profile and assign tasks.
 */
import React, { useEffect, useState } from 'react';
import {
  Building2, ChevronLeft, ChevronRight, Loader2,
  MapPin, UserCheck, UserMinus, Users,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import {
  getAllNGOs,
  getFollowedNGOs,
  followNGO,
  unfollowNGO,
} from '../services/projectService';

const PAGE_SIZE = 3;

const NGODirectory = () => {
  const { user } = useAuth();
  const [ngos, setNgos] = useState([]);
  const [followedIds, setFollowedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // ngo_id being toggled
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (!user) return;
    load();
  }, [user]);

  const load = async () => {
    try {
      setLoading(true);
      const [allNgos, followed] = await Promise.all([
        getAllNGOs(),
        getFollowedNGOs(user.id),
      ]);
      setNgos(allNgos);
      setFollowedIds(new Set(followed));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFollow = async (ngoId) => {
    if (actionLoading) return;
    setActionLoading(ngoId);
    try {
      if (followedIds.has(ngoId)) {
        await unfollowNGO(user.id, ngoId);
        setFollowedIds((prev) => { const s = new Set(prev); s.delete(ngoId); return s; });
      } else {
        await followNGO(user.id, ngoId);
        setFollowedIds((prev) => new Set([...prev, ngoId]));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const totalPages = Math.ceil(ngos.length / PAGE_SIZE);
  const paginated = ngos.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  if (loading) {
    return (
      <div className="card flex items-center justify-center py-10 gap-2 text-on-surface-variant">
        <Loader2 className="w-5 h-5 animate-spin" /> Loading NGO Directory...
      </div>
    );
  }

  if (ngos.length === 0) {
    return (
      <div className="card text-center py-10">
        <Building2 className="w-10 h-10 text-on-surface-variant mx-auto mb-2" />
        <p className="text-h3 text-on-surface">No NGOs registered yet</p>
        <p className="text-body-sm text-on-surface-variant mt-1">NGOs will appear here once they create an account.</p>
      </div>
    );
  }

  return (
    <div className="card space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-h2 text-on-surface">NGO Directory</h2>
          <p className="text-body-sm text-on-surface-variant mt-0.5">
            Follow NGOs to allow them to assign tasks to you.
          </p>
        </div>
        <span className="badge-neutral">{followedIds.size} Following</span>
      </div>

      <div className="space-y-3">
        {paginated.map((ngo) => {
          const isFollowed = followedIds.has(ngo.id);
          const isBusy = actionLoading === ngo.id;
          const initials = (ngo.full_name || ngo.organization || 'N')
            .split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

          return (
            <div
              key={ngo.id}
              className="flex items-center justify-between gap-4 p-4 rounded-xl border border-outline-variant bg-surface-container-lowest hover:bg-surface-container transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Avatar */}
                <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="text-body-base font-semibold text-on-surface truncate">
                    {ngo.organization || ngo.full_name}
                  </p>
                  <div className="flex flex-wrap gap-3 mt-0.5 text-body-sm text-on-surface-variant">
                    {ngo.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {ngo.location}
                      </span>
                    )}
                    {ngo.email && (
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" /> {ngo.email}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Follow / Unfollow */}
              <button
                disabled={isBusy}
                onClick={() => handleToggleFollow(ngo.id)}
                className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-lg text-body-sm font-semibold transition-colors ${
                  isFollowed
                    ? 'bg-surface-container text-on-surface-variant border border-outline-variant hover:bg-error/10 hover:text-error hover:border-error/30'
                    : 'btn-primary'
                }`}
                id={`follow-ngo-${ngo.id}`}
              >
                {isBusy ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : isFollowed ? (
                  <><UserMinus className="w-4 h-4" /> Unfollow</>
                ) : (
                  <><UserCheck className="w-4 h-4" /> Follow</>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2 border-t border-outline-variant">
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
            className="btn-ghost disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" /> Prev
          </button>
          <span className="text-body-sm text-on-surface-variant">
            Page {page + 1} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
            className="btn-ghost disabled:opacity-40"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default NGODirectory;
