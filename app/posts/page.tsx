'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// ── 상수 ────────────────────────────────────────────────────
const DOMAIN_TAGS      = ['IT','커머스','교육','헬스케어','푸드','패션','소셜','기타'];
const ROLE_TAGS        = ['개발자','디자이너','기획자','마케터','영업','재무'];
const PERSONALITY_TAGS = ['열정적인','꼼꼼한','창의적인','실행력있는','소통잘하는'];

function toArray(value: unknown): string[] {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try { return JSON.parse(value); } catch { /* fall through */ }
    return value.split(',').map(s => s.trim()).filter(Boolean);
  }
  return [];
}

type Post = {
  id: number;
  project_name: string;
  summary: string;
  description: string;
  roles: string[];
  tags: string[];
  work_type: string | null;
  contact: string | null;
  created_at: string;
};

const PAGE_BG = `
  radial-gradient(ellipse 55% 45% at 10% 15%, rgba(255, 200, 215, 0.18) 0%, transparent 70%),
  radial-gradient(ellipse 45% 40% at 90% 85%, rgba(255, 185, 210, 0.14) 0%, transparent 70%),
  #FFFFFF
`;

// ── 필터 태그 버튼 ───────────────────────────────────────────
function FilterTag({ label, selected, onClick }: {
  label: string; selected: boolean; onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '5px 13px',
        borderRadius: '50px',
        fontSize: '0.78rem',
        fontWeight: selected ? '600' : '400',
        border: selected ? '1.5px solid #E05075' : '1.5px solid #E8C8D4',
        background: selected ? 'linear-gradient(135deg, #E05075, #B83060)' : '#FFFFFF',
        color: selected ? 'white' : '#B83060',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        flexShrink: 0,
      }}
    >
      {label}
    </button>
  );
}

