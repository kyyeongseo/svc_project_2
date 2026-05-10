'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const FLOATING_HEARTS = [
  { size: '1.2rem', top: '8%',  left: '7%',  delay: '0s',   duration: '4.5s' },
  { size: '0.9rem', top: '13%', left: '88%', delay: '1.5s', duration: '5.2s' },
  { size: '1.5rem', top: '76%', left: '5%',  delay: '2.0s', duration: '4.0s' },
  { size: '1.0rem', top: '82%', left: '91%', delay: '0.8s', duration: '5.5s' },
];

const STEPS = [
  { icon: '✍️', label: '팀 소개 작성', desc: '아이디어와 팀을 소개해요' },
  { icon: '🔍', label: '이상형 검색',  desc: '태그로 원하는 팀을 찾아요' },
  { icon: '💗', label: '팀원 매칭',    desc: '운명의 팀원을 만나요' },
];

const PAGE_BG = `
  radial-gradient(ellipse 55% 45% at 10% 15%, rgba(255, 200, 215, 0.22) 0%, transparent 70%),
  radial-gradient(ellipse 45% 40% at 90% 85%, rgba(255, 185, 210, 0.18) 0%, transparent 70%),
  #FFFFFF
`;

export default function LandingPage() {
  const router = useRouter();
  const [beatingBtn, setBeatingBtn] = useState<string | null>(null);

  const handleNavigate = (path: string, btnId: string) => {
    if (beatingBtn) return;
    setBeatingBtn(btnId);
    setTimeout(() => router.push(path), 900);
  };

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center py-16 px-5 relative overflow-hidden"
      style={{ background: PAGE_BG }}
    >
      {/* 배경 하트 */}
      {FLOATING_HEARTS.map((h, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="absolute select-none pointer-events-none"
          style={{
            fontSize: h.size,
            top: h.top,
            left: h.left,
            opacity: 0.18,
            animation: `float ${h.duration} ${h.delay} ease-in-out infinite`,
          }}
        >
          💗
        </span>
      ))}

      <div className="w-full max-w-xl relative z-10">

        {/* ── 히어로 ──────────────────────────────── */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-5 pulse-heart inline-block">💗</div>

          <h1
            className="font-title text-4xl font-bold mb-3 leading-tight"
            style={{ color: '#B83060', letterSpacing: '0.01em' }}
          >
            두근두근 창업시그널
          </h1>

          <p
            className="font-title text-base mb-5"
            style={{ color: '#C05070', letterSpacing: '0.04em' }}
          >
            창업의 설렘, 함께할 사람을 찾다
          </p>

          <div
            className="mx-auto mb-5"
            style={{
              width: '36px', height: '1.5px',
              background: 'linear-gradient(90deg, transparent, #E8A0B4, transparent)',
            }}
          />

          <p
            className="text-sm leading-7"
            style={{ color: '#999999', wordBreak: 'keep-all' }}
          >
            아이디어는 있는데 함께할 팀이 없나요?<br />
            당신의 창업 이야기를 들려주세요 💌
          </p>
        </div>

        {/* ── 대시보드 카드 ────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">

          {/* 팀원 구하기 카드 (primary) */}
          <button
            onClick={() => handleNavigate('/write', 'write')}
            className={`dashboard-card ${beatingBtn === 'write' ? 'heartbeat-btn' : ''}`}
            style={{
              background: 'linear-gradient(140deg, #FFAAC6 0%, #F07098 100%)',
              border: 'none',
              borderRadius: '20px',
              padding: '28px 24px',
              minHeight: '178px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 6px 28px rgba(240, 112, 152, 0.22)',
              cursor: beatingBtn ? 'not-allowed' : 'pointer',
            }}
          >
            <div>
              <div
                style={{
                  width: '48px', height: '48px',
                  background: 'rgba(255,255,255,0.22)',
                  borderRadius: '14px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.5rem',
                  marginBottom: '14px',
                }}
              >
                💌
              </div>
              <p
                className="font-title text-lg font-bold mb-1"
                style={{ color: 'white', letterSpacing: '0.01em' }}
              >
                팀원 구하기
              </p>
              <p
                className="text-xs leading-5"
                style={{ color: 'rgba(255,255,255,0.78)', wordBreak: 'keep-all' }}
              >
                창업 아이디어를 소개하고<br />함께할 팀원을 찾아요
              </p>
            </div>
            <div style={{ textAlign: 'right', color: 'rgba(255,255,255,0.9)', fontSize: '0.82rem', fontWeight: 600 }}>
              글 작성하기 →
            </div>
          </button>

          {/* 팀원 찾기 카드 (secondary) */}
          <button
            onClick={() => handleNavigate('/posts', 'posts')}
            className={`dashboard-card ${beatingBtn === 'posts' ? 'heartbeat-btn' : ''}`}
            style={{
              background: '#FFFFFF',
              border: '1.5px solid rgba(232, 160, 180, 0.45)',
              borderRadius: '20px',
              padding: '28px 24px',
              minHeight: '178px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 4px 20px rgba(184, 48, 96, 0.08)',
              cursor: beatingBtn ? 'not-allowed' : 'pointer',
            }}
          >
            <div>
              <div
                style={{
                  width: '48px', height: '48px',
                  background: '#FFF0F5',
                  borderRadius: '14px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.5rem',
                  marginBottom: '14px',
                }}
              >
                🔍
              </div>
              <p
                className="font-title text-lg font-bold mb-1"
                style={{ color: '#B83060', letterSpacing: '0.01em' }}
              >
                팀원 찾기
              </p>
              <p
                className="text-xs leading-5"
                style={{ color: '#AAAAAA', wordBreak: 'keep-all' }}
              >
                등록된 팀 소개를 보고<br />나에게 맞는 팀을 찾아요
              </p>
            </div>
            <div style={{ textAlign: 'right', color: '#E05075', fontSize: '0.82rem', fontWeight: 600 }}>
              구인글 보기 →
            </div>
          </button>
        </div>

        {/* ── 이렇게 사용해요 ──────────────────────── */}
        <div
          className="rounded-2xl px-6 py-5"
          style={{
            background: '#FAFAFA',
            border: '1px solid rgba(232, 160, 180, 0.2)',
          }}
        >
          <p
            className="text-xs font-bold mb-4 text-center"
            style={{ color: '#CCCCCC', letterSpacing: '0.08em' }}
          >
            이렇게 사용해요
          </p>
          <div className="flex items-start justify-between gap-2">
            {STEPS.map((step, i) => (
              <div key={i} className="flex items-start gap-2 flex-1">
                <div className="flex flex-col items-center text-center flex-1">
                  <span style={{ fontSize: '1.4rem', marginBottom: '6px' }}>{step.icon}</span>
                  <p className="text-xs font-semibold mb-1" style={{ color: '#555555' }}>
                    {step.label}
                  </p>
                  <p className="text-xs leading-4" style={{ color: '#BBBBBB', wordBreak: 'keep-all' }}>
                    {step.desc}
                  </p>
                </div>
                {i < STEPS.length - 1 && (
                  <span
                    className="mt-3 flex-shrink-0"
                    style={{ color: '#E8C0CC', fontSize: '0.75rem' }}
                  >
                    →
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── 하단 서브텍스트 ──────────────────────── */}
        <p
          className="text-center text-xs mt-8"
          style={{ color: '#DDDDDD', letterSpacing: '0.05em' }}
        >
          대학생 창업팀 매칭 서비스
        </p>

      </div>
    </main>
  );
}
