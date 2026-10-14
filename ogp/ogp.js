(function () {
  "use strict";
  const { C, person, confetti } = window.Figures;

  document.getElementById("confetti").innerHTML =
    confetti(55, 21, [C.pink, C.yellow, C.blue, C.green, C.orange, C.red, C.teal], 3);

  document.getElementById("f1").innerHTML = person(11, { pose: "dyno", pad: true });
  document.getElementById("f2").innerHTML = person(31, { pose: "run", pad: true });
  document.getElementById("f3").innerHTML = person(24, { pose: "heel", pad: true, detached: true });
  document.getElementById("f4").innerHTML = person(57, { pose: "dance", pad: true });
})();
