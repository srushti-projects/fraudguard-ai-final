import React, { useEffect, useRef } from 'react';

const CODE_SNIPPETS = [
  "Initializing Threat Matrix...",
  "Loading neural weights... [OK]",
  "Establishing secure connection payload...",
  "Running deep packet inspection against subnet 192.168.x.x...",
  "Bypassing firewall telemetry via encrypted tunnel...",
  "Analyzing behavioral biometrics for anomaly detection...",
  "Decrypting SHA-256 hash sequence...",
  ">> ERROR: Unauthorized access attempt detected from IP 104.22.x.x",
  ">> ALERT: Potential SQL Injection payload isolated.",
  "Injecting counter-measures against zero-day exploit...",
  "Model inference complete. Confidence: 99.8%",
  "Parsing security telemetry logs - correlating active endpoint sessions...",
  "Fetching API endpoint /api/v1/fraud-score...",
  "[System] Allocating dynamic memory for tensor operations...",
  "Simulating adversarial prompt injection... FAILED.",
  "[System] Jailbreak attempt mitigated. Session isolated.",
  "Executing signature matching algorithm...",
  "Connecting to global threat intelligence database...",
  "Awaiting remote server response...",
  "Compiling real-time risk profile... Score: 12 (LOW RISK)",
  "Disabling suspicious websocket connection...",
  "Tracking lateral movement across internal nodes...",
  "Verifying SSL/TLS certificates... VALID",
  "Extracting metadata from image payload...",
  "Running audio deepfake detection model...",
  "Applying temporal convolutions for video forgery detection...",
  "[Kernel] Hooking sys_call_table... SUCCESS.",
  "Extracting user session tokens... 0x8F94D2...",
  "Analyzing node graph connections... 3 anomalies found.",
  ">> Triggering localized lockdown protocol."
];

export default function BackgroundTypingEffect() {
  const containerRef1 = useRef(null);
  const containerRef2 = useRef(null);
  const containerRef3 = useRef(null);

  useEffect(() => {
    let activeTimeouts = [];

    const initTyping = (container, initialDelay) => {
      if (!container) return null;

      let charIndex = 0;
      let snippetIndex = Math.floor(Math.random() * CODE_SNIPPETS.length);
      let currentLineText = "> " + CODE_SNIPPETS[snippetIndex];
      let isTyping = true;
      
      let currentLineEl = document.createElement('div');
      currentLineEl.className = 'w-full text-left truncate';
      
      let textNode = document.createTextNode('');
      currentLineEl.appendChild(textNode);
      
      let cursorEl = document.createElement('span');
      cursorEl.className = 'inline-block w-[6px] md:w-[10px] h-[14px] md:h-[18px] bg-[#00FF9D] ml-1 animate-pulse shadow-[0_0_8px_#00FF9D] shrink-0 translate-y-[3px]';
      currentLineEl.appendChild(cursorEl);

      container.appendChild(currentLineEl);

      const typeNextChar = () => {
        if (!isTyping) return;
        
        if (charIndex < currentLineText.length) {
          textNode.nodeValue += currentLineText[charIndex];
          charIndex++;
          
          if (container.parentElement && container.parentElement.parentElement) {
            container.parentElement.parentElement.scrollTop = container.parentElement.parentElement.scrollHeight;
          }
          
          const delay = Math.random() * 25 + 10; 
          const to = setTimeout(typeNextChar, delay);
          activeTimeouts.push(to);
        } else {
          const to = setTimeout(() => {
            cursorEl.remove();
            
            currentLineEl.classList.add('opacity-70');
            
            currentLineEl = document.createElement('div');
            currentLineEl.className = 'w-full text-left break-words';
            // Randomly indent some lines for a scattered look on full width
            if (Math.random() > 0.6) {
              const indents = ['ml-4', 'ml-8', 'ml-12'];
              currentLineEl.classList.add(indents[Math.floor(Math.random() * indents.length)]);
            }
            
            textNode = document.createTextNode('');
            currentLineEl.appendChild(textNode);
            
            cursorEl = document.createElement('span');
            cursorEl.className = 'inline-block w-[6px] md:w-[10px] h-[14px] md:h-[18px] bg-[#00FF9D] ml-1 animate-pulse shadow-[0_0_8px_#00FF9D] shrink-0 translate-y-[3px]';
            currentLineEl.appendChild(cursorEl);
            
            container.appendChild(currentLineEl);
            
            if (container.children.length > 40) {
              container.removeChild(container.firstChild);
            }
            
            snippetIndex = Math.floor(Math.random() * CODE_SNIPPETS.length);
            currentLineText = "> " + CODE_SNIPPETS[snippetIndex];
            charIndex = 0;
            typeNextChar();
          }, Math.random() * 800 + 400);
          activeTimeouts.push(to);
        }
      };

      const start = setTimeout(() => {
        typeNextChar();
      }, initialDelay);
      activeTimeouts.push(start);

      return () => {
        isTyping = false;
        if (container) container.innerHTML = '';
      };
    };

    const cleanup1 = initTyping(containerRef1.current, 0);
    const cleanup2 = initTyping(containerRef2.current, 1500);
    const cleanup3 = initTyping(containerRef3.current, 3000);

    return () => {
      activeTimeouts.forEach(clearTimeout);
      if (cleanup1) cleanup1();
      if (cleanup2) cleanup2();
      if (cleanup3) cleanup3();
    };
  }, []);

  return (
    <div className="fixed inset-0 w-[100vw] h-[100vh] z-[2] pointer-events-none overflow-hidden mix-blend-screen opacity-[0.22] blur-[0.5px]">
      <div 
        className="absolute inset-0 overflow-hidden flex flex-col justify-end"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 100%)'
        }}
      >
        <div 
          className="w-full tracking-wider font-mono text-xs md:text-base text-[#00FF9D] leading-relaxed grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-16 p-6 md:p-12 pb-24 md:pb-32"
          style={{ textShadow: '0 0 10px rgba(0,255,157,0.9), 0 0 20px rgba(0,255,157,0.5)' }}
        >
          <div ref={containerRef1} className="w-full flex flex-col items-start space-y-4 md:space-y-6 overflow-hidden" />
          <div ref={containerRef2} className="hidden md:flex flex-col items-start w-full space-y-4 md:space-y-6 overflow-hidden" />
          <div ref={containerRef3} className="hidden lg:flex flex-col items-start w-full space-y-4 md:space-y-6 overflow-hidden" />
        </div>
      </div>
    </div>
  );
}
