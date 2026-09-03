import React from 'react';
import { Rocket, ShieldCheck, Infinity, Smartphone, Headphones, Globe, Sparkles } from 'lucide-react';

export const FeatureHighlights: React.FC = () => {
  const features = [
    {
      title: 'Super Fast',
      desc: 'Instant search, quick streaming preview, and high-speed conversions.',
      icon: Rocket,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20'
    },
    {
      title: 'Safe & Secure',
      desc: 'No account registration, no malware, no tracking, and 100% virus free.',
      icon: ShieldCheck,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20'
    },
    {
      title: 'Unlimited Downloads',
      desc: 'Download as many songs, audio tracks, and HD videos as you want with zero limits.',
      icon: Infinity,
      color: 'text-violet-400',
      bg: 'bg-violet-500/10',
      border: 'border-violet-500/20'
    },
    {
      title: 'Multi-Device Support',
      desc: 'Flawless experience across smartphones, tablets, iPhones, laptops, and PCs.',
      icon: Smartphone,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20'
    },
    {
      title: '320kbps High Fidelity',
      desc: 'Crystal-clear audio extraction with rich bass and full stereo separation.',
      icon: Headphones,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20'
    },
    {
      title: 'Built with Modern Web',
      desc: 'Engineered with React, Next-gen server streaming, and SEO-optimized architecture.',
      icon: Globe,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20'
    },
  ];

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 border-t border-[#1e2638]" id="features">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141a26] border border-[#242f44] text-xs font-semibold text-cyan-400 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Why Choose Tubeflow
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Built for Music Lovers Everywhere
          </h2>
          <p className="text-sm text-slate-400 mt-2 max-w-xl mx-auto">
            Everything you need to discover, stream, and save high-resolution media in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="p-5 rounded-2xl bg-[#141a26] border border-[#1e2638] hover:border-[#2b374e] transition-all flex items-start gap-4"
              >
                <div className={`p-3 rounded-xl ${f.bg} border ${f.border} shrink-0`}>
                  <Icon className={`w-6 h-6 ${f.color}`} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base mb-1 font-display">{f.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
