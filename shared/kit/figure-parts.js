// Kit figures, part 2: torso, coat tails, head and hair. Called by Kit.art.person in figures.js; nothing else needs these.
(function () {
  const A = Kit.art, sin = Math.sin, cos = Math.cos;

  // Hair that sits behind the body.
  A._behind = function (P) {
    const { c, look, lw, hdx, hdy, t } = P, hair = look.hair;
    if (!hair) return;
    const sway = sin(t * 7) * 1.4;
    if (hair.style === 'ponytail') {
      A.limb(c, hdx - 5, hdy - 7, hdx - 9.5 + sway, hdy + 3, 3.2, 3, hair.color, lw);
      A.limb(c, hdx - 9.5 + sway, hdy + 3, hdx - 10.5 + sway * 2, hdy + 20, 3, 0.9, hair.color, lw);
    } else if (hair.style === 'lowtie') {
      A.limb(c, hdx - 4.5, hdy + 4, hdx - 8 + sway, hdy + 22, 2.8, 1.2, hair.color, lw);
    } else if (hair.style === 'wavy') {
      A.poly(c, [[hdx - 4, hdy - 8], [hdx + 1, hdy - 3], [hdx - 2, hdy + 12], [hdx - 7 + sway, hdy + 22], [hdx - 13 + sway, hdy + 16], [hdx - 11, hdy]], hair.color, lw);
    } else if (hair.style === 'rags') {
      A.poly(c, [[hdx - 5, hdy - 5], [hdx - 1, hdy + 3], [hdx - 7, hdy + 12], [hdx - 10, hdy + 6]], hair.color, lw);
    }
  };

  // Coats and skirts: a panel from the hips down, between the legs and flapping behind. A tied jacket hangs here too.
  A._tail = function (P) {
    const { c, look, lw, hx, hy, near, far, t } = P, tail = look.tail;
    if (look.waistJacket) jacketBack(P);
    if (!tail) return;
    const u = tail.len / 25;
    const kn = [hx + (near.k[0] - hx) * u, hy + (near.k[1] - hy) * u], kf = [hx + (far.k[0] - hx) * u, hy + (far.k[1] - hy) * u];
    const fl = sin(t * 11) * 1.6;
    const front = Math.max(kn[0], kf[0], hx + 4) + 1.5, back = Math.min(kn[0], kf[0], hx - 4) - 3 + fl;
    const bottom = Math.max(kn[1], kf[1]) + 1;
    const pts = [[hx - 6.5, hy - 3], [hx + 6.5, hy - 3], [front, bottom]];
    if (tail.rag) { // a torn hem: uneven points all the way along
      const n = 9;
      for (let i = 1; i < n; i++) { const m = i / n; pts.push([front + (back - front) * m, bottom + (i % 2 ? -5.5 - (i % 3) * 1.4 : 1.8 + (i % 4))]); }
    }
    pts.push([back, bottom + 1]);
    A.poly(c, pts, tail.color, lw);
    A.poly(c, [[hx - 6.5, hy - 3], [hx - 1, hy - 3], [(front + back) / 2 - 1, bottom - (tail.rag ? 3 : 0)], [back, bottom - (tail.rag ? 1 : -1)]], A.shade(tail.color), 0);
    const fold = A.crease(tail.color), mid = (front + back) / 2;
    A.line(c, hx + 2, hy + 2, mid + 3, bottom - 7, lw * 0.5, fold);
    A.line(c, hx - 3, hy + 3, mid - 4, bottom - 9, lw * 0.5, fold);
  };

  // A closed coat also hangs in front of the near leg (trooper, Vasch, Silt): tail.closed.
  A._coatFront = function (P) {
    const { c, look, lw, hx, hy, near, t } = P, tail = look.tail;
    if (!tail || !tail.closed) return;
    const u = tail.len / 25, kx = hx + (near.k[0] - hx) * u, ky = hy + (near.k[1] - hy) * u, fl = sin(t * 11) * 1;
    const front = Math.max(kx + 6, hx + 6), back = Math.min(kx - 6, hx - 6) + fl, bottom = ky + 1, pts = [[hx - 7, hy - 4], [hx + 7, hy - 4], [front, bottom]];
    if (tail.rag) for (let i = 1; i < 5; i++) { const m = i / 5; pts.push([front + (back - front) * m, bottom + (i % 2 ? -5 : 1.5)]); }
    pts.push([back, bottom]);
    A.poly(c, pts, tail.color, lw);
    A.line(c, hx + 2, hy + 1, (front + back) / 2 + 1.5, bottom - 6, lw * 0.5, A.crease(tail.color));
    A.line(c, hx - 2.5, hy + 2, (front + back) / 2 - 2.5, bottom - 8, lw * 0.5, A.crease(tail.color));
  };

  // Kaito's red jacket, tied by the sleeves (kaito-sheet-v8.png). The back of it hangs to mid-thigh behind the near leg.
  function jacketBack(P) {
    const { c, look, lw, hx, hy, t, lean } = P, b = look.build, col = look.waistJacket, fl = sin(t * 11) * 1.5;
    c.save(); c.translate(hx, hy); c.rotate(lean * 0.4);
    A.blob(c, [[-b.hip - 0.5, -6], [b.hip + 0.5, -6], [b.hip + 1.5, 8], [2, 25 + fl * 0.4, 1], [-2, 21], [-6, 27 + fl, 1], [-b.hip - 7 + fl, 21, 1], [-b.hip - 3, 6]], A.shade(col, 0.8), lw);
    A.line(c, -2, 2, -5, 22, lw * 0.55, A.shade(col, 0.5));
    A.line(c, -b.hip, 4, -b.hip - 3 + fl, 18, lw * 0.55, A.shade(col, 0.5));
    c.restore();
  }
  // The front of it: the bunched cloth round the hips, the knot, and a sleeve end hanging down.
  function jacketFront(c, P, b, lw) {
    const col = P.look.waistJacket, fl = sin(P.t * 11) * 1.2, dark = A.shade(col, 0.7), fold = A.shade(col, 0.5);
    c.save(); c.rotate(-P.lean * 0.6);
    A.blob(c, [[-b.hip - 1, -7.5], [b.hip + 1.2, -7.5], [b.hip + 2.2, -2], [b.hip - 1, 11, 1], [-1, 8], [-5, 15 + fl, 1], [-b.hip - 4 + fl, 11, 1], [-b.hip - 2.2, 1]], col, lw);
    A.blob(c, [[-b.hip - 1.6, 3], [-2, 4], [-1.4, 7.6], [-5, 14 + fl, 1], [-b.hip - 3.4 + fl, 10.4, 1]], dark, 0);
    A.line(c, -b.hip, -3, b.hip * 0.8, -1.5, lw * 0.5, fold);
    A.line(c, -3, -4.5, 1, 6, lw * 0.5, fold);
    A.line(c, b.hip * 0.4, -5, b.hip - 1, 6, lw * 0.5, fold);
    // Knot at the front, a sleeve hanging from it with a cuff at the end
    A.blob(c, [[b.hip - 1, -3.4], [b.hip + 3.6 + fl, 12, 1], [b.hip + 0.2 + fl, 13.4, 1], [b.hip - 3.8, -1]], A.shade(col, 0.88), lw);
    A.poly(c, [[b.hip + 3.6 + fl, 10.4], [b.hip + 4.2 + fl, 13], [b.hip - 0.2 + fl, 14.6], [b.hip - 0.8 + fl, 11.8]], dark, lw * 0.8);
    A.ellipse(c, b.hip - 0.6, -4.2, 3.2, 2.5, col, lw);
    c.restore();
  }

  function torsoPath(c, b) {
    c.beginPath();
    c.moveTo(-b.hip, 2); c.lineTo(b.hip, 2);
    c.quadraticCurveTo(b.hip + 0.2, -6, b.waist, -13);                   // belly
    c.quadraticCurveTo(b.chest + 0.6, -19, b.chest, -25);                // chest
    c.quadraticCurveTo(b.chest - 0.4, -30, b.shoulder * 0.72, -32);
    c.lineTo(-b.shoulder * 0.8, -32.5);
    c.quadraticCurveTo(-b.chest - 0.6, -27, -b.chest * 0.92, -22);       // back
    c.quadraticCurveTo(-b.waist - 0.4, -15, -b.waist, -11);
    c.quadraticCurveTo(-b.hip - 0.4, -5, -b.hip, 2);
    c.closePath();
  }

  A._torso = function (P) {
    const { c, look, lw, lean, hx, hy, cx, cy, hdx, hdy } = P, b = look.build;
    // Neck first, so the collar sits over it.
    A.limb(c, cx + sin(lean), cy + 1, hdx - 0.5, hdy + 3, 2.9 * (b.neck || 1), 2.6 * (b.neck || 1), look.skin, lw, true);
    c.save();
    c.translate(hx, hy); c.rotate(lean);
    torsoPath(c, b);
    c.save(); c.clip();
    c.fillStyle = look.skin; c.fillRect(-30, -40, 60, 50);
    if (look.topTo !== undefined) { c.fillStyle = look.top; c.fillRect(-30, -40, 60, 40 + look.topTo); }
    if (look.jacket) { // an open jacket or coat: a panel on the back half and a sliver at the front edge
      c.fillStyle = look.jacket.color;
      const to = 40 + (look.jacket.to || 0);
      c.fillRect(-30, -40, 30 + (look.jacket.gap || 0), to);
      c.fillRect(b.chest - 1.5, -40, 8, to);
    }
    c.fillStyle = look.pants || look.thigh; c.fillRect(-30, look.hipsFrom === undefined ? -5 : look.hipsFrom, 60, 12);
    if (look.belt) { c.fillStyle = look.belt; c.fillRect(-30, look.beltAt === undefined ? -6 : look.beltAt, 60, 2.4); }
    if (look.bib) { c.fillStyle = look.bib; c.fillRect(-b.waist, -19, b.waist * 2 + 2, 14); }
    if (look.strap) { c.strokeStyle = look.strap; c.lineWidth = 3; c.beginPath(); c.moveTo(4, -32); c.lineTo(1, -17); c.stroke(); }
    if (look.bar) { // the Sever badge: a straight line cutting a circle (front only)
      const yb = look.barAt || -22;
      c.strokeStyle = look.ring || A.PAPER; c.lineWidth = 1.2; c.beginPath(); c.arc(b.chest * 0.5, yb + 1.2, 2.6, 0, Math.PI * 2); c.stroke();
      c.fillStyle = A.INK; c.fillRect(-1, yb, 30, 2.4);
    }
    if (look.zip) { // half unzipped: bare chest in a V down to the zip
      A.poly(c, [[b.chest * 0.2, -34], [b.chest + 3, -34], [b.chest + 3, -27], [b.chest * 0.66, -19]], look.skin, lw * 0.6);
      A.line(c, b.chest * 0.66, -19, b.chest * 0.74, -7, 0.7, look.zip);
    }
    if (look.topTo !== undefined && look.topTo > -10) { // cloth pulls and creases
      const fold = A.crease(look.top), thin = lw * 0.5;
      A.line(c, b.chest * 0.75, -23, b.chest * 0.05, -20, thin, fold);
      A.line(c, b.waist * 0.8, -15, -b.waist * 0.2, -10.5, thin, fold);
      A.line(c, -b.waist * 0.9, -18, -b.waist * 0.1, -14, thin, fold);
    }
    c.fillStyle = 'rgba(12,14,40,.26)'; c.fillRect(-30, -40, 30 - b.waist * 0.25, 50);  // the shadow tone
    if (look.markAt === 'chest') A.circle(c, b.chest * 0.42, look.markY || -24, 1.5 + P.glow * 1.3, look.markColor, 0);
    c.restore();
    torsoPath(c, b);
    c.lineWidth = lw; c.strokeStyle = A.INK; c.lineJoin = 'round'; c.stroke();
    if (look.collarTall) A.poly(c, [[-4.2, -37], [1.2, -36], [3.2, -31.5], [-5, -31]], look.collarTall, lw);
    else if (look.collar) A.poly(c, [[-5, -33], [5.5, -33], [4, -29], [-4, -29]], look.collar, lw);
    if (look.sash) A.poly(c, [[-b.waist - 0.5, -10], [b.waist + 0.5, -10], [b.hip, -4], [-b.hip, -4]], look.sash, lw);
    if (look.waistJacket) jacketFront(c, P, b, lw);
    c.restore();
  };

  function hairCap(c, hair, lw) {
    const col = hair.color;
    switch (hair.style) {
      case 'shaggy': // big, messy, spiked hair (Kaito), with one long white lock hanging beside his face
        A.poly(c, [[6.6, -3.4], [7.8, -6], [5.8, -6.8], [6.8, -9.8], [3.4, -8.9], [2.8, -12.6], [-0.2, -9.8], [-2.6, -13.2], [-3.8, -9.6], [-7.4, -11.4], [-6.8, -7.6], [-10.2, -6.8], [-7.8, -4], [-10.4, -1.6], [-7.2, -0.8], [-8.8, 3.2], [-5.4, 1.2], [-5.2, 4.8], [-3, 1.2], [-2.6, -1.2], [-0.6, -3], [1.6, -3.6], [2.2, -2], [3.4, -4], [4.6, -2.6], [5.2, -4.2]], col, lw);
        A.line(c, -1, -8.6, -5.4, -4.4, 0.45, '#3b4052'); A.line(c, 1.4, -8, -2.2, -4, 0.45, '#3b4052'); A.line(c, -4.4, -2.6, -6.6, 0.6, 0.45, '#3b4052');
        if (hair.streak) A.poly(c, [[5.4, -9], [1.6, -9.6], [-0.4, -4.4], [-1.5, 1], [-0.4, 7.6], [0.6, 4.6], [1.7, 5.4], [2.6, -1.6], [3.6, -4.8]], hair.streak, lw * 0.7);
        break;
      case 'messy': // black hair showing above and behind a mask (Silt)
        A.poly(c, [[2.4, -8.6], [1.6, -12], [-1, -9.8], [-3, -13], [-4.4, -9.8], [-7.6, -11], [-6.8, -7.4], [-10, -6], [-7.6, -3.4], [-9.6, -0.8], [-6.8, 0.2], [-8, 4], [-5, 2.2], [-4.2, 6], [-2, 2.6], [-0.4, -8]], col, lw);
        A.line(c, -3, -8.4, -6, -4, 0.45, '#3b4052'); A.line(c, -5, -1, -6.4, 1.6, 0.45, '#3b4052');
        break;
      case 'ponytail':
        A.poly(c, [[6.4, -3], [6.4, -7.2], [2, -9.2], [-4, -8.8], [-7.2, -4], [-6.2, 1], [-3.6, -2.2], [1, -4.5], [4, -4.6]], col, lw);
        break;
      case 'braid':
        A.poly(c, [[6.4, -3], [6.4, -7.2], [2, -9.4], [-4, -8.8], [-7.2, -4], [-6, 2], [-3.4, -2], [1, -4.6], [4, -4.4]], col, lw);
        for (let i = 0; i < 4; i++) A.ellipse(c, 1 - i * 0.2, 7.5 + i * 3.4, 2.2 - i * 0.2, 2.1, i === 3 ? A.shade(col) : col, lw);
        break;
      case 'lowtie':
        A.poly(c, [[6.2, -3], [6.4, -7], [2, -9.2], [-4.4, -8.6], [-7.2, -3.5], [-6.6, 3.6], [-3.8, 0], [-2, -3], [2.6, -4.6]], col, lw);
        break;
      case 'bob':
        A.poly(c, [[6.6, -2.4], [6.8, -7], [2, -9.6], [-4.6, -9], [-7.8, -3.5], [-7.2, 4.6], [-3.4, 4], [-3, 0], [-1, -3.4], [3.2, -3.4], [5, -2.2]], col, lw);
        if (hair.streak) A.poly(c, [[5.6, -3], [6, -6.6], [3.6, -8.6], [3, -4]], hair.streak, 0);
        break;
      case 'combed':
        A.poly(c, [[6.2, -4.6], [6, -7.4], [1.5, -9], [-4.2, -8.2], [-6.8, -4], [-6.4, 0.6], [-4, -1.6], [-1, -5], [3, -5.2]], col, lw);
        break;
      case 'wavy':
        A.poly(c, [[6.2, -3.8], [6.6, -7.2], [2.6, -9.6], [-3.4, -9.8], [-7.6, -6.4], [-8.8, -1], [-7, 4], [-3.8, 1.4], [-2.6, -3], [2, -5]], col, lw);
        break;
      case 'balding':
        A.poly(c, [[-1, -6.6], [-5.8, -4], [-6.6, 0.8], [-4, 0], [-2.6, -3]], col, lw);
        break;
      default: break;
    }
  }

  A._head = function (P) {
    const { c, look, lw, hdx, hdy, lean, p, hd } = P, tilt = (p.tilt || 0) + lean * 0.35, skin = look.skin;
    const ink = lw / hd, thin = ink * 0.55;
    c.save();
    c.translate(hdx, hdy); c.rotate(tilt); c.scale(hd, hd);
    const hat = look.helmet, mask = look.mask;
    if (mask && look.hair) hairCap(c, look.hair, ink);   // a mask sits over the hair
    // Skull and jaw: a long adult face with a defined chin.
    c.beginPath();
    c.moveTo(-5.4, -2); c.bezierCurveTo(-6.4, -9, 5.6, -10.4, 6.4, -3);
    c.lineTo(6.6, 0.8); c.lineTo(7.4, 2.2); c.lineTo(6.2, 3.1); c.lineTo(6, 6);
    c.quadraticCurveTo(4.9, 8.4, 2.4, 8.2); c.lineTo(-1.6, 5.8); c.quadraticCurveTo(-4.6, 3.6, -5.4, -2);
    c.closePath();
    c.fillStyle = skin; c.fill();
    c.lineWidth = ink; c.strokeStyle = A.INK; c.lineJoin = 'round'; c.stroke();
    if (!mask) { // the shadow tone under the cheek, and the ear
      c.fillStyle = A.shade(skin);
      c.beginPath(); c.moveTo(-5, 0); c.lineTo(-1, 2.2); c.lineTo(2.4, 8); c.lineTo(-1.4, 5.6); c.quadraticCurveTo(-4.2, 3.4, -5, 0); c.fill();
      A.ellipse(c, -2, 0.6, 1, 1.6, skin, thin);
      A.line(c, -2.1, -0.1, -1.7, 1.1, thin * 0.8, A.shade(skin, 0.6));
    }
    if (look.beard) A.poly(c, [[-2.2, 2], [0.6, 3], [3, 3.4], [6.2, 3.2], [6.2, 6.2], [4.8, 9.6], [1.2, 10.4], [-2.2, 6.6]], look.beard, ink);
    if (mask) { // Silt: a smooth white mask with one eye slit, on a strap round the back of his head
      A.poly(c, [[-0.6, -2.4], [-6.8, -3.2], [-7, -1.4], [-0.6, -0.6]], '#15151c', 0);
      c.beginPath();
      c.moveTo(1, -9.4); c.bezierCurveTo(5, -10, 7.6, -7, 7.6, -2.6); c.bezierCurveTo(7.6, 2, 6.6, 7, 3.4, 9.2);
      c.bezierCurveTo(0.8, 8.8, -0.8, 4, -1, -1); c.bezierCurveTo(-1.2, -5, -0.6, -8, 1, -9.4); c.closePath();
      c.fillStyle = mask; c.fill(); c.lineWidth = ink; c.strokeStyle = A.INK; c.stroke();
      c.fillStyle = A.shade(mask, 0.78); c.beginPath(); c.moveTo(-0.9, 0); c.bezierCurveTo(-0.6, 4, 0.8, 8.2, 3.4, 9.2); c.bezierCurveTo(2.4, 6, 1, 3, -0.9, 0); c.fill();
      A.poly(c, [[3, -1.9], [7, -1.9], [7, -0.6], [3, -0.6]], A.INK, 0);
    } else if (hat && look.visor !== false) {
      A.poly(c, [[6.8, -3.6], [6.6, -7.2], [2, -10], [-4.4, -9.6], [-7, -4], [-6.8, 2.6], [-1.8, 2.6], [-0.6, -3.6]], hat, ink);
      A.poly(c, [[7.4, -3.8], [7.6, 0.6], [0.6, 0.6], [0, -3.8]], A.INK, 0);
      A.line(c, 1.4, -2.8, 6, -2.8, 0.5, '#46507e');
      A.line(c, 3.1, 5.1, 5.4, 4.9, 0.65);
    } else {
      // Eye: small and narrow on purpose (an adult's, not a big-eyed child's), brow, mouth.
      A.poly(c, [[2, -1.1], [4.1, -2], [6, -1.2], [4.2, 0.35]], '#f5efe2', 0);
      A.circle(c, 4.5, -0.85, 1.05, look.eye || '#2a2233', 0);
      A.circle(c, 4.7, -0.85, 0.5, A.INK, 0);
      A.line(c, 1.9, -1.2, 4.1, -2.1, 0.8);
      A.line(c, 4.1, -2.1, 6.1, -1.25, 0.8);
      A.line(c, 2.4, 0.05, 4.2, 0.4, 0.3);
      A.line(c, 1.8, -3.5, 5.9, -2.8 - (look.brow || 0), 1);
      A.line(c, 7, 2.2, 6.2, 3, 0.45, A.shade(skin, 0.6));
      if (!look.beard) A.line(c, 3.1, 5.1, 5.4, 4.9 - (P.mood === 'grin' ? 0.8 : look.smile || 0), 0.65);
      else A.line(c, 3.2, 5.1, 5.2, 5, 0.7, A.shade(skin, 1.15));
      if (look.scarBrow) A.line(c, 3.2, -3.9, 4, -1.8, 0.45, '#f5efe2');
      if (look.mole) A.circle(c, 3.8, 1.2, 0.34, A.INK, 0);
      if (look.earring) A.circle(c, -1.8, 3.2, 0.95, null, 0.5, look.earring);
      if (hat) A.poly(c, [[6.8, -3.6], [6.6, -7.2], [2, -10], [-4.4, -9.6], [-7, -4], [-6.8, 2.6], [-1.8, 2.6], [-0.6, -3.6]], hat, ink);
    }
    if (look.hair) hairCap(c, look.hair, ink);
    if (look.glasses) {
      A.circle(c, 4.2, -0.8, 2, null, 0.45, '#20222e');
      A.line(c, 2.2, -0.9, -1, -1.1, 0.45, '#20222e');
    }
    if (look.goggles) {
      // Brass flight goggles pushed up on the forehead, dark lenses, a brown strap round the hair
      A.poly(c, [[-7.4, -5.4], [-3, -7.6], [3, -8.8], [3, -7], [-3, -5.8], [-7.4, -3.8]], '#5a3d26', thin);
      A.ellipse(c, 6.5, -8.4, 1.5, 2, A.shade(look.goggles, 0.8), thin);
      A.ellipse(c, 3.5, -8.2, 2.9, 2.3, look.goggles, thin * 1.3);
      A.ellipse(c, 3.5, -8.2, 1.8, 1.45, '#2b2622', 0);
      A.line(c, 2.6, -9, 3.6, -9.2, 0.4, '#8d7a55');
    }
    if (look.neckMark) { for (let i = 0; i < 3; i++) A.line(c, -3.2 + i * 0.3, 7 + i * 1.8, -1.4 + i * 0.3, 7.6 + i * 1.8, 0.8, look.markColor); }
    c.restore();
  };

  // Things in front of everything: gauntlets, bond marks on hands, glowing cores, bond-cutters.
  A._front = function (P) {
    const { c, look, lw, armN, glow } = P;
    if (look.gauntlet) A._gauntlet(c, P);
    if (look.core) { // Vasch's glass arm: one white core in the forearm
      const x = (armN.e[0] + armN.w[0]) / 2, y = (armN.e[1] + armN.w[1]) / 2;
      A.circle(c, x, y, 1.5 + glow, A.PAPER, lw * 0.5, '#9fd6e0');
    }
    if (look.blade) { // a hooked bond-cutter at the hip; glows white
      const b = look.build;
      c.save(); c.translate(P.hx, P.hy); c.rotate(P.lean);
      const bx = b.hip * 0.2;
      A.poly(c, [[bx - 0.6, -4], [bx + 1.8, -4], [bx + 1.8, 1], [bx - 0.6, 1]], '#17181f', lw * 0.5);   // the belt clip
      A.poly(c, [[bx, 0], [bx + 1.8, 0], [bx + 3, 11], [bx + 5.4, 12.5], [bx + 1.6, 16], [bx + 1.8, 12.6], [bx + 0.6, 11]], '#e8eef5', lw * 0.6);   // the hooked blade
      c.restore();
    }
  };
})();
