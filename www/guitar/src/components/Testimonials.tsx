import { useCallback, useEffect, useRef, useState } from "react";
import * as stylex from '@stylexjs/stylex';

export type Testemonial = {
  name: string;
  text: string;
  stars: number;
}

const TRANSITION_MS = 500;

const testimonials: Testemonial[] = [
  {
    name: "Alice Johnson",
    text: "I had an amazing experience with MK Guitar School! The tutors are incredibly knowledgeable and patient, making it easy for me to learn at my own pace. I've seen significant improvement in my playing since I started taking lessons here.",
    stars: 5,
  },
  {
    name: "Bob Smith",
    text: "MK Guitar School has been a game-changer for me. The variety of lessons available means that there's something for everyone, regardless of skill level. The tutors are friendly and supportive, creating a great learning environment.",
    stars: 4.5,
  },
  {
    name: "Charlie Davis",
    text: "I highly recommend MK Guitar School to anyone looking to improve their guitar skills. The lessons are well-structured and the tutors are fantastic at breaking down complex concepts into easy-to-understand lessons.",
    stars: 4,
  },
];

const GOLD = '#f9d81f';

export function Stars({ count }: { count: number }) {
  return (
    <div style={{ display: "flex", gap: 5 }} aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => {
        const starNumber = i + 1;
        const isFull = count >= starNumber;
        const isHalf = !isFull && count >= i + 0.5;

        return (
          <svg key={i} width={18} height={18} viewBox="0 0 18 18">
            <defs>
              <clipPath id={`half-${i}`}>
                <rect x="0" y="0" width="9" height="18" />
              </clipPath>
            </defs>

            <polygon
              points="9,1 11.5,6.5 17.5,7.2 13,11.5 14.3,17.5 9,14.5 3.7,17.5 5,11.5 0.5,7.2 6.5,6.5"
              fill="#a7a7a738"
            />

            {isFull && (
              <polygon
                points="9,1 11.5,6.5 17.5,7.2 13,11.5 14.3,17.5 9,14.5 3.7,17.5 5,11.5 0.5,7.2 6.5,6.5"
                fill={GOLD}
              />
            )}

            {isHalf && (
              <polygon
                points="9,1 11.5,6.5 17.5,7.2 13,11.5 14.3,17.5 9,14.5 3.7,17.5 5,11.5 0.5,7.2 6.5,6.5"
                fill={GOLD}
                clipPath={`url(#half-${i})`}
              />
            )}
          </svg>
        );
      })}
    </div>
  );
}

function ChevronLeft() {
  return (
    <svg width={18} height={18} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="11,3 5,9 11,15" />
    </svg>
  );
}
 
function ChevronRight() {
  return (
    <svg width={18} height={18} viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="7,3 13,9 7,15" />
    </svg>
  );
}

