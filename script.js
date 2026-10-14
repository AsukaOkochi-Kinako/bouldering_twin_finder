// すべての計算はブラウザ内で完結。fetch や保存処理は一切行わない。
(function () {
  "use strict";

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));

  const { C, POSE_KEYS, person, confetti } = window.Figures;

  document.getElementById("confetti").innerHTML =
    confetti(70, 3, [C.pink, C.yellow, C.blue, C.green, C.orange, C.red, C.teal], 5);
  document.getElementById("band-deco").innerHTML =
    confetti(36, 9, [C.white, C.yellow, C.pink], 6);

  // ヒーロー：両脇の大きな人物 + 下のパレード
  const heroPoses = ["dyno", "heel", "run", "reach", "dance", "dyno", "run", "heel", "reach"];
  document.getElementById("side-l").innerHTML = person(11, { pose: "dyno" });
  document.getElementById("side-r").innerHTML = person(24, { pose: "heel", detached: true });
  document.getElementById("parade").innerHTML = heroPoses
    .map((p, i) => person(i * 13 + 5, { pose: p, detached: i % 4 === 2 }))
    .join("");

  // ---------- マッチング ----------
  // 身長差に加え、腕の長さが入力されていれば「腕の長さ − 身長」の差も見る。
  // ボルダリングではリーチの比率が登り方に直結するので、こちらをやや重めに評価。
  // 腕の長さが不明な選手は、比べられない分だけ少し差し引く。
  const UNKNOWN_SPAN_PENALTY = 1;
  function rank(height, span, gender) {
    return CLIMBERS
      .filter((c) => gender === "any" || c.gender === gender)
      .map((c) => {
        const dh = (height - c.height) / 5;
        let d2 = dh * dh;
        if (span !== null) {
          if (c.span !== null) {
            const da = ((span - height) - (c.span - c.height)) / 3;
            d2 += da * da;
          } else {
            d2 += UNKNOWN_SPAN_PENALTY;
          }
        }
        return { c, score: Math.max(1, Math.round(100 * Math.exp(-d2 / 6))) };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }

  const signed = (n) => (n > 0 ? "+" : n < 0 ? "−" : "±") + Math.abs(Math.round(n * 10) / 10);

  // 得意な動きからポーズを決める
  function poseFor(c) {
    const t = c.tags.join(" ");
    if (/ダイナミック|コーディネーション/.test(t)) return "dyno";
    if (/柔軟性|バランス/.test(t)) return "heel";
    if (/スピード/.test(t)) return "run";
    if (/リーチ/.test(t)) return "reach";
    return POSE_KEYS[CLIMBERS.indexOf(c) % POSE_KEYS.length];
  }

  function cardHTML(r, i, you) {
    const c = r.c;
    const known = c.span !== null;
    const youKnown = you.span !== null;
    const seed = CLIMBERS.indexOf(c) * 7 + 2;
    const video = "https://www.youtube.com/results?search_query=" + encodeURIComponent(c.video);
    const barW = Math.round((r.score / 100) * 196);

    const spanStat = known
      ? `${c.span}<small>${youKnown ? `あなた ${signed(you.span - c.span)}cm` : "参考値"}</small>`
      : `<span class="stat__na">不明</span><small>公表データなし</small>`;
    const diffStat = known
      ? `${signed(c.span - c.height)}<small>${youKnown ? `あなた ${signed(you.span - you.height)}` : "参考値"}</small>`
      : `<span class="stat__na">不明</span><small>—</small>`;

    return `
<li class="card">
  <span class="card__rank">${i + 1}</span>
  <div class="card__avatar">${person(seed, { pose: poseFor(c), pad: true })}</div>
  <div class="card__body">
    <span class="card__country">${esc(c.country)}</span>
    <h3 class="card__name">${esc(c.name)}</h3>
    <p class="card__en">${esc(c.en)}</p>

    <div class="match">
      <div class="match__head"><span>そっくり度</span><span class="match__score">${r.score}%</span></div>
      <svg class="match__bar" viewBox="0 0 200 14" preserveAspectRatio="none" aria-hidden="true">
        <rect class="match__track" x="1" y="1" width="198" height="12" rx="6"/>
        <rect class="match__fill" x="2" y="2" width="${barW}" height="10" rx="5"/>
      </svg>
    </div>

    <dl class="stats">
      <div class="stat"><dt>身長</dt><dd>${c.height}<small>あなた ${signed(you.height - c.height)}cm</small></dd></div>
      <div class="stat"><dt>腕の長さ</dt><dd>${spanStat}</dd></div>
      <div class="stat"><dt>腕 − 身長</dt><dd>${diffStat}</dd></div>
    </dl>

    <ul class="tags">${c.tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
    <p class="card__feature">${esc(c.feature)}</p>

    <a class="card__video" href="${video}" target="_blank" rel="noopener noreferrer">
      <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="#fff"/><path d="M10 8 L16 12 L10 16Z" fill="${C.red}"/></svg>
      プレイ動画を見る
    </a>
  </div>
</li>`;
  }

  function reachType(diff) {
    if (diff >= 4) return "腕長め";
    if (diff <= -2) return "コンパクト";
    return "バランス型";
  }

  // ---------- SNSシェア ----------
  // シェアするのは選手名とサイトURLだけ。身長などの入力値は含めない。
  const SITE_URL = document.querySelector('link[rel="canonical"]').href;
  const MEDALS = ["🥇", "🥈", "🥉"];
  let shareText = "";

  function updateShare(ranked) {
    shareText = "わたしに似ているクライマーベスト3は…\n"
      + ranked.map((r, i) => `${MEDALS[i]} ${r.c.name}`).join("\n")
      + "\nだったよ！あなたは誰に似てる？\n#ClimbTwin #ボルダリング";
    const enc = encodeURIComponent;
    const textWithUrl = shareText + "\n" + SITE_URL;

    document.getElementById("share-text").textContent = textWithUrl;
    document.getElementById("share-x").href =
      `https://x.com/intent/post?text=${enc(shareText)}&url=${enc(SITE_URL)}`;
    document.getElementById("share-line").href =
      `https://line.me/R/share?text=${enc(textWithUrl)}`;
    document.getElementById("share-threads").href =
      `https://www.threads.net/intent/post?text=${enc(textWithUrl)}`;
    document.getElementById("share-fb").href =
      `https://www.facebook.com/sharer/sharer.php?u=${enc(SITE_URL)}`;
  }

  const copyBtn = document.getElementById("share-copy");
  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(shareText + "\n" + SITE_URL);
      copyBtn.textContent = "コピーしたよ！";
    } catch (_) {
      copyBtn.textContent = "コピーできなかった…";
    }
    setTimeout(() => { copyBtn.textContent = "文章をコピー"; }, 2000);
  });

  // スマホなどOSの共有シートが使える環境だけ表示
  const nativeBtn = document.getElementById("share-native");
  if (navigator.share) {
    nativeBtn.hidden = false;
    nativeBtn.addEventListener("click", () => {
      navigator.share({ text: shareText, url: SITE_URL }).catch(() => {});
    });
  }

  // ---------- フォーム ----------
  const form = document.getElementById("form");
  const error = document.getElementById("error");
  const results = document.getElementById("results");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const height = parseFloat(form.height.value);
    const spanRaw = form.span.value.trim();
    const span = spanRaw === "" ? null : parseFloat(spanRaw);
    const gender = form.gender.value;

    if (!(height >= 120 && height <= 220)) {
      error.textContent = "身長は 120〜220cm の範囲で入れてね。";
      form.height.focus();
      return;
    }
    if (span !== null && !(span >= 110 && span <= 240)) {
      error.textContent = "腕の長さは 110〜240cm の範囲で入れてね（わからなければ空欄でOK）。";
      form.span.focus();
      return;
    }
    error.textContent = "";

    const you = { height, span };
    document.getElementById("you").innerHTML = span === null
      ? `<span class="you__pill">身長 ${height}cm</span>
         <span class="you__pill you__pill--soft">腕の長さ未入力・身長だけで比較</span>`
      : `<span class="you__pill">身長 ${height}cm</span>
         <span class="you__pill">腕の長さ ${span}cm</span>
         <span class="you__pill">身長より ${signed(span - height)}cm（${reachType(span - height)}）</span>`;

    const ranked = rank(height, span, gender);
    document.getElementById("cards").innerHTML =
      ranked.map((r, i) => cardHTML(r, i, you)).join("");
    updateShare(ranked);

    results.hidden = false;
    results.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  document.getElementById("retry").addEventListener("click", () => {
    form.reset();
    results.hidden = true;
    window.scrollTo({ top: form.getBoundingClientRect().top + window.scrollY - 40, behavior: "smooth" });
    form.height.focus({ preventScroll: true });
  });
})();
