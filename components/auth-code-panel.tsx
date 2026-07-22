export function AuthCodePanel() {
  return (
    <div className="hidden lg:flex w-1/2 bg-[#111110] relative overflow-hidden items-center justify-center border-l border-white/5">
      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle, #d4af37 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Gold glow — bottom left */}
      <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      {/* Gold glow — top right */}
      <div className="absolute -top-20 -right-20 w-56 h-56 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      {/* Editor card */}
      <div className="relative z-10 w-full max-w-sm px-10">
        <div className="rounded-xl overflow-hidden border border-white/10 shadow-2xl shadow-black/60">
          {/* Title bar */}
          <div className="flex items-center gap-3 px-4 py-2.5 bg-[#1c1c1a] border-b border-white/8">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
            </div>
            <span className="flex-1 text-center text-[11px] text-white/25 font-mono tracking-wide">
              integration.js
            </span>
          </div>

          {/* Code body */}
          <div className="bg-[#18181a] px-5 py-5 font-mono text-[13px] leading-[1.75]">
            {/* Line 1 */}
            <div className="flex gap-4">
              <span className="select-none text-white/15 w-4 text-right shrink-0">1</span>
              <p>
                <span className="text-[#c792ea]">import</span>
                <span className="text-white/80"> ReboLabs </span>
                <span className="text-[#c792ea]">from</span>
                <span className="text-[#ce9178]"> &apos;@rebolabs/sdk&apos;</span>
              </p>
            </div>
            {/* Line 2 blank */}
            <div className="flex gap-4">
              <span className="select-none text-white/15 w-4 text-right shrink-0">2</span>
              <p>&nbsp;</p>
            </div>
            {/* Line 3 */}
            <div className="flex gap-4">
              <span className="select-none text-white/15 w-4 text-right shrink-0">3</span>
              <p>
                <span className="text-[#569cd6]">const</span>
                <span className="text-white/80"> client </span>
                <span className="text-white/40">=</span>
                <span className="text-[#dcdcaa]"> new </span>
                <span className="text-white/80">ReboLabs</span>
                <span className="text-white/40">(&#123;</span>
              </p>
            </div>
            {/* Line 4 */}
            <div className="flex gap-4">
              <span className="select-none text-white/15 w-4 text-right shrink-0">4</span>
              <p>
                <span className="text-white/40 pl-4">&nbsp;&nbsp;</span>
                <span className="text-[#9cdcfe]">apiKey</span>
                <span className="text-white/40">: </span>
                <span className="text-[#ce9178]">&apos;rl_your_api_key&apos;</span>
                <span className="text-white/40">,</span>
              </p>
            </div>
            {/* Line 5 */}
            <div className="flex gap-4">
              <span className="select-none text-white/15 w-4 text-right shrink-0">5</span>
              <p>
                <span className="pl-4">&nbsp;&nbsp;</span>
                <span className="text-[#9cdcfe]">userId</span>
                <span className="text-white/40">: </span>
                <span className="text-[#f78c6c]">user</span>
                <span className="text-white/40">.</span>
                <span className="text-[#9cdcfe]">id</span>
              </p>
            </div>
            {/* Line 6 */}
            <div className="flex gap-4">
              <span className="select-none text-white/15 w-4 text-right shrink-0">6</span>
              <p><span className="text-white/40">&#125;)</span></p>
            </div>
            {/* Line 7 blank */}
            <div className="flex gap-4">
              <span className="select-none text-white/15 w-4 text-right shrink-0">7</span>
              <p>&nbsp;</p>
            </div>
            {/* Line 8 comment */}
            <div className="flex gap-4">
              <span className="select-none text-white/15 w-4 text-right shrink-0">8</span>
              <p><span className="text-[#6a9955]">// Launch reward offerwall</span></p>
            </div>
            {/* Line 9 */}
            <div className="flex gap-4">
              <span className="select-none text-white/15 w-4 text-right shrink-0">9</span>
              <p>
                <span className="text-[#f78c6c]">client</span>
                <span className="text-white/40">.</span>
                <span className="text-[#dcdcaa]">openRewardWall</span>
                <span className="text-white/40">(&#123;</span>
              </p>
            </div>
            {/* Line 10 */}
            <div className="flex gap-4">
              <span className="select-none text-white/15 w-4 text-right shrink-0">10</span>
              <p>
                <span className="pl-4">&nbsp;&nbsp;</span>
                <span className="text-[#9cdcfe]">onComplete</span>
                <span className="text-white/40">: (</span>
                <span className="text-[#f78c6c]">reward</span>
                <span className="text-white/40">) </span>
                <span className="text-[#c792ea]">=&gt;</span>
                <span className="text-white/40"> &#123;</span>
              </p>
            </div>
            {/* Line 11 */}
            <div className="flex gap-4">
              <span className="select-none text-white/15 w-4 text-right shrink-0">11</span>
              <p>
                <span className="pl-8">&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span className="text-[#dcdcaa]">updateBalance</span>
                <span className="text-white/40">(</span>
                <span className="text-[#f78c6c]">reward</span>
                <span className="text-white/40">.</span>
                <span className="text-[#9cdcfe]">amount</span>
                <span className="text-white/40">)</span>
              </p>
            </div>
            {/* Line 12 */}
            <div className="flex gap-4">
              <span className="select-none text-white/15 w-4 text-right shrink-0">12</span>
              <p><span className="pl-4 text-white/40">&nbsp;&nbsp;&#125;</span></p>
            </div>
            {/* Line 13 */}
            <div className="flex gap-4">
              <span className="select-none text-white/15 w-4 text-right shrink-0">13</span>
              <p><span className="text-white/40">&#125;)</span></p>
            </div>
          </div>

          {/* Status bar */}
          <div className="flex items-center gap-2.5 px-4 py-2 bg-[#1c1c1a] border-t border-white/8">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
            </span>
            <p className="text-[11px] text-white/30 font-mono">
              Reward offerwall loaded in{' '}
              <span className="text-green-400">127ms</span>
            </p>
          </div>
        </div>

        {/* Reward badge below editor */}
        <div className="mt-3 flex items-center gap-3 bg-white/4 border border-white/8 rounded-lg px-4 py-2.5">
          <div className="p-1.5 bg-primary/15 rounded-md">
            <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] text-white/30 font-mono leading-none mb-0.5">postback verified</p>
            <p className="text-sm font-semibold text-white/80 leading-none font-mono">200 OK</p>
          </div>
        </div>
      </div>
    </div>
  )
}
