import React from 'react';

export interface PetrolBrandInfo {
  id: string;
  name: string;
  shortName: string;
  badgeBg: string;
  badgeBorder: string;
  textColor: string;
  accentColor: string;
}

export const PETROL_BRANDS_LIST: PetrolBrandInfo[] = [
  {
    id: 'Buraq Oil',
    name: 'Buraq Oil',
    shortName: 'Buraq Oil',
    badgeBg: 'bg-red-950/40',
    badgeBorder: 'border-yellow-500/40',
    textColor: 'text-yellow-400',
    accentColor: '#E61B24'
  },
  {
    id: 'Caltex',
    name: 'Caltex',
    shortName: 'Caltex',
    badgeBg: 'bg-red-950/40',
    badgeBorder: 'border-red-500/40',
    textColor: 'text-red-400',
    accentColor: '#E31C24'
  },
  {
    id: 'FIVE',
    name: 'FIVE Petroleum Malaysia',
    shortName: 'FIVE',
    badgeBg: 'bg-purple-950/40',
    badgeBorder: 'border-pink-500/40',
    textColor: 'text-pink-400',
    accentColor: '#E5007D'
  },
  {
    id: 'BHPetrol',
    name: 'BHPetrol',
    shortName: 'BHPetrol',
    badgeBg: 'bg-orange-950/40',
    badgeBorder: 'border-orange-500/40',
    textColor: 'text-orange-400',
    accentColor: '#FF6B00'
  },
  {
    id: 'Petron',
    name: 'Petron',
    shortName: 'Petron',
    badgeBg: 'bg-blue-950/40',
    badgeBorder: 'border-blue-500/40',
    textColor: 'text-blue-400',
    accentColor: '#004B87'
  },
  {
    id: 'Petronas',
    name: 'Petronas',
    shortName: 'Petronas',
    badgeBg: 'bg-emerald-950/40',
    badgeBorder: 'border-emerald-500/40',
    textColor: 'text-emerald-400',
    accentColor: '#00A388'
  },
  {
    id: 'Shell',
    name: 'Shell',
    shortName: 'Shell',
    badgeBg: 'bg-amber-950/40',
    badgeBorder: 'border-amber-500/40',
    textColor: 'text-amber-400',
    accentColor: '#DD1D21'
  }
];

// --- BRAND SVG RENDERERS MATCHING USER ATTACHMENTS ---

