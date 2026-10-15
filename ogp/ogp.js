// OGP画像のもとページ共通。人物は .fig の data 属性（seed / pose / detached）から描く。
(function () {
  "use strict";
  const { C, person, confetti } = window.Figures;
  const card = document.querySelector(".card");

  card.querySelector(".confetti").innerHTML =
    confetti(55, Number(card.dataset.confetti), [C.pink, C.yellow, C.blue, C.green, C.orange, C.red, C.teal], 3);

  card.querySelectorAll(".fig").forEach((el) => {
    el.innerHTML = person(Number(el.dataset.seed), {
      pose: el.dataset.pose,
      pad: true,
      detached: el.hasAttribute("data-detached")
    });
  });
})();
