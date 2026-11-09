import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import tiktokLogo from "@/assets/tiktok.svg";

export const Route = createFileRoute("/")({
  head: () => ({
    title: "TikTok Rewards Program – Earn Up to $325",
    meta: [
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1.0",
      },
      {
        property: "og:title",
        content: "TikTok is paying users to complete a quick survey",
      },
      {
        property: "og:description",
        content: "Selected users are receiving up to $325 directly through PayPal. It takes less than 5 minutes. No registration required.",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
    ],
  }),
  component: Index,
});

type QuizState = 'intro' | 'q1' | 'q2' | 'q3' | 'calculating' | 'congrats';

function Index() {
  const navigate = useNavigate();
  const [vagas, setVagas] = useState(23);
  const [liveCount, setLiveCount] = useState(247);
  const [showNotif, setShowNotif] = useState(false);
  const [notifData, setNotifData] = useState({ icon: '📍', title: '', sub: '' });
  const [quizState, setQuizState] = useState<QuizState>('intro');
  const [reward, setReward] = useState<number | null>(null);

  const playCashSound = () => {
    const AudioContextClass = window.AudioContext;
    if (!AudioContextClass) return;

    const audioContext = new AudioContextClass();
    const masterGain = audioContext.createGain();
    masterGain.gain.setValueAtTime(0.0001, audioContext.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.22, audioContext.currentTime + 0.01);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.72);
    masterGain.connect(audioContext.destination);

    const notes = [987.77, 1318.51, 1567.98];
    notes.forEach((frequency, index) => {
      const oscillator = audioContext.createOscillator();
      const noteGain = audioContext.createGain();
      const startsAt = audioContext.currentTime + index * 0.095;

      oscillator.type = index === 0 ? "square" : "sine";
      oscillator.frequency.setValueAtTime(frequency, startsAt);
      noteGain.gain.setValueAtTime(0.0001, startsAt);
      noteGain.gain.exponentialRampToValueAtTime(index === 0 ? 0.28 : 0.5, startsAt + 0.012);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, startsAt + 0.28);
      oscillator.connect(noteGain);
      noteGain.connect(masterGain);
      oscillator.start(startsAt);
      oscillator.stop(startsAt + 0.3);
    });

    window.setTimeout(() => void audioContext.close(), 900);
  };

  useEffect(() => {
    // Participant counter
    const countInterval = setInterval(() => {
      setLiveCount(prev => prev + Math.floor(Math.random() * 2));
    }, 6000);

    // Vagas decrease
    const vagasTimer = setTimeout(function decrease() {
      setVagas(prev => {
        if (prev <= 1) return prev;
        return prev - 1;
      });
      setTimeout(decrease, (30 + Math.floor(Math.random() * 25)) * 1000);
    }, (30 + Math.floor(Math.random() * 25)) * 1000);

    // Notifications
    const notifications = [
      { delay: 2500, icon: '📍', title: 'Only 1 person in your area<br>can still participate', sub: 'Based on your location' },
      { delay: 45000, icon: '✅', title: 'Emma from New York just participated', sub: 'A few seconds ago' },
      { delay: 90000, icon: '⚠️', title: 'Last spot in your city', sub: 'Reserved for 2 minutes — claim yours' },
      { delay: 140000, icon: '💸', title: 'Michael from Miami received $850 via PayPal', sub: 'Just now' },
    ];

    notifications.forEach(n => {
      setTimeout(() => {
        setNotifData(n);
        setShowNotif(true);
        setTimeout(() => setShowNotif(false), 6000);
      }, n.delay);
    });

    return () => {
      clearInterval(countInterval);
      clearTimeout(vagasTimer);
    };
  }, []);

  const progressPct = Math.round(((100 - vagas) / 100) * 100);

  const handleNext = () => {
    if (reward !== null) return;
    if (quizState === 'intro') {
      setQuizState('q1');
      return;
    }
    // Random reward after each answer ($50–$150, in increments of 5)
    const amount = 50 + Math.floor(Math.random() * 21) * 5;
    setReward(amount);
    playCashSound();
    setTimeout(() => {
      setReward(null);
      if (quizState === 'q1') setQuizState('q2');
      else if (quizState === 'q2') setQuizState('q3');
      else if (quizState === 'q3') {
        setQuizState('calculating');
        setTimeout(() => setQuizState('congrats'), 3000);
      }
    }, 2200);
  };

  const renderContent = () => {
    switch (quizState) {
      case 'intro':
        return (
          <>
            <section className="hero">
              <h1>TikTok is paying users <span>in the United States</span> to complete a <span>quick survey</span></h1>
              <div className="live-count">
                <div className="live-dot"></div>
                <span>{liveCount}</span> people participating now
              </div>
            </section>

            <div className="cards">
              <div className="vagas-card">
                <div className="flex items-center gap-2 mb-[10px]">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 1.5C4.41 1.5 1.5 4.41 1.5 8C1.5 11.59 4.41 14.5 8 14.5C11.59 14.5 14.5 11.59 14.5 8C14.5 4.41 11.59 1.5 8 1.5ZM8 4.5C8.83 4.5 9.5 5.17 9.5 6C9.5 6.83 8.83 7.5 8 7.5C7.17 7.5 6.5 6.83 6.5 6C6.5 5.17 7.17 4.5 8 4.5ZM8 12.5C6.5 12.5 5.18 11.72 4.42 10.54C4.44 9.33 6.83 8.67 8 8.67C9.17 8.67 11.56 9.33 11.58 10.54C10.82 11.72 9.5 12.5 8 12.5Z" fill="#ff4d67"/>
                  </svg>
                  <span className="text-[14px] font-bold text-[#ff4d67]">Only <strong>{vagas} spots</strong> left today!</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progressPct}%` }}></div>
                </div>
                <div className="flex justify-between text-[12px] text-[#999999]">
                  <span>🔥 {progressPct}% of spots filled</span>
                  <span>{100 - vagas}/100</span>
                </div>
              </div>

              <div className="benefit">
                <div className="benefit-icon">💰</div>
                <div>
                  <div className="benefit-title">$50 to $150 per question</div>
                  <div className="benefit-sub">Every answer counts — no waiting</div>
                </div>
              </div>

              <div className="benefit">
                <div className="benefit-icon">⚡</div>
                <div>
                  <div className="benefit-title">PayPal in up to 5 minutes</div>
                  <div className="benefit-sub">No fees, directly to your account</div>
                </div>
              </div>

              <div className="benefit">
                <div className="benefit-icon">📈</div>
                <div>
                  <div className="benefit-title">Up to $325 total</div>
                  <div className="benefit-sub">Complete everything to maximize your reward</div>
                </div>
              </div>
            </div>

            <div className="cta-wrap">
              <button onClick={handleNext} className="btn">
                CLAIM MY SPOT NOW
                <span className="text-[20px] ml-2">›</span>
              </button>
            </div>
          </>
        );
      case 'q1':
        return (
          <div className="quiz-container">
            <div className="question-box">
              <div className="question-text">How long have you been using TikTok?</div>
              <div className="options-list">
                {['Less than 1 month', '1 to 6 months', '6 to 12 months', 'More than 1 year'].map(opt => (
                  <button key={opt} onClick={handleNext} className="option-btn">{opt}</button>
                ))}
              </div>
            </div>
          </div>
        );
      case 'q2':
        return (
          <div className="quiz-container">
            <div className="question-box">
              <div className="question-text">How often do you watch videos on TikTok?</div>
              <div className="options-list">
                {['Every day', 'A few times a week', 'Rarely', 'Never'].map(opt => (
                  <button key={opt} onClick={handleNext} className="option-btn">{opt}</button>
                ))}
              </div>
            </div>
          </div>
        );
      case 'q3':
        return (
          <div className="quiz-container">
            <div className="question-box">
              <div className="question-text">Would you recommend TikTok to a friend?</div>
              <div className="options-list">
                {['Yes, definitely', 'Maybe', 'No'].map(opt => (
                  <button key={opt} onClick={handleNext} className="option-btn">{opt}</button>
                ))}
              </div>
            </div>
          </div>
        );
      case 'calculating':
        return (
          <div className="quiz-container text-center">
            <div className="question-box">
              <div className="h-12 w-12 mx-auto mb-4 animate-spin rounded-full border-4 border-[#ff4d67]/30 border-t-[#ff4d67]"></div>
              <div className="question-text">Analyzing your answers...</div>
              <p className="text-[#999999]">We are checking reward availability in your area.</p>
            </div>
          </div>
        );
      case 'congrats':
        return (
          <div className="quiz-container text-center">
            <div className="question-box">
              <div className="text-5xl mb-4">🎉</div>
              <div className="question-text text-[#22c55e]">Congratulations! You were selected!</div>
              <p className="mb-6 text-[#555555]">
                Your profile was approved, and your <strong>$325.00</strong> reward is ready to withdraw.
              </p>
              <button 
                onClick={() => navigate({ to: "/withdraw" })} 
                className="btn"
              >
                WITHDRAW NOW
                <span className="text-[20px] ml-2">›</span>
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <div className="live-bar">
        <div className="live-bar-dot"></div>
        LIVE · Spots being claimed now
      </div>

      <header className="header">
        <div className="logo-wrap">
          <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-black p-1.5">
            <img src={tiktokLogo} alt="TikTok" className="h-full w-full object-contain invert" />
          </div>
          <span className="text-xl font-black tracking-tighter text-[#1a1a2e]">TikTok</span>
        </div>
        <div className="verified-badge">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="7" fill="#ff4d67"/>
            <path d="M4 7L6 9L10 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Official TikTok For Business Partner
        </div>
      </header>

      {renderContent()}

      <div className="trust">
        <span className="trust-item">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1L8.09 4.26L11.69 4.81L9.09 7.34L9.68 10.92L6.5 9.26L3.32 10.92L3.91 7.34L1.31 4.81L4.91 4.26L6.5 1Z" fill="#22c55e"/></svg>
          100% Secure
        </span>
        <span className="trust-item">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="5.5" stroke="#22c55e" strokeWidth="1.2"/><path d="M4 6.5L6 8.5L9.5 5" stroke="#22c55e" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          50K+ participants
        </span>
      </div>

      <div className="validade">📅 Valid only through {new Date().toLocaleDateString('en-US')}</div>

      <footer>
        By participating, you agree to our <a href="#">Terms</a> and <a href="#">Conditions</a>.
      </footer>

      {reward !== null && (
        <div className="reward-overlay" role="status" aria-live="assertive">
          <div className="reward-rays" aria-hidden="true"></div>
          <div className="reward-confetti" aria-hidden="true">
            {Array.from({ length: 12 }, (_, index) => (
              <i key={index} style={{ "--confetti-index": index } as React.CSSProperties}></i>
            ))}
          </div>
          <div className="reward-popup">
            <div className="reward-icon-wrap" aria-hidden="true">
              <div className="reward-icon">$</div>
              <span className="reward-coin reward-coin-left">$</span>
              <span className="reward-coin reward-coin-right">$</span>
            </div>
            <div className="reward-label">Reward unlocked!</div>
            <div className="reward-amount">+${reward.toFixed(2)}</div>
            <div className="reward-sub"><span>✓</span> Added to your balance</div>
            <div className="reward-progress" aria-hidden="true"><span></span></div>
          </div>
        </div>
      )}

      <div className={`notif ${showNotif ? 'show' : ''}`}>
        <div className="notif-icon">{notifData.icon}</div>
        <div className="notif-text">
          <div className="notif-title" dangerouslySetInnerHTML={{ __html: notifData.title }}></div>
          <div className="notif-sub">{notifData.sub}</div>
        </div>
      </div>
    </div>
  );
}
