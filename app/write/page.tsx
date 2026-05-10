'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const DOMAIN_TAGS = ['IT', '커머스', '교육', '헬스케어', '푸드', '패션', '소셜', '기타'];
const ROLE_TAGS = ['개발자', '디자이너', '기획자', '마케터', '영업', '재무', '기타'];
const PERSONALITY_TAGS = ['열정적인', '꼼꼼한', '창의적인', '실행력있는', '소통잘하는', '기타'];

type AnimPhase = 'idle' | 'letter' | 'done';


// 태그 버튼
function TagButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '6px 15px',
        borderRadius: '50px',
        fontSize: '0.82rem',
        fontWeight: selected ? '600' : '400',
        border: selected ? '1.5px solid #E05075' : '1.5px solid #E8C0CC',
        background: selected
          ? 'linear-gradient(135deg, #E05075, #B83060)'
          : '#FFFFFF',
        color: selected ? '#FFFFFF' : '#B83060',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        letterSpacing: '0.01em',
      }}
    >
      {label}
    </button>
  );
}

// 기타 직접 입력칸
function EtcInput({ value, onChange, placeholder }: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="etc-slide" style={{ marginTop: '12px' }}>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="diary-input"
        autoFocus
        style={{
          width: '100%',
          border: 'none',
          borderBottom: '1.5px solid #E8C0CC',
          outline: 'none',
          fontSize: '0.88rem',
          padding: '7px 2px',
          color: '#333333',
          background: 'transparent',
          fontFamily: 'inherit',
          transition: 'border-color 0.15s',
        }}
      />
    </div>
  );
}

// 섹션 구분선
function Divider() {
  return (
    <div
      className="my-7"
      style={{
        height: '1px',
        background: 'linear-gradient(90deg, transparent, #F0D0DC, transparent)',
      }}
    />
  );
}

const PAGE_BG = `
  radial-gradient(ellipse 55% 45% at 10% 15%, rgba(255, 200, 215, 0.2) 0%, transparent 70%),
  radial-gradient(ellipse 45% 40% at 90% 85%, rgba(255, 185, 210, 0.16) 0%, transparent 70%),
  #FFFFFF
`;