// ── 카드 내 작은 태그 ────────────────────────────────────────
function MiniTag({ label, variant }: { label: string; variant: 'domain' | 'role' | 'personality' }) {
  const styles = {
    domain:      { bg: '#FFF0F5', color: '#C05070', border: '1px solid #F0C8D8' },
    role:        { bg: '#FFF8F0', color: '#C07848', border: '1px solid #F0DCC8' },
    personality: { bg: '#F5F0FF', color: '#7858C0', border: '1px solid #D8C8F0' },
  }[variant];
  return (
    <span style={{
      fontSize: '0.68rem',
      padding: '2px 8px',
      borderRadius: '50px',
      background: styles.bg,
      color: styles.color,
      border: styles.border,
      whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  );
}

// ── 구인글 카드 ──────────────────────────────────────────────
function PostCard({ post, onDetail }: { post: Post; onDetail: () => void }) {
  const [btnHovered, setBtnHovered] = useState(false);
  const [cardHovered, setCardHovered] = useState(false);
  const tags = post.tags ?? [];
  const roles = post.roles ?? [];
  const domainTags = tags.filter(t => DOMAIN_TAGS.includes(t));
  const personalityTags = tags.filter(t => PERSONALITY_TAGS.includes(t));

  return (
    <div
      className="post-card"
      onMouseEnter={() => setCardHovered(true)}
      onMouseLeave={() => setCardHovered(false)}
      style={{
        background: cardHovered ? '#FFF5F8' : '#FFFFFF',
        border: cardHovered
          ? '1.5px solid rgba(224, 80, 117, 0.35)'
          : '1.5px solid rgba(232, 160, 180, 0.3)',
        borderRadius: '20px',
        padding: '22px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        boxShadow: cardHovered
          ? '0 8px 28px rgba(184, 48, 96, 0.13)'
          : '0 3px 16px rgba(184, 48, 96, 0.07)',
        transform: cardHovered ? 'translateY(-3px)' : 'translateY(0)',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
      }}
    >
      {/* 분야 + 역할 태그 */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
        {domainTags.map(d => <MiniTag key={d} label={d} variant="domain" />)}
        {roles.map(r => <MiniTag key={r} label={r} variant="role" />)}
      </div>

      {/* 팀 이름 */}
      <p
        className="font-title"
        style={{ fontSize: '1.15rem', fontWeight: 'bold', color: '#B83060', margin: 0 }}
      >
        {post.project_name}
      </p>

      {/* 팀 소개 (2줄 클램프) */}
      <p
        style={{
          fontSize: '0.83rem',
          color: '#888888',
          lineHeight: '1.6',
          margin: 0,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          wordBreak: 'keep-all',
        }}
      >
        {post.summary || post.description}
      </p>

      {/* 성향 태그 + 자세히 버튼 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
          {personalityTags.map(p => <MiniTag key={p} label={p} variant="personality" />)}
        </div>
        <button
          onClick={onDetail}
          onMouseEnter={() => setBtnHovered(true)}
          onMouseLeave={() => setBtnHovered(false)}
          style={{
            fontSize: '0.73rem',
            color: btnHovered ? '#FFFFFF' : '#E05075',
            fontWeight: 600,
            flexShrink: 0,
            marginLeft: '8px',
            background: btnHovered
              ? 'linear-gradient(135deg, #E05075, #B83060)'
              : 'rgba(224, 80, 117, 0.08)',
            border: '1.5px solid rgba(224, 80, 117, 0.35)',
            borderRadius: '50px',
            cursor: 'pointer',
            padding: '5px 12px',
            transform: btnHovered ? 'translateX(2px) scale(1.04)' : 'translateX(0) scale(1)',
            boxShadow: btnHovered ? '0 3px 10px rgba(184, 48, 96, 0.2)' : 'none',
            transition: 'all 0.18s ease',
          }}
        >
          자세히 →
        </button>
      </div>
    </div>
  );
}

// ── 상세 모달 (편지지 스타일) ────────────────────────────────
function PostModal({ post, onClose, onMatch }: {
  post: Post;
  onClose: () => void;
  onMatch: () => void;
}) {
  const [btnHovered, setBtnHovered] = useState(false);
  const tags = post.tags ?? [];
  const roles = post.roles ?? [];
  const domainTags = tags.filter(t => DOMAIN_TAGS.includes(t));
  const personalityTags = tags.filter(t => PERSONALITY_TAGS.includes(t));

  // 모달이 열려 있는 동안 body 스크롤 잠금
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const dateLabel = post.created_at
    ? new Date(post.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
    : '';

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        background: 'rgba(50, 15, 30, 0.28)',
        backdropFilter: 'blur(5px)',
        animation: 'overlayIn 0.2s ease',
      }}
    >
      {/* 편지지 카드 */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#FFFCF5',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '560px',
          maxHeight: '88vh',
          overflowY: 'auto',
          boxShadow: '0 28px 72px rgba(180, 60, 100, 0.14), 0 2px 8px rgba(0,0,0,0.06)',
          border: '1.5px solid rgba(220, 155, 175, 0.28)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'modalIn 0.28s cubic-bezier(0.34, 1.56, 0.64, 1)',
          position: 'relative',
        }}
      >
        {/* ── 편지 헤더 밴드 ── */}
        <div
          style={{
            background: 'linear-gradient(135deg, #FFF0F5 0%, #FFE8F2 100%)',
            borderRadius: '22px 22px 0 0',
            padding: '22px 28px 18px',
            borderBottom: '1.5px dashed rgba(210, 140, 165, 0.35)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          {/* 왼쪽: 발신 정보 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <p style={{ fontSize: '0.68rem', color: '#D4A0B8', letterSpacing: '0.1em', margin: 0 }}>
              💌  T E A M  L E T T E R
            </p>
            <p style={{ fontSize: '0.72rem', color: '#C8A0B5', margin: 0, letterSpacing: '0.03em' }}>
              {dateLabel}
            </p>
          </div>

          {/* 오른쪽: 우표 + 닫기 */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', flexShrink: 0 }}>
            {/* 우표 */}
            <div
              style={{
                width: '46px',
                height: '52px',
                border: '2px solid rgba(210, 140, 165, 0.45)',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.35rem',
                transform: 'rotate(2deg)',
                background: 'rgba(255, 248, 252, 0.9)',
                boxShadow: '1px 2px 5px rgba(180, 60, 100, 0.08)',
                flexShrink: 0,
              }}
            >
              💗
            </div>
            {/* 닫기 */}
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.1rem',
                color: '#D4A0B8',
                cursor: 'pointer',
                lineHeight: 1,
                padding: '2px',
                marginTop: '2px',
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* ── 편지 본문 ── */}
        <div style={{ padding: '26px 32px 30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* 분야 + 역할 태그 */}
          {(domainTags.length > 0 || roles.length > 0) && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {domainTags.map(d => <MiniTag key={d} label={d} variant="domain" />)}
              {roles.map(r => <MiniTag key={r} label={r} variant="role" />)}
            </div>
          )}

          {/* 팀 이름 */}
          <h2
            className="font-title"
            style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#C06080', margin: 0, lineHeight: 1.3 }}
          >
            {post.project_name}
          </h2>

          {/* 편지지 구분선 (물결 장식) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 -4px' }}>
            <div style={{ flex: 1, borderTop: '1.5px dashed rgba(210, 150, 170, 0.35)' }} />
            <span style={{ fontSize: '0.75rem', color: 'rgba(200, 130, 158, 0.5)', letterSpacing: '3px' }}>✦ ✦ ✦</span>
            <div style={{ flex: 1, borderTop: '1.5px dashed rgba(210, 150, 170, 0.35)' }} />
          </div>

          {/* 팀 소개 — 편지지 줄 배경 */}
          <div
            style={{
              backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, rgba(215, 155, 175, 0.13) 27px, rgba(215, 155, 175, 0.13) 28px)',
              padding: '4px 2px 4px',
            }}
          >
            <p
              style={{
                fontSize: '0.9rem',
                color: '#6A4455',
                lineHeight: '28px',
                margin: 0,
                wordBreak: 'keep-all',
                whiteSpace: 'pre-line',
              }}
            >
              {post.summary || post.description}
            </p>
          </div>

          {/* 성향 태그 */}
          {personalityTags.length > 0 && (
            <div>
              <p style={{ fontSize: '0.72rem', color: '#C8A0B8', marginBottom: '8px', letterSpacing: '0.04em' }}>
                ✨ 원하는 팀원 성향
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {personalityTags.map(p => <MiniTag key={p} label={p} variant="personality" />)}
              </div>
            </div>
          )}

          {/* 하단 서명 라인 */}
          <div style={{ borderTop: '1px solid rgba(210, 155, 175, 0.2)', paddingTop: '16px', textAlign: 'right' }}>
            <p style={{ fontSize: '0.75rem', color: '#D4B0C0', fontStyle: 'italic', margin: 0 }}>
              with love, {post.project_name} 💌
            </p>
          </div>

          {/* 함께하고 싶어요 버튼 */}
          <button
            onClick={onMatch}
            onMouseEnter={() => setBtnHovered(true)}
            onMouseLeave={() => setBtnHovered(false)}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '50px',
              fontSize: '1rem',
              fontWeight: 600,
              background: btnHovered
                ? 'linear-gradient(135deg, rgba(255,255,255,0.72) 0%, rgba(255,210,228,0.58) 100%)'
                : 'linear-gradient(135deg, rgba(255,255,255,0.52) 0%, rgba(255,210,228,0.38) 100%)',
              color: btnHovered ? '#A04060' : '#B06070',
              border: btnHovered
                ? '1.5px solid rgba(210, 120, 155, 0.65)'
                : '1.5px solid rgba(220, 150, 175, 0.45)',
              cursor: 'pointer',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              boxShadow: btnHovered
                ? '0 10px 28px rgba(200, 100, 130, 0.18), inset 0 1px 0 rgba(255,255,255,0.9)'
                : '0 6px 20px rgba(200, 100, 130, 0.1), inset 0 1px 0 rgba(255,255,255,0.75)',
              transform: btnHovered ? 'translateY(-2px)' : 'translateY(0)',
              transition: 'all 0.2s ease',
              letterSpacing: '0.03em',
            }}
          >
            💗 함께하고 싶어요
          </button>
        </div>
      </div>
    </div>
  );
}

// ── 매칭 애니메이션 오버레이 ─────────────────────────────────
function MatchOverlay() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
        background: 'rgba(255, 255, 255, 0.88)',
        backdropFilter: 'blur(6px)',
        pointerEvents: 'none',
      }}
    >
      <div style={{ fontSize: '7rem', lineHeight: 1, animation: 'heartPop 2s ease forwards' }}>
        💘
      </div>
      <p
        className="font-title"
        style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          color: '#B83060',
          animation: 'matchText 2s ease forwards',
        }}
      >
        팀원 매칭이 신청되었습니다 💘
      </p>
    </div>
  );
}

