'use client';
import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Github, Linkedin, Mail, Send, CheckCircle } from 'lucide-react';

const SOCIALS = [
  { icon: Mail, label: 'Email', value: 'team@indiainnovates.dev', href: 'mailto:team@indiainnovates.dev' },
  { icon: Github, label: 'GitHub', value: 'github.com/india-innovates', href: 'https://github.com' },
  { icon: Linkedin, label: 'LinkedIn', value: 'linkedin.com/in/indiainnovates', href: 'https://linkedin.com' },
];

export function ContactSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock submission
    setSent(true);
  };

  return (
    <section id="contact" ref={ref} className="relative py-32 px-6">
      <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-purple-500/30 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-linear-to-r from-transparent via-cyan-500/20 to-transparent" />

      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <div className="text-[10px] font-mono text-purple-400 tracking-widest uppercase mb-4 border border-purple-500/20 px-3 py-1 rounded-full bg-purple-500/10 inline-block">
            Get In Touch
          </div>
          <h2 className="text-4xl font-black text-slate-100 mb-3">Connect With the Team</h2>
          <p className="text-slate-400 text-lg">Built for India Innovates 2026 Hackathon</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Socials */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.15 }}
            className="flex flex-col gap-4"
          >
            <h3 className="text-lg font-semibold text-slate-300 mb-2">Find us at</h3>
            {SOCIALS.map((s) => {
              const Icon = s.icon;
              return (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-4 p-4 rounded-xl border border-white/8 bg-white/3 hover:bg-white/6 hover:border-white/15 transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                    <Icon size={16} className="text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-0.5">{s.label}</div>
                    <div className="text-sm text-slate-300 group-hover:text-white transition-colors">{s.value}</div>
                  </div>
                </a>
              );
            })}
          </motion.div>

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.25 }}
          >
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 p-8 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
                <CheckCircle size={40} className="text-emerald-400" />
                <div className="text-lg font-bold text-emerald-300">Message sent!</div>
                <div className="text-sm text-slate-400 text-center">Thanks for reaching out. We&apos;ll get back to you soon.</div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <h3 className="text-lg font-semibold text-slate-300 mb-2">Send a Message</h3>
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/3 text-slate-200 placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-500/50 focus:bg-white/5 transition-all"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/3 text-slate-200 placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-500/50 focus:bg-white/5 transition-all"
                />
                <textarea
                  placeholder="Your Message"
                  rows={4}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/3 text-slate-200 placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-500/50 focus:bg-white/5 transition-all resize-none"
                />
                <button
                  type="submit"
                  className="group flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-sm hover:bg-cyan-400 transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                >
                  <Send size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  Send Message
                </button>
              </form>
            )}
          </motion.div>
        </div>

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center mt-20 text-[12px] text-slate-700"
        >
          Built with Next.js · Tailwind CSS · Framer Motion · React Flow · Recharts<br />
          India Innovates 2026 · Cabinet of Five Architecture
        </motion.div>
      </div>
    </section>
  );
}