export function Testimonials() {
  const [current, setCurrent] = useState(0);
  const isAnimating = useRef(false);
  const touchStart = useRef(0);
  const total = testimonials.length;
 
  const goTo = useCallback((index: number) => {
    if (isAnimating.current) return;
    const next = ((index % total) + total) % total;
    if (next === current) return;
    isAnimating.current = true;
    setCurrent(next);
    setTimeout(() => { isAnimating.current = false; }, TRANSITION_MS + 20);
  }, [current, total]);
 
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goTo(current - 1);
      if (e.key === "ArrowRight") goTo(current + 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [current, goTo]);

  return <section {...stylex.props(styles.section)}>
    <span {...stylex.props(styles.header)}>What our students say</span>
    <p {...stylex.props(styles.p)}>
      Hear from some of our students about their experience learning guitar with us.
    </p>
    <div {...stylex.props(styles.carousel)}>
        <div {...stylex.props(styles.viewport)}>
          <div {...stylex.props(styles.cardTrack(current))}
            onTouchStart={(e) => { touchStart.current = e.touches[0].clientX; }}
            onTouchEnd={(e) => {
              const dx = e.changedTouches[0].clientX - touchStart.current;
              if (Math.abs(dx) > 40) setCurrent(dx < 0 ? current + 1 : current - 1);
            }}>
          {testimonials.map((t, i) => (
            <div key={i} {...stylex.props(styles.card)}>
              <div {...stylex.props(styles.quoteMark)}>
                &ldquo;
              </div>
              <p>
                {t.text}
              </p>
              <div {...stylex.props(styles.cardFooter)}>
                <strong>{t.name}</strong>
                <Stars count={t.stars} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    <CarouselControls total={testimonials.length} current={current} onSelect={goTo} />
  </section>
}
export type CarouselControlsProps = {
  total: number;
  current: number;
  onSelect: (index: number) => void;
}

export function CarouselControls({onSelect, current, total}: CarouselControlsProps) {
  return <div {...stylex.props(styles.carouselControls)}>
    <button {...stylex.props(styles.carouselButton)} onClick={() => onSelect(current - 1)} aria-label="Previous">
      <ChevronLeft />
    </button>
    <div {...stylex.props(styles.selectionIndicator(total))}>
    {
      Array.from({ length: testimonials.length }, (_, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          aria-label={`Go to slide ${i + 1}`}
          {...stylex.props(styles.selectionDot, i === current && styles.currentSelectionDot)}
        />
      ))
    }
    </div>
    <button {...stylex.props(styles.carouselButton)} onClick={() => onSelect(current + 1)} aria-label="Next">
      <ChevronRight />
    </button>
  </div>
}

const styles = stylex.create({
  quoteMark: {
    fontSize: "4.5rem",
    lineHeight: 0.6,
    opacity: 0.6,
    marginBottom: "-0.5rem"
  },
  section: {
    backgroundColor: '#f8f8f8',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: '3rem',
    paddingBottom: '2rem',
    paddingInline: '1rem',
  },
  header: {
    maxWidth: '1200px',
    marginInline: 'auto',
    padding: '2rem 0rem 0.5rem',
    fontSize: '2rem',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  p: {
    maxWidth: '800px',
    marginInline: 'auto',
    padding: '0 1rem',
    fontSize: '1.25rem',
    textAlign: 'center',
    color: '#555',
  },
  carousel: {
    width: '100%',
    maxWidth: '800px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  viewport: {
    width: '100%',
    overflow: 'hidden',
    paddingInline: '0.7rem',
    paddingBlock: '0.5rem',
  },
  cardTrack: (current: number) => ({
    display: 'flex',
    columnGap: '1rem',
    transform: `translateX(calc(-${current * 100}% - ${current} * 1rem))`,
    transition: `transform ${TRANSITION_MS}ms cubic-bezier(0.77, 0, 0.175, 1)`,
    willChange: "transform",
  }),
  slide: {
    minWidth: '100%',
    boxSizing: 'border-box',
    paddingInline: '1rem',
    flexShrink: 0,
  },
  card: {
    minWidth: "100%",
    backgroundColor: "white",
    color: "black",
    borderRadius: 20,
    padding: "clamp(1.75rem, 5vw, 2.75rem)",
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
    userSelect: "none",
    boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px'
  },
  cardFooter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: "1.5rem",
    borderTop: "1px solid rgba(255,255,255,0.07)"
  },
  selectionIndicator: (total: number) => ({
    display: 'flex',
    gap: '4px',
    alignItems: 'center',
    width: (total - 1) * (6 + 4) + 22,
  }),
  selectionDot: {
    userSelect: 'none',
    width: '6px',
    height: '6px',
    borderRadius: '999px',
    borderWidth: '0px',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    transition: 'width 0.3s ease',
  },
  currentSelectionDot: {
    width: '22px',
    backgroundColor: '#393939',
  },
  carouselControls: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "2rem",
    gap: "1.5rem",
  },
  carouselButton: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    borderWidth: '0px',
    backgroundColor: 'transparent',
    color: 'black',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    [':hover']: { backgroundColor: 'rgba(0,0,0,0.1)' },
    [':active']: { backgroundColor: 'rgba(0,0,0,0.2)' },
  }
});