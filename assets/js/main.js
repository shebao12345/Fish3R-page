/* Fish3R — page interactions */
(function () {
  "use strict";

  /* ---------- Hero point-cloud particle field ---------- */
  (function particles() {
    var canvas = document.getElementById("stars");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    var W = 0, H = 0, pts = [];
    var mouse = { x: -9999, y: -9999 };

    function resize() {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
      var n = Math.min(150, Math.floor(W * H / 14000));
      pts = [];
      for (var i = 0; i < n; i++) {
        pts.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.28, vy: (Math.random() - 0.5) * 0.28,
          r: Math.random() * 1.6 + 0.5,
          tw: Math.random() * Math.PI * 2
        });
      }
    }
    window.addEventListener("resize", resize);
    canvas.parentElement.addEventListener("pointermove", function (e) {
      var rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    canvas.parentElement.addEventListener("pointerleave", function () {
      mouse.x = mouse.y = -9999;
    });
    resize();

    var LINK = 110;
    function frame(t) {
      ctx.clearRect(0, 0, W, H);
      var i, j, p;
      for (i = 0; i < pts.length; i++) {
        p = pts[i];
        // gentle drift + soft attraction toward the pointer
        var dxm = mouse.x - p.x, dym = mouse.y - p.y;
        var dm = Math.sqrt(dxm * dxm + dym * dym);
        if (dm < 180 && dm > 0.001) {
          p.vx += (dxm / dm) * 0.012;
          p.vy += (dym / dm) * 0.012;
        }
        p.vx = Math.max(-0.5, Math.min(0.5, p.vx));
        p.vy = Math.max(-0.5, Math.min(0.5, p.vy));
        p.x += p.vx; p.y += p.vy;
        if (p.x < -10) p.x = W + 10; else if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10; else if (p.y > H + 10) p.y = -10;

        var a = 0.35 + 0.3 * Math.sin(t / 900 + p.tw);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(148, 197, 255, " + a.toFixed(3) + ")";
        ctx.fill();
      }
      // constellation lines
      ctx.lineWidth = 0.6;
      for (i = 0; i < pts.length; i++) {
        for (j = i + 1; j < pts.length; j++) {
          var dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          var d2 = dx * dx + dy * dy;
          if (d2 < LINK * LINK) {
            var o = (1 - Math.sqrt(d2) / LINK) * 0.22;
            ctx.strokeStyle = "rgba(94, 234, 212, " + o.toFixed(3) + ")";
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  })();

  /* ---------- Fisheye marquee: build track, duplicate for seamless loop ---------- */
  (function marquee() {
    var track = document.getElementById("marquee-track");
    if (!track) return;
    var shots = [
      { src: "assets/images/fisheye-kitti.jpg",     label: "KITTI · driving" },
      { src: "assets/images/fisheye-mall.jpg",      label: "Ours · indoor" },
      { src: "assets/images/fisheye-scannet.jpg",   label: "ScanNet++ · indoor" },
      { src: "assets/images/fisheye-street.jpg",    label: "Ours · street" },
      { src: "assets/images/fisheye-woodspace.jpg", label: "WoodSpace · urban" }
    ];
    var html = shots.map(function (s) {
      return '<figure class="feye"><img src="' + s.src + '" alt="' + s.label + '" loading="lazy"><figcaption>' + s.label + "</figcaption></figure>";
    }).join("");
    track.innerHTML = html + html; // two copies → translateX(-50%) loops seamlessly
  })();
})();
