import { cloneElement } from 'react';
import { motion } from 'framer-motion';
import { cn } from './utils.js';

export function Button({ asChild = false, className = '', children, ...props }) {
  const classes =
    'inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-gold/60';

  if (asChild) {
    if (children && typeof children === 'object') {
      return cloneElement(children, {
        ...props,
        className: cn(classes, className, children.props.className)
      });
    }
  }

  return (
    <button className={cn(classes, className)} {...props}>
      {children}
    </button>
  );
}

export function GlassCard({ className = '', children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn(
        'rounded-3xl border border-white/10 bg-white/5 p-6 shadow-glass backdrop-blur-xl',
        className
      )}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="max-w-3xl">
      {eyebrow ? <p className="mb-3 text-xs uppercase tracking-[0.35em] text-gold">{eyebrow}</p> : null}
      <h2 className="font-display text-4xl font-semibold text-white md:text-5xl">{title}</h2>
      {description ? <p className="mt-4 text-sm leading-7 text-white/70 md:text-base">{description}</p> : null}
    </div>
  );
}