// 1. BURAQ OIL (12-3.png): Yellow sun + Red winged horse profile + BURAQOIL wordmark
export const BuraqOilLogo: React.FC<{ className?: string; full?: boolean }> = ({ className = 'w-6 h-6', full = false }) => {
  if (full) {
    return (
      <svg viewBox="0 0 340 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="buraq-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.15" />
          </filter>
        </defs>
        <g transform="translate(10, 5)">
          {/* Sun circle */}
          <circle cx="50" cy="55" r="32" fill="#FFE500" />
          {/* Winged horse emblem in red */}
          <path
            d="M50 30 C58 30 65 34 68 40 C75 42 82 48 80 55 C77 56 71 52 68 53 C66 57 60 62 55 63 C51 64 47 62 45 60 C42 62 38 65 32 65 C25 65 18 61 14 56 C22 55 28 50 32 44 C22 45 15 39 12 33 C22 34 30 28 35 22 C26 23 19 18 17 12 C28 15 38 20 45 28 Z"
            fill="#E61B24"
          />
          {/* Detailed wing feather blades */}
          <path d="M17 12 C25 22 33 30 45 35 C38 25 30 18 17 12 Z" fill="#E61B24" />
          <path d="M12 33 C22 38 32 42 42 46 C35 38 25 34 12 33 Z" fill="#E61B24" />
          <path d="M14 56 C24 58 35 59 48 57 C38 52 26 51 14 56 Z" fill="#E61B24" />
          {/* Horse profile head */}
          <path
            d="M48 38 C53 36 58 36 62 38 L65 33 L67 37 C72 38 78 43 82 48 C78 50 72 49 68 47 C65 52 58 58 52 58 C46 58 44 54 42 50 C44 45 46 41 48 38 Z"
            fill="#E61B24"
          />
          {/* Mane spikes */}
          <path d="M52 32 L49 37 L54 36 L52 40 L57 39" stroke="#FFE500" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          {/* Wing base line */}
          <path d="M5 65 L95 65 L80 61 L20 61 Z" fill="#E61B24" />
        </g>
        {/* Wordmark: BURAQOIL */}
        <text
          x="110"
          y="64"
          fill="#E61B24"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="900"
          fontStyle="italic"
          fontSize="36"
          letterSpacing="0.5"
        >
          BURAQOIL
        </text>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Sun Circle */}
      <circle cx="50" cy="56" r="34" fill="#FFE500" />
      {/* Wings and horse head */}
      <path
        d="M50 30 C58 30 65 34 68 40 C75 42 83 48 80 55 C77 56 71 52 68 53 C66 57 60 62 55 63 C51 64 47 62 45 60 C42 62 38 65 32 65 C25 65 18 61 14 56 C22 55 28 50 32 44 C22 45 15 39 12 33 C22 34 30 28 35 22 C26 23 19 18 17 12 C28 15 38 20 45 28 Z"
        fill="#E61B24"
      />
      {/* Wing feathers */}
      <path d="M17 12 C25 22 33 30 45 35 C38 25 30 18 17 12 Z" fill="#E61B24" />
      <path d="M12 33 C22 38 32 42 42 46 C35 38 25 34 12 33 Z" fill="#E61B24" />
      {/* Horse profile */}
      <path
        d="M48 38 C53 36 58 36 62 38 L65 33 L67 37 C72 38 78 43 82 48 C78 50 72 49 68 47 C65 52 58 58 52 58 C46 58 44 54 42 50 C44 45 46 41 48 38 Z"
        fill="#E61B24"
      />
      {/* Mane details */}
      <path d="M52 32 L49 37 L54 36 L52 40 L57 39" stroke="#FFE500" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Base baseline */}
      <path d="M5 66 L95 66 L80 62 L20 62 Z" fill="#E61B24" />
    </svg>
  );
};