export default function WritePage() {
  const router = useRouter();
  const [today, setToday] = useState('');
  const [animPhase, setAnimPhase] = useState<AnimPhase>('idle');
  const [form, setForm] = useState({
    projectName: '',
    teamIntro: '',
    domains: [] as string[],
    domainEtc: '',
    roles: [] as string[],
    roleEtc: '',
    personalities: [] as string[],
    personalityEtc: '',
  });
  const [errors, setErrors] = useState({ projectName: false, teamIntro: false });

  useEffect(() => {
    setToday(
      new Date().toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
      })
    );
  }, []);

  const toggleTag = (field: 'roles' | 'personalities' | 'domains', tag: string) => {
    setForm(prev => {
      const isSelected = prev[field].includes(tag);
      const etcKey =
        field === 'domains' ? 'domainEtc' :
        field === 'roles'   ? 'roleEtc'   : 'personalityEtc';
      return {
        ...prev,
        [field]: isSelected
          ? prev[field].filter(t => t !== tag)
          : [...prev[field], tag],
        // 기타 해제 시 입력값도 초기화
        ...(tag === '기타' && isSelected ? { [etcKey]: '' } : {}),
      };
    });
  };

  const handleSubmit = async () => {
    const newErrors = {
      projectName: !form.projectName.trim(),
      teamIntro: !form.teamIntro.trim(),
    };
    setErrors(newErrors);
    if (newErrors.projectName || newErrors.teamIntro) return;

    setAnimPhase('letter');

    const roles = form.roles
      .map(r => (r === '기타' ? form.roleEtc || '기타' : r))
      .filter(Boolean);
    const domainTags = form.domains
      .map(d => (d === '기타' ? form.domainEtc || '기타' : d))
      .filter(Boolean);
    const personalityTags = form.personalities
      .map(p => (p === '기타' ? form.personalityEtc || '기타' : p))
      .filter(Boolean);

    await supabase.from('posts').insert({
      project_name: form.projectName.trim(),
      summary: form.teamIntro.trim(),
      description: form.teamIntro.trim(),
      roles,
      tags: [...domainTags, ...personalityTags],
    });

    // letterSend 애니메이션(2.6s) + 여유(0.2s)
    setTimeout(() => setAnimPhase('done'), 2800);
  };

  // ── 성공 화면 ──────────────────────────────────────────
  if (animPhase === 'done') {
    return (
      <main
        className="min-h-screen flex flex-col items-center justify-center"
        style={{ background: PAGE_BG }}
      >
        <div className="text-center px-6 fade-in-up">
          <div className="text-7xl mb-6">💌</div>
          <h2
            className="font-title text-3xl mb-3"
            style={{ color: '#B83060' }}
          >
            러브레터가 날아갔어요!
          </h2>
          <p
            className="text-sm leading-7 mb-10"
            style={{ color: '#AAAAAA', wordBreak: 'keep-all' }}
          >
            소중한 팀원을 찾고 있을 거예요.<br />
            인연이 되는 팀원이 곧 나타날 거예요 💗
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.push('/posts')}
              style={{
                background: 'linear-gradient(135deg, #E05075 0%, #B83060 100%)',
                color: 'white',
                padding: '13px 28px',
                borderRadius: '50px',
                fontSize: '0.9rem',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(184, 48, 96, 0.28)',
              }}
            >
              🔍 팀원 구경하기
            </button>
            <button
              onClick={() => {
                setForm({ projectName: '', teamIntro: '', domains: [], domainEtc: '', roles: [], roleEtc: '', personalities: [], personalityEtc: '' });
                setErrors({ projectName: false, teamIntro: false });
                setAnimPhase('idle');
              }}
              style={{
                background: '#FFFFFF',
                color: '#B83060',
                padding: '13px 28px',
                borderRadius: '50px',
                fontSize: '0.9rem',
                fontWeight: '600',
                border: '1.5px solid #E8A0B4',
                cursor: 'pointer',
              }}
            >
              ✏️ 새 글 쓰기
            </button>
            <button
              onClick={() => router.push('/')}
              style={{
                background: '#FFFFFF',
                color: '#AAAAAA',
                padding: '13px 28px',
                borderRadius: '50px',
                fontSize: '0.9rem',
                fontWeight: '600',
                border: '1.5px solid #E0E0E0',
                cursor: 'pointer',
              }}
            >
              🏠 홈으로
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ── 메인 폼 ────────────────────────────────────────────
  return (
    <>
      {/* 애니메이션 오버레이 */}
      {animPhase === 'letter' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(255, 255, 255, 0.96)', backdropFilter: 'blur(6px)' }}
        >
          <div
            className="letter-send"
            style={{ fontSize: '7rem', lineHeight: 1, userSelect: 'none' }}
          >
            💌
          </div>
        </div>
      )}

      <main
        className="min-h-screen py-14 px-5"
        style={{ background: PAGE_BG }}
      >
        <div className="max-w-lg mx-auto">

          {/* 뒤로가기 */}
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.85rem',
              color: '#C8A0B0',
              textDecoration: 'none',
              marginBottom: '2rem',
            }}
          >
            ← 돌아가기
          </Link>

          {/* 다이어리 헤더 */}
          <div className="text-center mb-8">
            <p
              className="text-xs mb-2"
              style={{ color: '#CCCCCC', letterSpacing: '0.06em' }}
            >
              {today}
            </p>
            <h1
              className="font-title text-3xl mb-2"
              style={{ color: '#B83060' }}
            >
              💌 팀원 모집 일기
            </h1>
            <p className="text-sm" style={{ color: '#BBBBBB' }}>
              운명의 팀원에게 보내는 편지
            </p>
          </div>

          {/* 다이어리 카드 */}
          <div
            className="rounded-3xl px-8 py-9"
            style={{
              background: '#FFFFFF',
              boxShadow: '0 4px 40px rgba(184, 48, 96, 0.08), 0 1px 6px rgba(0,0,0,0.04)',
              border: '1px solid rgba(232, 160, 180, 0.2)',
            }}
          >

            {/* ① 팀 이름 */}
            <div>
              <label
                className="font-title block text-base mb-3"
                style={{ color: '#B83060' }}
              >
                우리 팀, 어떻게 불러요? 💗
              </label>
              <input
                type="text"
                className="diary-input"
                value={form.projectName}
                onChange={e => {
                  setForm(prev => ({ ...prev, projectName: e.target.value }));
                  if (e.target.value.trim()) setErrors(prev => ({ ...prev, projectName: false }));
                }}
                placeholder="팀 이름이나 프로젝트 이름을 적어줘요"
                style={{
                  width: '100%',
                  border: 'none',
                  borderBottom: errors.projectName
                    ? '2px solid #FF6B8A'
                    : '1.5px solid #E8C0CC',
                  outline: 'none',
                  fontSize: '1rem',
                  padding: '8px 2px',
                  color: '#333333',
                  background: 'transparent',
                  fontFamily: 'inherit',
                  transition: 'border-color 0.15s',
                }}
              />
              {errors.projectName && (
                <p className="text-xs mt-2" style={{ color: '#FF6B8A' }}>
                  팀 이름을 알려줘야 연인을 찾을 수 있어요 💗
                </p>
              )}
            </div>

            <Divider />

            {/* ② 팀 소개 */}
            <div>
              <label
                className="font-title block text-base mb-3"
                style={{ color: '#B83060' }}
              >
                우리 팀 이야기를 들려줄게요 📖
              </label>
              <textarea
                className="diary-textarea"
                value={form.teamIntro}
                onChange={e => {
                  setForm(prev => ({ ...prev, teamIntro: e.target.value }));
                  if (e.target.value.trim()) setErrors(prev => ({ ...prev, teamIntro: false }));
                }}
                placeholder="어떤 팀인지, 어떤 꿈을 꾸는지 솔직하게 적어봐요..."
                rows={5}
                style={{
                  width: '100%',
                  border: errors.teamIntro
                    ? '1.5px solid #FF6B8A'
                    : '1.5px solid #E8C0CC',
                  borderRadius: '12px',
                  outline: 'none',
                  fontSize: '0.93rem',
                  padding: '10px 14px',
                  color: '#333333',
                  // 다이어리 줄 배경
                  backgroundImage:
                    'repeating-linear-gradient(transparent, transparent 27px, rgba(232, 160, 180, 0.2) 27px, rgba(232, 160, 180, 0.2) 28px)',
                  lineHeight: '28px',
                  fontFamily: 'inherit',
                  resize: 'none',
                  transition: 'border-color 0.15s',
                }}
              />
              {errors.teamIntro && (
                <p className="text-xs mt-2" style={{ color: '#FF6B8A' }}>
                  팀 소개를 적어줘야 팀원이 찾아올 수 있어요 💌
                </p>
              )}
            </div>

            <Divider />

            {/* ③ 분야 태그 */}
            <div>
              <label
                className="font-title block text-base mb-3"
                style={{ color: '#B83060' }}
              >
                우리가 도전할 분야예요 🚀
              </label>
              <div className="flex flex-wrap gap-2">
                {DOMAIN_TAGS.map(tag => (
                  <TagButton
                    key={tag}
                    label={tag}
                    selected={form.domains.includes(tag)}
                    onClick={() => toggleTag('domains', tag)}
                  />
                ))}
              </div>
              {form.domains.includes('기타') && (
                <EtcInput
                  value={form.domainEtc}
                  onChange={v => setForm(prev => ({ ...prev, domainEtc: v }))}
                  placeholder="어떤 분야인지 직접 적어줘요"
                />
              )}
            </div>

            <Divider />

            {/* ④ 모집 역할 */}
            <div>
              <label
                className="font-title block text-base mb-3"
                style={{ color: '#B83060' }}
              >
                이런 사람이 필요해요 🌟
              </label>
              <div className="flex flex-wrap gap-2">
                {ROLE_TAGS.map(tag => (
                  <TagButton
                    key={tag}
                    label={tag}
                    selected={form.roles.includes(tag)}
                    onClick={() => toggleTag('roles', tag)}
                  />
                ))}
              </div>
              {form.roles.includes('기타') && (
                <EtcInput
                  value={form.roleEtc}
                  onChange={v => setForm(prev => ({ ...prev, roleEtc: v }))}
                  placeholder="어떤 역할인지 직접 적어줘요"
                />
              )}
            </div>

            <Divider />

            {/* ⑤ 원하는 성향 */}
            <div className="mb-10">
              <label
                className="font-title block text-base mb-3"
                style={{ color: '#B83060' }}
              >
                이런 성향이었으면 해요 ✨
              </label>
              <div className="flex flex-wrap gap-2">
                {PERSONALITY_TAGS.map(tag => (
                  <TagButton
                    key={tag}
                    label={tag}
                    selected={form.personalities.includes(tag)}
                    onClick={() => toggleTag('personalities', tag)}
                  />
                ))}
              </div>
              {form.personalities.includes('기타') && (
                <EtcInput
                  value={form.personalityEtc}
                  onChange={v => setForm(prev => ({ ...prev, personalityEtc: v }))}
                  placeholder="어떤 성향인지 직접 적어줘요"
                />
              )}
            </div>

            {/* 제출 버튼 */}
            <button
              onClick={handleSubmit}
              className="w-full"
              style={{
                background: 'linear-gradient(135deg, #E05075 0%, #B83060 100%)',
                color: 'white',
                padding: '16px',
                borderRadius: '50px',
                fontSize: '1rem',
                fontWeight: '700',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 6px 24px rgba(184, 48, 96, 0.28)',
                letterSpacing: '0.03em',
              }}
            >
              💌 이 편지를 보낼게요
            </button>
          </div>

          {/* 하단 힌트 */}
          <p
            className="text-center text-xs mt-6"
            style={{ color: '#CCCCCC' }}
          >
            당신의 창업 이야기가 누군가의 마음에 닿을 거예요 💗
          </p>

        </div>
      </main>
    </>
  );
}
