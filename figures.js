// イラスト生成（着ぐるみ風・ポップな人物と紙吹雪）。
// サイト本体（script.js）と OGP 画像（ogp/）の両方から使う。
(function () {
  "use strict";

  const C = {
    pink: "#ff7eb6",
    yellow: "#ffd83d",
    blue: "#74a9e0",
    cobalt: "#2f6fe0",
    green: "#2fa86b",
    teal: "#1f9c95",
    orange: "#ff8c1a",
    red: "#f2492f",
    white: "#ffffff",
    ink: "#3b2f8f",
    dark: "#2b2340",
    cream: "#fffaf0"
  };
  const CLOTH = ["pink", "yellow", "blue", "cobalt", "green", "teal", "orange", "red", "white"];
  const SKIN = ["#ffd9c2", "#f6c39c", "#e0a07a", "#b9764d", "#8a5132", "#5e3522", "#ffb3cf", "#ffe266"];
  const HAIR = ["#2b2340", "#5e3522", "#f2492f", "#ffd83d", "#74a9e0", "#2fa86b", "#ffffff", "#ff7eb6"];
  const HAIRSTYLES = ["short", "bob", "bun", "pony", "beanie", "cap", "bear"];
  const PATTERNS = ["solid", "stripe", "dots", "zigzag", "check"];

  // 再現性のある乱数（同じ選手は毎回同じ見た目になる）
  function rng(seed) {
    let a = (seed + 1) * 2654435761 >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // ---------- ポーズ（関節座標：viewBox 140x160） ----------
  // a = [肘, 手]  l = [膝, 足]
  const POSES = {
    reach: { la: [[44, 34], [38, 10]],  ra: [[98, 46], [112, 32]], ll: [[56, 124], [50, 148]],  rl: [[90, 118], [102, 140]] },
    dyno:  { la: [[40, 30], [30, 6]],   ra: [[100, 30], [110, 6]], ll: [[44, 110], [30, 128]],  rl: [[96, 110], [112, 126]] },
    run:   { la: [[40, 72], [20, 60]],  ra: [[100, 70], [120, 56]], ll: [[46, 116], [22, 126]], rl: [[94, 122], [102, 150]] },
    heel:  { la: [[42, 36], [34, 12]],  ra: [[96, 70], [114, 82]], ll: [[60, 126], [54, 152]],  rl: [[108, 84], [128, 60]] },
    dance: { la: [[40, 66], [20, 78]],  ra: [[96, 34], [108, 10]], ll: [[52, 122], [36, 146]],  rl: [[90, 124], [108, 146]] }
  };
  const POSE_KEYS = Object.keys(POSES);

  function patternDef(id, type, base, accent, vertical) {
    const bg = `<rect width="10" height="10" fill="${base}"/>`;
    let body = "";
    if (type === "stripe") body = vertical
      ? `<rect width="3.5" height="10" fill="${accent}"/>`
      : `<rect width="10" height="3.5" fill="${accent}"/>`;
    if (type === "dots") body = `<circle cx="5" cy="5" r="2.2" fill="${accent}"/>`;
    if (type === "zigzag") body = `<path d="M0 6 l2.5 -3 l2.5 3 l2.5 -3 l2.5 3" fill="none" stroke="${accent}" stroke-width="1.6"/>`;
    if (type === "check") body = `<rect width="5" height="5" fill="${accent}" opacity=".75"/><rect x="5" y="5" width="5" height="5" fill="${accent}" opacity=".75"/>`;
    return `<pattern id="${id}" width="10" height="10" patternUnits="userSpaceOnUse">${bg}${body}</pattern>`;
  }

  function shoe(foot, knee, color, sole) {
    const ang = Math.atan2(foot[1] - knee[1], foot[0] - knee[0]) * 180 / Math.PI - 90;
    const flip = foot[0] < 70 ? -1 : 1;
    return `<g transform="translate(${foot[0]} ${foot[1]}) rotate(${ang.toFixed(1)}) scale(${flip} 1)">
      <rect x="-9" y="-6" width="24" height="14" rx="7" fill="${color}"/>
      <rect x="-9" y="4" width="24" height="5" rx="2.5" fill="${sole}"/>
    </g>`;
  }

  function hairSVG(style, hair, accent, back) {
    // back=true: 頭の後ろに描くパーツ
    if (back) {
      if (style === "bob") return `<circle cx="70" cy="32" r="19" fill="${hair}"/><rect x="51" y="30" width="38" height="16" rx="6" fill="${hair}"/>`;
      if (style === "pony") return `<path d="M82 24 q24 -6 26 16" fill="none" stroke="${hair}" stroke-width="7" stroke-linecap="round"/>`;
      if (style === "bun") return `<circle cx="70" cy="14" r="8" fill="${hair}"/>`;
      return "";
    }
    const top = `<path d="M55 30 a15 15 0 0 1 30 0 q-7 -5 -15 -3 q-8 -2 -15 3z" fill="${hair}"/>`;
    if (style === "beanie" || style === "bear") {
      const ears = style === "bear"
        ? `<circle cx="57" cy="18" r="6" fill="${accent}"/><circle cx="83" cy="18" r="6" fill="${accent}"/>`
        : `<circle cx="70" cy="13" r="5" fill="${C.white}"/>`;
      return `${ears}<path d="M54 30 a16 16 0 0 1 32 0z" fill="${accent}"/><rect x="53" y="26" width="34" height="7" rx="3.5" fill="${accent}" stroke="${C.dark}" stroke-opacity=".15"/>`;
    }
    if (style === "cap") {
      return `<path d="M55 29 a15 15 0 0 1 30 0z" fill="${accent}"/><rect x="78" y="25" width="18" height="5" rx="2.5" fill="${accent}"/>`;
    }
    return top;
  }

  let uid = 0;
  // 人のイラストを生成
  // opts: { pose, detached, pad }
  function person(seed, opts) {
    const o = opts || {};
    const r = rng(seed);
    const pick = (arr) => arr[Math.floor(r() * arr.length)];
    const id = "f" + (uid++);
    const pose = POSES[o.pose] || POSES[POSE_KEYS[seed % POSE_KEYS.length]];

    const skin = pick(SKIN);
    const hair = pick(HAIR);
    const style = pick(HAIRSTYLES);
    const shirtC = C[pick(CLOTH)];
    let pantsC = C[pick(CLOTH)];
    if (pantsC === shirtC) pantsC = C.cobalt;
    const accentC = C[pick(CLOTH.filter((k) => C[k] !== shirtC))];
    const shoeC = C[pick(["pink", "yellow", "red", "cobalt", "white", "green"])];
    const hatC = C[pick(["yellow", "red", "pink", "teal", "cobalt"])];
    const shirtP = pick(PATTERNS);
    const pantsP = pick(["solid", "solid", "stripe", "dots"]);

    const defs = patternDef(id + "s", shirtP, shirtC, shirtC === C.white ? C.red : C.white, false)
               + patternDef(id + "p", pantsP, pantsC, C.white, true);
    const shirt = `url(#${id}s)`;
    const pants = `url(#${id}p)`;

    const sh = { l: [58, 54], r: [82, 54] };
    const hp = { l: [62, 96], r: [78, 96] };
    const line = (pts, color, w) =>
      `<polyline points="${pts.map((p) => p.join(",")).join(" ")}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
    const mid = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

    let legs = "", arms = "";
    ["l", "r"].forEach((s) => {
      const [knee, foot] = pose[s + "l"];
      const [elbow, hand] = pose[s + "a"];
      if (o.detached) {
        // 4枚目の参考：手足がちぎれて浮いているような表現
        legs += line([hp[s], mid(hp[s], knee, .9)], pants, 17);
        legs += line([mid(knee, foot, .45), mid(knee, foot, .8)], accentC, 12);
        arms += line([sh[s], mid(sh[s], elbow, .85)], shirt, 14);
        arms += `<circle cx="${hand[0]}" cy="${hand[1]}" r="8" fill="${skin}"/>`;
      } else {
        legs += line([hp[s], knee, foot], pants, 17);
        arms += line([sh[s], elbow, mid(elbow, hand, .7)], shirt, 14);
        arms += line([mid(elbow, hand, .6), hand], skin, 11);
        arms += `<circle cx="${hand[0]}" cy="${hand[1]}" r="7.5" fill="${skin}"/>`;
      }
      legs += shoe(foot, knee, shoeC, C.dark);
    });

    const cheek = r() > .5
      ? `<circle cx="61" cy="38" r="3" fill="${C.pink}" opacity=".7"/><circle cx="79" cy="38" r="3" fill="${C.pink}" opacity=".7"/>` : "";
    const smile = r() > .4
      ? `<path d="M65 40 q5 5 10 0" fill="none" stroke="${C.dark}" stroke-width="2" stroke-linecap="round"/>`
      : `<ellipse cx="70" cy="41" rx="3" ry="3.5" fill="${C.dark}"/>`;

    return `
<svg viewBox="${o.pad ? "-12 -10 164 184" : "0 0 140 160"}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>${defs}</defs>
  ${legs}
  <rect x="52" y="48" width="36" height="54" rx="14" fill="${shirt}"/>
  <rect x="60" y="94" width="20" height="10" rx="4" fill="${pantsC}"/>
  ${arms}
  <rect x="65" y="42" width="10" height="10" rx="3" fill="${skin}"/>
  ${hairSVG(style, hair, hatC, true)}
  <circle cx="70" cy="32" r="15" fill="${skin}"/>
  ${hairSVG(style, hair, hatC, false)}
  <circle cx="64" cy="33" r="2.2" fill="${C.dark}"/>
  <circle cx="76" cy="33" r="2.2" fill="${C.dark}"/>
  ${cheek}${smile}
</svg>`;
  }

  // ---------- 紙吹雪とホールド ----------
  function confetti(count, seed, colors, holds) {
    const r = rng(seed);
    let out = "";
    for (let i = 0; i < count; i++) {
      const x = r() * 1000, y = r() * 1000;
      const ang = r() * 360;
      const col = colors[Math.floor(r() * colors.length)];
      const len = 14 + r() * 14;
      out += `<path class="bit" d="M${x.toFixed(0)} ${y.toFixed(0)} q${(len / 2).toFixed(0)} -10 ${len.toFixed(0)} 0" transform="rotate(${ang.toFixed(0)} ${x.toFixed(0)} ${y.toFixed(0)})" fill="none" stroke="${col}" stroke-width="5" stroke-linecap="round"/>`;
    }
    const shapes = [
      "M8 30 C2 12 22 2 38 6 C56 10 62 26 54 40 C46 52 16 50 8 30Z",
      "M4 26 C6 8 30 0 46 10 C62 20 58 44 38 48 C18 52 2 42 4 26Z"
    ];
    for (let i = 0; i < holds; i++) {
      const x = r() * 940, y = r() * 940;
      const col = colors[Math.floor(r() * colors.length)];
      out += `<g class="hold-bit" transform="translate(${x.toFixed(0)} ${y.toFixed(0)}) rotate(${(r() * 60 - 30).toFixed(0)} 30 26)">
        <path d="${shapes[i % 2]}" fill="${col}"/><circle cx="30" cy="26" r="5" fill="${C.cream}" opacity=".9"/></g>`;
    }
    return `<svg viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">${out}</svg>`;
  }

  window.Figures = { C, POSE_KEYS, person, confetti };
})();