// 2. CALTEX (caltex.png): Teal & Red circular split + White star with slice + CALTEX wordmark
export const CaltexLogo: React.FC<{ className?: string; full?: boolean }> = ({ className = 'w-6 h-6', full = false }) => {
  if (full) {
    return (
      <svg viewBox="0 0 100 125" className={className} xmlns="http://www.w3.org/2000/svg">
        {/* Circle Split */}
        <g transform="translate(0, 0)">
          <clipPath id="caltex-circle-clip-full">
            <circle cx="50" cy="46" r="42" />
          </clipPath>
          <g clipPath="url(#caltex-circle-clip-full)">
            {/* Left dark teal half */}
            <rect x="0" y="0" width="50" height="92" fill="#004B57" />
            {/* Right red half */}
            <rect x="50" y="0" width="50" height="92" fill="#E31C24" />
          </g>
          {/* White Star */}
          <polygon
            points="50,14 59,38 85,38 64,54 72,78 50,63 28,78 36,54 15,38 41,38"
            fill="#FFFFFF"
          />
          {/* Dynamic delta cut slice through star */}
          <polygon points="50,14 50,63 59,38" fill="#E31C24" />
        </g>
        {/* Wordmark: CALTEX */}
        <text
          x="50"
          y="114"
          textAnchor="middle"
          fill="#004B57"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="900"
          fontSize="23"
          letterSpacing="1"
        >
          CALTEX
        </text>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <clipPath id="caltex-circle-clip">
        <circle cx="50" cy="50" r="46" />
      </clipPath>
      <g clipPath="url(#caltex-circle-clip)">
        {/* Left dark teal half */}
        <rect x="0" y="0" width="50" height="100" fill="#004B57" />
        {/* Right red half */}
        <rect x="50" y="0" width="50" height="100" fill="#E31C24" />
      </g>
      {/* White Star */}
      <polygon
        points="50,16 60,40 86,40 65,56 73,80 50,65 27,80 35,56 14,40 40,40"
        fill="#FFFFFF"
      />
      {/* Star shadow slice */}
      <polygon points="50,16 50,65 60,40" fill="#E31C24" />
    </svg>
  );
};

// 3. FIVE (five.png): Gradient circle ring with cyan '5' + Multi-colored FIVE wordmark
export const FiveLogo: React.FC<{ className?: string; full?: boolean }> = ({ className = 'w-6 h-6', full = false }) => {
  if (full) {
    return (
      <svg viewBox="0 0 280 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="five-ring-grad-full" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00B0FF" />
            <stop offset="35%" stopColor="#6C2EB9" />
            <stop offset="70%" stopColor="#E5007D" />
            <stop offset="100%" stopColor="#00B0FF" />
          </linearGradient>
        </defs>
        {/* Left ring with 5 */}
        <g transform="translate(10, 8)">
          <circle cx="42" cy="42" r="38" fill="none" stroke="url(#five-ring-grad-full)" strokeWidth="8" />
          <circle cx="42" cy="42" r="30" fill="white" />
          {/* Rounded number 5 */}
          <path
            d="M30 28 H54 V36 H38 C38 36 44 35 48 38 C53 41 54 47 52 52 C50 57 44 60 38 59 C32 58 28 54 28 49 L34 49 C34 52 36 54 39 54 C43 54 46 51 46 47 C46 43 43 41 38 41 C35 41 33 42 30 43 Z"
            fill="#00AEEF"
          />
        </g>
        {/* Wordmark: FIVE */}
        <g transform="translate(105, 68)">
          {/* F in Magenta */}
          <text x="0" y="0" fill="#E5007D" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="56">F</text>
          {/* I in Purple */}
          <text x="44" y="0" fill="#562385" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="56">I</text>
          {/* V in Dark Blue/Purple */}
          <text x="74" y="0" fill="#293380" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="56">V</text>
          {/* E in Cyan */}
          <text x="122" y="0" fill="#008AD2" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="56">E</text>
        </g>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="five-ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00B0FF" />
          <stop offset="35%" stopColor="#6C2EB9" />
          <stop offset="70%" stopColor="#E5007D" />
          <stop offset="100%" stopColor="#00B0FF" />
        </linearGradient>
      </defs>
      {/* Outer ring */}
      <circle cx="50" cy="50" r="44" fill="none" stroke="url(#five-ring-grad)" strokeWidth="10" />
      <circle cx="50" cy="50" r="36" fill="white" />
      {/* 5 in Cyan */}
      <path
        d="M36 32 H64 V41 H45 C45 41 52 40 57 43 C63 47 64 54 62 60 C59 66 52 70 45 69 C38 68 33 63 33 57 L40 57 C40 61 43 63 46 63 C51 63 55 59 55 54 C55 49 51 47 45 47 C42 47 39 48 36 50 Z"
        fill="#00AEEF"
      />
    </svg>
  );
};

// 4. BHPETROL (bhp.png): Bold Orange italic BHP + Swoosh + petrol wordmark
export const BHPetrolLogo: React.FC<{ className?: string; full?: boolean }> = ({ className = 'w-6 h-6', full = false }) => {
  return (
    <svg viewBox="0 0 240 100" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Orange swoosh curve arc */}
      <path
        d="M10 65 C10 45 25 35 45 35 C32 45 25 55 25 70 C25 82 45 88 85 88 C135 88 185 82 230 70 C215 78 175 88 120 88 C55 88 10 82 10 65 Z"
        fill="#FF6B00"
      />
      {/* BHP letters */}
      <g transform="translate(25, 68)">
        <text
          x="0"
          y="0"
          fill="#FF6B00"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="900"
          fontStyle="italic"
          fontSize="58"
          letterSpacing="-1"
        >
          BHP
        </text>
        {/* Petrol lowercase */}
        <text
          x="125"
          y="2"
          fill="#FF6B00"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="900"
          fontStyle="italic"
          fontSize="34"
          letterSpacing="0"
        >
          etrol
        </text>
        {/* Flame dot over 'i' in petrol */}
        <path
          d="M208 -26 C214 -20 216 -12 212 -8 C208 -4 202 -6 202 -12 C202 -18 206 -24 208 -26 Z"
          fill="#FF6B00"
        />
      </g>
    </svg>
  );
};

// 5. PETRON (petron-seeklogo.png): Red & Blue dynamic dual ribbons + PETRON wordmark
export const PetronLogo: React.FC<{ className?: string; full?: boolean }> = ({ className = 'w-6 h-6', full = false }) => {
  if (full) {
    return (
      <svg viewBox="0 0 100 130" className={className} xmlns="http://www.w3.org/2000/svg">
        {/* Emblem rounded box */}
        <g transform="translate(5, 5)">
          <rect x="0" y="0" width="90" height="90" rx="14" fill="#004B87" />
          {/* Red and blue waves */}
          <path
            d="M10 2 C35 2 65 15 80 40 C70 18 45 8 10 2 Z"
            fill="#E31B23"
          />
          <path
            d="M0 0 C40 0 85 20 85 55 C85 85 45 85 10 85 C35 85 65 75 65 50 C65 25 30 15 0 0 Z"
            fill="#E31B23"
          />
          {/* Inner blue wave curve */}
          <path
            d="M0 45 C20 40 45 50 45 70 C45 82 25 88 0 90 Z"
            fill="#004B87"
          />
        </g>
        {/* Wordmark: PETRON */}
        <text
          x="50"
          y="120"
          textAnchor="middle"
          fill="#004B87"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="900"
          fontSize="20"
          letterSpacing="0.5"
        >
          PETRON
        </text>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="5" width="90" height="90" rx="16" fill="#004B87" />
      {/* Red curve wave forming 'P' */}
      <path
        d="M5 5 C45 5 90 25 90 55 C90 85 50 85 15 85 C40 85 70 75 70 50 C70 25 35 18 5 5 Z"
        fill="#E31B23"
      />
      <path
        d="M5 45 C22 40 48 50 48 70 C48 82 28 88 5 90 Z"
        fill="#004B87"
      />
    </svg>
  );
};

// 6. PETRONAS (petronas-seeklogo.png): Turquoise/Teal drop & inner dot + PETRONAS wordmark
export const PetronasLogo: React.FC<{ className?: string; full?: boolean }> = ({ className = 'w-6 h-6', full = false }) => {
  if (full) {
    return (
      <svg viewBox="0 0 110 135" className={className} xmlns="http://www.w3.org/2000/svg">
        {/* Teal Drop Icon */}
        <g transform="translate(15, 5)">
          <path
            d="M40 5 L70 30 L45 60 C38 68 25 68 18 60 C10 52 10 40 18 32 Z"
            fill="#00A388"
          />
          {/* Seed outer curve */}
          <path
            d="M40 5 L68 30 L44 58 C36 66 22 66 14 58 C5 49 5 35 14 26 C20 20 28 14 40 5 Z"
            fill="#00A388"
          />
          {/* Cutout inner white */}
          <circle cx="28" cy="42" r="16" fill="#FFFFFF" />
          {/* Inner Teal Dot */}
          <circle cx="28" cy="42" r="11" fill="#00A388" />
        </g>
        {/* Wordmark: PETRONAS */}
        <text
          x="55"
          y="118"
          textAnchor="middle"
          fill="#000000"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="900"
          fontSize="17"
          letterSpacing="0.2"
        >
          PETRONAS
        </text>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(10, 8)">
        {/* Emerald/Teal Seed drop */}
        <path
          d="M48 4 L80 34 L52 68 C42 78 26 78 16 68 C5 57 5 41 16 30 C24 22 34 14 48 4 Z"
          fill="#00A388"
        />
        {/* Inner white space */}
        <circle cx="34" cy="49" r="19" fill="#FFFFFF" />
        {/* Inner solid teal circle */}
        <circle cx="34" cy="49" r="13" fill="#00A388" />
      </g>
    </svg>
  );
};

// 7. SHELL (shell-seeklogo.png): Yellow & Red scallop pecten shell
export const ShellLogo: React.FC<{ className?: string; full?: boolean }> = ({ className = 'w-6 h-6' }) => {
  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Shell Yellow Pecten with Red Ribs & Base */}
      <g transform="translate(5, 5)">
        {/* Outer Red Outline */}
        <path
          d="M45 4 C32 16 8 28 8 52 C8 72 20 80 45 80 C70 80 82 72 82 52 C82 28 58 16 45 4 Z"
          fill="#DD1D21"
        />
        {/* Yellow Body */}
        <path
          d="M45 8 C34 19 12 30 12 52 C12 68 22 76 45 76 C68 76 78 68 78 52 C78 30 56 19 45 8 Z"
          fill="#FFD100"
        />
        {/* 7 Rib lines in red */}
        <path d="M45 10 L45 76" stroke="#DD1D21" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M30 18 L36 74" stroke="#DD1D21" strokeWidth="4" strokeLinecap="round" />
        <path d="M60 18 L54 74" stroke="#DD1D21" strokeWidth="4" strokeLinecap="round" />
        <path d="M18 34 L26 70" stroke="#DD1D21" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M72 34 L64 70" stroke="#DD1D21" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M12 52 L18 64" stroke="#DD1D21" strokeWidth="3" strokeLinecap="round" />
        <path d="M78 52 L72 64" stroke="#DD1D21" strokeWidth="3" strokeLinecap="round" />
        {/* Red bottom scallop base */}
        <path
          d="M20 74 C30 82 60 82 70 74 L74 86 C58 92 32 92 16 86 Z"
          fill="#DD1D21"
        />
        <path
          d="M23 76 C32 82 58 82 67 76 L70 84 C56 89 34 89 20 84 Z"
          fill="#FFD100"
        />
      </g>
    </svg>
  );
};

// Generic / Brand Router component
export const PetrolBrandLogo: React.FC<{
  brand?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showName?: boolean;
  fullLogo?: boolean;
}> = ({ brand, size = 'sm', className = '', showName = false, fullLogo = false }) => {
  const brandKey = (brand || '').toLowerCase().trim();

  let sizeClasses = 'w-6 h-6';
  if (size === 'xs') sizeClasses = 'w-4 h-4';
  if (size === 'sm') sizeClasses = 'w-5 h-5';
  if (size === 'md') sizeClasses = 'w-8 h-8';
  if (size === 'lg') sizeClasses = 'w-10 h-10';
  if (size === 'xl') sizeClasses = 'w-14 h-14';

  const renderIcon = () => {
    // 1. BURAQ OIL
    if (brandKey.includes('buraq')) {
      return <BuraqOilLogo className={sizeClasses} full={fullLogo} />;
    }

    // 2. CALTEX
    if (brandKey.includes('caltex')) {
      return <CaltexLogo className={sizeClasses} full={fullLogo} />;
    }

    // 3. FIVE
    if (brandKey.includes('five')) {
      return <FiveLogo className={sizeClasses} full={fullLogo} />;
    }

    // 4. BHPETROL
    if (brandKey.includes('bhp')) {
      return <BHPetrolLogo className={sizeClasses} full={fullLogo} />;
    }

    // 5. PETRON (excluding Petronas)
    if (brandKey.includes('petron') && !brandKey.includes('petronas')) {
      return <PetronLogo className={sizeClasses} full={fullLogo} />;
    }

    // 6. PETRONAS
    if (brandKey.includes('petronas')) {
      return <PetronasLogo className={sizeClasses} full={fullLogo} />;
    }

    // 7. SHELL
    if (brandKey.includes('shell')) {
      return <ShellLogo className={sizeClasses} full={fullLogo} />;
    }

    // Fallback Fuel Pump
    return (
      <div className={`${sizeClasses} rounded-full bg-[#1b202c] border border-white/10 flex items-center justify-center text-emerald-400 shrink-0`}>
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="22" x2="15" y2="22"></line>
          <line x1="4" y1="9" x2="14" y2="9"></line>
          <path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18"></path>
          <path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5"></path>
        </svg>
      </div>
    );
  };

  const brandInfo = PETROL_BRANDS_LIST.find(
    b => b.id.toLowerCase() === brandKey || b.name.toLowerCase() === brandKey || b.shortName.toLowerCase() === brandKey
  );

  if (!showName) {
    return <div className={`inline-flex items-center justify-center ${className}`}>{renderIcon()}</div>;
  }

  return (
    <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-bold border ${brandInfo?.badgeBg || 'bg-[#181d28]'} ${brandInfo?.badgeBorder || 'border-white/10'} ${brandInfo?.textColor || 'text-slate-300'} ${className}`}>
      {renderIcon()}
      <span className="truncate">{brandInfo?.name || brand || 'Minyak'}</span>
    </div>
  );
};
