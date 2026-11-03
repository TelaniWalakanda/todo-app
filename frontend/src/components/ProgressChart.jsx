import { useEffect, useState } from 'react'

const SIZE = 140;
const STROKE = 14;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const ANIMATION_MS = 900;

function ProgressChart({ completed, total }) {
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
  const isComplete = total > 0 && completed === total;

  // Arc grows from 0 to pct on mount, then eases to any later value.
  const [displayPct, setDisplayPct] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let frame = requestAnimationFrame(function step(now) {
      const t = Math.min((now - start) / ANIMATION_MS, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayPct(pct * eased);
      if (t < 1) frame = requestAnimationFrame(step);
    });

    return () => cancelAnimationFrame(frame);
  }, [pct]);

  const dashOffset = CIRCUMFERENCE * (1 - displayPct / 100);

  return (
    <aside className="progress-card glass-card" aria-label="Task progress">
      <h2 className="progress-card-title">Your progress</h2>

      <div className="doughnut-wrap">
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="doughnut"
          aria-hidden="true"
        >
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="var(--accent-soft)"
            strokeWidth={STROKE}
          />
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="var(--accent-primary)"
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
            className="doughnut-fill"
          />
        </svg>

        <div className="doughnut-center">
          <progress
            className="visually-hidden"
            value={completed}
            max={total || 1}
            aria-label="Tasks completed"
          >
            {pct}%
          </progress>
          <span className="doughnut-pct" aria-hidden="true">
            {Math.round(displayPct)}%
          </span>
          <span className="doughnut-caption" aria-hidden="true">
            done
          </span>
        </div>
      </div>

      <p className="progress-card-count">
        {total === 0
          ? 'No tasks yet'
          : isComplete
            ? '🎉 All done!'
            : `${completed} of ${total} completed`}
      </p>
    </aside>
  );
}

export default ProgressChart