// ── 필터 초기화 버튼 ─────────────────────────────────────────
function ClearButton({ onClick, variant }: { onClick: () => void; variant: 'text' | 'filled' }) {
  const [hovered, setHovered] = useState(false);

  if (variant === 'text') {
    return (
      <button
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          marginTop: '6px',
          fontSize: '0.78rem',
          color: hovered ? '#E05075' : '#CCCCCC',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '2px 4px',
          textDecoration: hovered ? 'none' : 'underline',
          transition: 'color 0.15s ease',
        }}
      >
        필터 초기화
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '10px 24px',
        borderRadius: '50px',
        fontSize: '0.88rem',
        fontWeight: 600,
        background: hovered
          ? 'linear-gradient(135deg, #EC6080, #D04070)'
          : 'linear-gradient(135deg, #E05075, #B83060)',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        boxShadow: hovered
          ? '0 6px 22px rgba(184,48,96,0.32)'
          : '0 4px 16px rgba(184,48,96,0.22)',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'all 0.18s ease',
      }}
    >
      필터 초기화
    </button>
  );
}

// ── 메인 페이지 ──────────────────────────────────────────────
export default function PostsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showMatch, setShowMatch] = useState(false);
  const [filters, setFilters] = useState({
    domains: [] as string[],
    roles: [] as string[],
    personalities: [] as string[],
  });

  useEffect(() => {
    supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        const normalized = (data ?? []).map(post => ({
          ...post,
          tags: toArray(post.tags),
          roles: toArray(post.roles),
        }));
        setPosts(normalized);
        setLoading(false);
      });
  }, []);

  const handleMatch = useCallback(() => {
    setSelectedPost(null);
    setShowMatch(true);
    setTimeout(() => setShowMatch(false), 2200);
  }, []);

  const toggleFilter = (group: keyof typeof filters, tag: string) => {
    setFilters(prev => ({
      ...prev,
      [group]: prev[group].includes(tag)
        ? prev[group].filter(t => t !== tag)
        : [...prev[group], tag],
    }));
  };

  const clearAll = () => setFilters({ domains: [], roles: [], personalities: [] });

  const hasFilter =
    filters.domains.length > 0 ||
    filters.roles.length > 0 ||
    filters.personalities.length > 0;

  const filtered = posts.filter(post => {
    const tags = post.tags ?? [];
    const roles = post.roles ?? [];
    const domainOk = filters.domains.length === 0 ||
      filters.domains.some(d => tags.includes(d));
    const roleOk = filters.roles.length === 0 ||
      filters.roles.some(r => roles.includes(r));
    const personalityOk = filters.personalities.length === 0 ||
      filters.personalities.some(p => tags.includes(p));
    return domainOk && roleOk && personalityOk;
  });

  return (
    <>
      {/* 애니메이션 키프레임 */}
      <style>{`
        @keyframes overlayIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: translateY(24px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes heartPop {
          0%   { opacity: 0; transform: scale(0.2); }
          35%  { opacity: 1; transform: scale(1.3); }
          55%  { opacity: 1; transform: scale(1.0); }
          80%  { opacity: 1; transform: scale(1.0); }
          100% { opacity: 0; transform: scale(0.85); }
        }
        @keyframes matchText {
          0%   { opacity: 0; transform: translateY(12px); }
          30%  { opacity: 1; transform: translateY(0); }
          75%  { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; }
        }
      `}</style>

      <main className="min-h-screen py-14 px-5" style={{ background: PAGE_BG }}>
        <div className="max-w-2xl mx-auto">

          {/* 상단 네비 */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => router.push('/')}
              style={{ fontSize: '0.85rem', color: '#C8A0B0', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              ← 홈으로
            </button>
          </div>

          {/* 헤더 */}
          <div className="text-center mb-9">
            <div className="text-5xl mb-4 pulse-heart inline-block">💗</div>
            <h1 className="font-title text-3xl font-bold mb-2" style={{ color: '#B83060' }}>
              이상형 찾기
            </h1>
            <p className="text-sm" style={{ color: '#BBBBBB' }}>
              오늘의 운명적인 팀원을 만나봐요
            </p>
          </div>

          {/* 필터 카드 */}
          <div
            className="rounded-2xl px-6 py-6 mb-7"
            style={{
              background: '#FFFFFF',
              border: '1px solid rgba(232, 160, 180, 0.22)',
              boxShadow: '0 3px 20px rgba(184, 48, 96, 0.07)',
            }}
          >
            {/* 분야 */}
            <div className="mb-5">
              <p className="font-title text-sm mb-3" style={{ color: '#B83060' }}>
                어떤 분야와 함께하고 싶어요? 🚀
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
                {DOMAIN_TAGS.map(tag => (
                  <FilterTag
                    key={tag} label={tag}
                    selected={filters.domains.includes(tag)}
                    onClick={() => toggleFilter('domains', tag)}
                  />
                ))}
              </div>
            </div>

            {/* 구분선 */}
            <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, #F0D0DC, transparent)', margin: '0 0 18px' }} />

            {/* 역할 */}
            <div className="mb-5">
              <p className="font-title text-sm mb-3" style={{ color: '#B83060' }}>
                어떤 역할을 함께하고 싶어요? 🌟
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
                {ROLE_TAGS.map(tag => (
                  <FilterTag
                    key={tag} label={tag}
                    selected={filters.roles.includes(tag)}
                    onClick={() => toggleFilter('roles', tag)}
                  />
                ))}
              </div>
            </div>

            {/* 구분선 */}
            <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, #F0D0DC, transparent)', margin: '0 0 18px' }} />

            {/* 성향 */}
            <div className="mb-4">
              <p className="font-title text-sm mb-3" style={{ color: '#B83060' }}>
                어떤 성향의 팀원이 좋아요? ✨
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
                {PERSONALITY_TAGS.map(tag => (
                  <FilterTag
                    key={tag} label={tag}
                    selected={filters.personalities.includes(tag)}
                    onClick={() => toggleFilter('personalities', tag)}
                  />
                ))}
              </div>
            </div>

            {/* 필터 초기화 */}
            {hasFilter && <ClearButton onClick={clearAll} variant="text" />}
          </div>

          {/* 결과 카운트 */}
          <p className="text-sm mb-5" style={{ color: '#C8A0B0' }}>
            {loading ? '불러오는 중...' : `💗 ${filtered.length}개의 팀이 기다리고 있어요`}
          </p>

          {/* 카드 그리드 */}
          {loading ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">💌</div>
              <p className="font-title text-lg" style={{ color: '#B83060' }}>잠깐만요...</p>
            </div>
          ) : filtered.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
                gap: '16px',
              }}
            >
              {filtered.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  onDetail={() => setSelectedPost(post)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🥺</div>
              <p className="font-title text-lg mb-2" style={{ color: '#B83060' }}>
                {hasFilter ? '조건에 맞는 팀을 찾지 못했어요' : '아직 올라온 구인글이 없어요'}
              </p>
              <p className="text-sm mb-6" style={{ color: '#BBBBBB' }}>
                {hasFilter ? '필터를 바꿔보거나 초기화해봐요' : '첫 번째로 팀원을 모집해봐요!'}
              </p>
              {hasFilter && <ClearButton onClick={clearAll} variant="filled" />}
            </div>
          )}

          {/* 하단 여백용 */}
          <div className="h-12" />
        </div>
      </main>

      {/* 상세 모달 */}
      {selectedPost && (
        <PostModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onMatch={handleMatch}
        />
      )}

      {/* 매칭 애니메이션 */}
      {showMatch && <MatchOverlay />}
    </>
  );
}
