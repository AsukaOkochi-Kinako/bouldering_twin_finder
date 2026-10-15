// ガイドページのイラストと「ガンバ！」ボタン。カウントは保存しない。
(function () {
  "use strict";
  const { C, person, confetti } = window.Figures;

  document.getElementById("confetti").innerHTML =
    confetti(60, 7, [C.pink, C.yellow, C.blue, C.green, C.orange, C.red, C.teal], 4);

  const poses = ["reach", "dyno", "heel", "run", "dance"];
  document.getElementById("hero-figs").innerHTML = poses
    .map((p, i) => person(i * 17 + 40, { pose: p, pad: true }))
    .join("");

  // ---------- ガンバ！ボタン ----------
  const stage = document.getElementById("cheer-stage");
  const countEl = document.getElementById("cheer-count");
  const WORDS = ["ガンバ！", "ナイス！", "いけるいける！", "ガンバー！"];
  let count = 0;

  stage.innerHTML = person(11, { pose: "reach", pad: true });

  document.getElementById("cheer-btn").addEventListener("click", () => {
    count += 1;
    countEl.textContent = count;

    // 応援されるたびにポーズが変わって跳ねる
    stage.innerHTML = person(11, { pose: poses[count % poses.length], pad: true });
    stage.classList.remove("is-hop");
    void stage.offsetWidth; // アニメーションを再スタート
    stage.classList.add("is-hop");

    const pop = document.createElement("span");
    pop.className = "cheer__pop";
    pop.textContent = WORDS[count % WORDS.length];
    stage.appendChild(pop);
    setTimeout(() => pop.remove(), 1000);
  });
})();
