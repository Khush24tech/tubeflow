import React from 'react';
import { Search, PlayCircle, DownloadCloud, Settings2, Sparkles, ArrowRight } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Search & Discover',
      description: 'Type a song title, artist name, album, or paste any YouTube video link directly into the search box.',
      icon: Search,
      badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 group-hover:bg-cyan-500 group-hover:text-slate-950',
    },
    {
      step: '02',
      title: 'Choose Format',
      description: 'Select your preferred output: 320kbps high-bitrate MP3 audio, M4A, or crisp 1080p Full HD MP4 video.',
      icon: PlayCircle,
      badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      iconBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 group-hover:bg-indigo-500 group-hover:text-slate-950',
    },
    {
      step: '03',
      title: 'Download & Enjoy',
      description: 'Click download! Your file is converted in high speed and saved straight to your device with zero wait or ads.',
      icon: DownloadCloud,
      badgeColor: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
      iconBg: 'bg-violet-500/10 text-violet-400 border-violet-500/20 group-hover:bg-violet-500 group-hover:text-slate-950',
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 relative" id="how-it-works">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-10 pb-4 border-b border-[#1e2638]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141a26] border border-[#242f44] text-xs font-semibold text-cyan-400 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Simple 3-Step Process
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              How It Works
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md">
            Fast, secure, and intuitive music and video conversions directly in your browser.
          </p>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative p-6 rounded-2xl bg-[#141a26] border border-[#1e2638] hover:border-cyan-500/30 transition-all duration-300 flex flex-col justify-between group shadow-lg"
              >
                <div>
                  {/* Card Header: Icon & Step Pill */}
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <div className={`w-12 h-12 rounded-xl ${item.iconBg} border flex items-center justify-center transition-all duration-200 shadow-inner`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono border ${item.badgeColor}`}>
                      Step {item.step}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors font-display mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#1e2638]/70 flex items-center text-xs font-semibold text-slate-400 group-hover:text-cyan-400 transition-colors">
                  <span>Fast conversion pipeline</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

