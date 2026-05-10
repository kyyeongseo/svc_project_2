'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// ── 상수 ────────────────────────────────────────────────────
const DOMAIN_TAGS      = ['IT','커머스','교육','헬스케어','푸드','패션','소셜','기타'];
const ROLE_TAGS        = ['개발자','디자이너','기획자','마케터','영업','재무'];
const PERSONALITY_TAGS = ['열정적인','꼼꼼한','창의적인','실행력있는','소통잘하는'];

// ── 더미 데이터 ─────────────────────────────────────────────
const POSTS = [
  {
    id: 1,
    projectName: '헬시밀',
    teamIntro: '바쁜 현대인을 위한 맞춤형 식단 관리 앱을 만들고 있어요. 건강한 삶을 더 쉽게 만들어가는 팀입니다.',
    domains: ['헬스케어', 'IT'],
    roles: ['개발자', '디자이너'],
    personalities: ['열정적인', '실행력있는'],
  },
  {
    id: 2,
    projectName: '로컬핏',
    teamIntro: '동네 소상공인과 소비자를 연결하는 로컬 커머스 플랫폼이에요. 지역 경제 활성화에 기여하고 싶어요.',
    domains: ['커머스', '소셜'],
    roles: ['기획자', '마케터'],
    personalities: ['소통잘하는', '창의적인'],
  },
  {
    id: 3,
    projectName: '에듀핏',
    teamIntro: 'AI 기반 맞춤형 학습 플랫폼을 만들고 있어요. 모든 학생이 자신에게 맞는 교육을 받을 수 있도록 하는 게 목표예요.',
    domains: ['교육', 'IT'],
    roles: ['개발자', '기획자'],
    personalities: ['꼼꼼한', '창의적인'],
  },
  {
    id: 4,
    projectName: '스타일박스',
    teamIntro: '구독형 패션 큐레이션 서비스예요. 개인의 취향에 맞는 옷을 매달 집으로 보내드려요.',
    domains: ['패션', '커머스'],
    roles: ['디자이너', '마케터'],
    personalities: ['창의적인', '소통잘하는'],
  },
  {
    id: 5,
    projectName: '밥친구',
    teamIntro: '혼밥족을 위한 식사 메이트 매칭 앱이에요. 같은 동네 사람들과 함께 밥을 먹으며 새로운 인연을 만들어요.',
    domains: ['푸드', '소셜'],
    roles: ['기획자', '개발자'],
    personalities: ['열정적인', '소통잘하는'],
  },
  {
    id: 6,
    projectName: '케어링크',
    teamIntro: '독거노인과 자원봉사자를 연결하는 돌봄 플랫폼이에요. 기술로 사회 문제를 해결하고 싶어요.',
    domains: ['헬스케어', '소셜'],
    roles: ['기획자', '마케터', '개발자'],
    personalities: ['꼼꼼한', '실행력있는'],
  },
  {
    id: 7,
    projectName: '픽톡',
    teamIntro: '숏폼 콘텐츠 기반 소셜 미디어 플랫폼이에요. 새로운 형태의 크리에이터 생태계를 만들어가고 있어요.',
    domains: ['IT', '소셜'],
    roles: ['개발자', '디자이너'],
    personalities: ['창의적인', '열정적인'],
  },
  {
    id: 8,
    projectName: '핏클럽',
    teamIntro: '온·오프라인 통합 피트니스 커뮤니티예요. 함께 운동하며 건강한 라이프스타일을 함께 만들어가요.',
    domains: ['헬스케어', '커머스'],
    roles: ['마케터', '재무'],
    personalities: ['실행력있는', '꼼꼼한'],
  },
];

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
function PostCard({ post }: { post: typeof POSTS[0] }) {
  return (
    <div
      className="post-card"
      style={{
        background: '#FFFFFF',
        border: '1.5px solid rgba(232, 160, 180, 0.3)',
        borderRadius: '20px',
        padding: '22px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        boxShadow: '0 3px 16px rgba(184, 48, 96, 0.07)',
        cursor: 'default',
      }}
    >
      {/* 분야 + 역할 태그 */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
        {post.domains.map(d => <MiniTag key={d} label={d} variant="domain" />)}
        {post.roles.map(r => <MiniTag key={r} label={r} variant="role" />)}
      </div>

      {/* 팀 이름 */}
      <p
        className="font-title"
        style={{ fontSize: '1.15rem', fontWeight: 'bold', color: '#B83060', margin: 0 }}
      >
        {post.projectName}
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
        {post.teamIntro}
      </p>

      {/* 성향 태그 + 더 보기 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
          {post.personalities.map(p => <MiniTag key={p} label={p} variant="personality" />)}
        </div>
        <span style={{ fontSize: '0.75rem', color: '#E05075', fontWeight: 600, flexShrink: 0, marginLeft: '8px' }}>
          자세히 →
        </span>
      </div>
    </div>
  );
}

// ── 메인 페이지 ──────────────────────────────────────────────
export default function PostsPage() {
  const router = useRouter();
  const [filters, setFilters] = useState({
    domains: [] as string[],
    roles: [] as string[],
    personalities: [] as string[],
  });

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

  const filtered = POSTS.filter(post => {
    const domainOk = filters.domains.length === 0 ||
      filters.domains.some(d => post.domains.includes(d));
    const roleOk = filters.roles.length === 0 ||
      filters.roles.some(r => post.roles.includes(r));
    const personalityOk = filters.personalities.length === 0 ||
      filters.personalities.some(p => post.personalities.includes(p));
    return domainOk && roleOk && personalityOk;
  });

  return (
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
          {hasFilter && (
            <button
              onClick={clearAll}
              style={{
                marginTop: '6px',
                fontSize: '0.78rem',
                color: '#CCCCCC',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                textDecoration: 'underline',
              }}
            >
              필터 초기화
            </button>
          )}
        </div>

        {/* 결과 카운트 */}
        <p className="text-sm mb-5" style={{ color: '#C8A0B0' }}>
          💗 {filtered.length}개의 팀이 기다리고 있어요
        </p>

        {/* 카드 그리드 */}
        {filtered.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
              gap: '16px',
            }}
          >
            {filtered.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🥺</div>
            <p className="font-title text-lg mb-2" style={{ color: '#B83060' }}>
              조건에 맞는 팀을 찾지 못했어요
            </p>
            <p className="text-sm mb-6" style={{ color: '#BBBBBB' }}>
              필터를 바꿔보거나 초기화해봐요
            </p>
            <button
              onClick={clearAll}
              style={{
                padding: '10px 24px',
                borderRadius: '50px',
                fontSize: '0.88rem',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #E05075, #B83060)',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(184,48,96,0.22)',
              }}
            >
              필터 초기화
            </button>
          </div>
        )}

        {/* 하단 여백용 */}
        <div className="h-12" />
      </div>
    </main>
  );
}
