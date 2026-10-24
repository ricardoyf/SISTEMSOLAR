/** Educational comparisons. All displayed size and distance ratios use the same scale. */
export function initCompare(container, bodies, { onExplore = () => {} } = {}) {
  const byId = new Map(bodies.map(body => [body.id, body]));
  const planets = bodies.filter(body => ['rocky', 'gas', 'ice'].includes(body.type));
  const earth = byId.get('earth');
  const AU_KM = 149597870.7;
  const YEAR_DAYS = earth?.orbitDays || 365.256;
  const abort = new AbortController();
  const number = (value, digits = 1) => Number(value).toLocaleString('es-ES', { maximumFractionDigits: digits });
  const esc = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  let mode = 'sizes';
  let sizeA = byId.has('earth') ? 'earth' : bodies[0].id;
  let sizeB = byId.has('jupiter') ? 'jupiter' : bodies[1].id;
  let distanceMeters = 10;
  let age = 9;

  container.classList.add('compare-root');
  container.innerHTML = `
    <style>
      .compare-root{color:#eaf0ee;min-width:0;font-family:inherit;--compare-muted:#a2afba;--compare-line:rgba(255,255,255,.12);--compare-mint:#b7ebcf}
      .compare-root *{box-sizing:border-box}
      .compare-root button,.compare-root input,.compare-root select{font:inherit}
      .compare-root button{cursor:pointer}
      .compare-root button:focus-visible,.compare-root input:focus-visible,.compare-root select:focus-visible,.compare-root [tabindex]:focus-visible{outline:2px solid #b7ebcf;outline-offset:4px}
      .compare-root [hidden]{display:none!important}
      .compare-root .compare-tabs{display:flex;gap:5px;flex-wrap:wrap;padding:5px;background:#111e25;border:1px solid var(--compare-line);border-radius:14px;width:fit-content;margin:0 0 24px}
      .compare-root .compare-tab{border:0;background:transparent;color:var(--compare-muted);padding:11px 21px;border-radius:9px;font-size:14px;font-weight:650;min-height:44px}
      .compare-root .compare-tab[aria-pressed=true]{background:var(--compare-mint);color:#14271f}
      .compare-root .compare-intro{max-width:760px;margin-bottom:22px}
      .compare-root .compare-intro h3{margin:0 0 10px;font-size:clamp(23px,3vw,32px);font-weight:600;letter-spacing:-.7px;line-height:1.2}
      .compare-root p{font-size:14px;line-height:1.65;color:var(--compare-muted);margin:0}
      .compare-root .compare-kicker{color:var(--compare-mint);font-size:10px;font-weight:750;letter-spacing:1.8px;text-transform:uppercase;margin-bottom:12px}
      .compare-root .compare-card{border:1px solid var(--compare-line);border-radius:20px;background:linear-gradient(135deg,rgba(24,41,49,.62),rgba(11,23,30,.64));padding:24px;min-width:0}
      .compare-root .compare-size-layout{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(250px,.7fr);gap:18px}
      .compare-root .compare-pair{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:24px;min-width:0}
      .compare-root .compare-selector{display:block;min-width:0;font-size:11px;text-transform:uppercase;letter-spacing:1.1px;color:var(--compare-muted);font-weight:650}
      .compare-root select{display:block;width:100%;min-width:0;margin-top:9px;color:#eaf0ee;background:#15242d;border:1px solid #3b4b55;border-radius:9px;padding:11px 10px;font-size:15px;letter-spacing:0;text-transform:none;min-height:44px;color-scheme:dark}
      .compare-root .compare-body-stage{height:220px;display:grid;place-items:center;position:relative;overflow:visible;margin-top:10px;--compare-disc-limit:200px}
      .compare-root .compare-disc-frame{position:relative;width:100%;max-width:var(--compare-disc-limit);aspect-ratio:1;display:grid;place-items:center}
      .compare-root .compare-disc{aspect-ratio:1;border-radius:50%;position:relative;background-color:var(--body-color);background-image:radial-gradient(circle at 30% 25%,rgba(255,255,255,.28),transparent 40%),radial-gradient(circle at 30% 32%,transparent 25%,rgba(0,0,0,.7) 100%)}
      .compare-root .compare-disc[data-body=earth]{background-image:radial-gradient(ellipse at 35% 35%,#738b58 0 13%,transparent 15%),radial-gradient(ellipse at 58% 67%,#788d5d 0 11%,transparent 14%),radial-gradient(ellipse at 79% 25%,#779b69 0 18%,transparent 20%),radial-gradient(circle at 27% 26%,#81b8cc,transparent 40%),radial-gradient(circle at 25% 30%,transparent 5%,#07172d 100%);background-color:#3684a4}
      .compare-root .compare-disc[data-body=jupiter]{background-image:radial-gradient(ellipse at 61% 67%,#af5948 0 7%,transparent 10%),radial-gradient(circle at 25% 30%,transparent 10%,#211d248c 100%),repeating-linear-gradient(4deg,#c2a580 0 8%,#a37859 9% 13%,#dfcfaf 14% 22%,#bb987e 23% 28%)}
      .compare-root .compare-disc[data-body=saturn]{background-image:radial-gradient(circle at 25% 30%,transparent 10%,#242127aa 100%),repeating-linear-gradient(1deg,#dbc59b 0 7%,#bfa77d 9% 13%,#dfceab 14% 22%,#c8b386 23% 28%)}
      .compare-root .compare-disc[data-body=sun]{background-image:radial-gradient(circle at 35% 30%,#fff1b5,#ffd177 45%,#ed7f37);box-shadow:0 0 30px #f1ba4a22}
      .compare-root .compare-locator{position:absolute;top:calc(50% + 10px);left:50%;height:14px;border-left:1px solid #a2afba}
      .compare-root .compare-body-title{text-align:center;font-size:15px;font-weight:650;margin-top:4px}
      .compare-root .compare-diameter{text-align:center;font-size:12px;margin-top:6px;font-variant-numeric:tabular-nums}
      .compare-root .compare-note{margin-top:20px;padding-top:17px;border-top:1px solid var(--compare-line);font-size:12px;line-height:1.6;color:var(--compare-muted)}
      .compare-root .compare-note strong{color:#d9e7e1;font-weight:600}
      .compare-root .compare-stat{margin:18px 0 24px}
      .compare-root .compare-stat-value{font-size:44px;letter-spacing:-2px;line-height:1.1;font-weight:550;color:var(--compare-mint);display:block}
      .compare-root .compare-stat-label{display:block;margin-top:8px;font-size:13px;line-height:1.45;color:var(--compare-muted)}
      .compare-root .compare-stat-small{font-size:29px;letter-spacing:-1px;color:#eaf0ee}
      .compare-root .compare-data-table{width:100%;border-collapse:collapse;font-size:12px;line-height:1.5;margin-top:14px}
      .compare-root .compare-data-table th,.compare-root .compare-data-table td{text-align:left;border-bottom:1px solid var(--compare-line);padding:10px 4px;vertical-align:top}
      .compare-root .compare-data-table th{color:var(--compare-muted);font-weight:500}
      .compare-root .compare-data-table th:first-child{width:36%}
      .compare-root .compare-data-table td{font-variant-numeric:tabular-nums}
      .compare-root .compare-reason{background:#b7ebcf0a;border-left:2px solid #7aa58d;padding:12px 14px;margin-top:20px;font-size:12px;line-height:1.6;color:#c3d2ce}
      .compare-root .compare-scroll-note{display:flex;justify-content:space-between;gap:12px;font-size:11px;color:var(--compare-muted);margin:0 0 10px}
      .compare-root .compare-distance-scroll{width:100%;max-width:100%;overflow-x:auto;border:1px solid var(--compare-line);border-radius:16px;background:#0b171e;scrollbar-color:#425d67 #10232b;overscroll-behavior-x:contain}
      .compare-root .compare-distance-lane{position:relative;width:1800px;height:270px}
      .compare-root .compare-distance-line{position:absolute;left:70px;right:70px;top:130px;border-top:1px solid #62747a}
      .compare-root .compare-distance-point{position:absolute;top:120px;width:12px;height:20px;transform:translateX(-50%);border:0;background:transparent;display:grid;place-items:center;padding:0}
      .compare-root .compare-distance-dot{width:10px;height:10px;display:block;border-radius:50%;background:var(--body-color);box-shadow:0 0 0 4px #0b171e;pointer-events:none}
      .compare-root .compare-distance-point[data-body=sun] .compare-distance-dot{width:16px;height:16px;box-shadow:0 0 15px #eac06355}
      .compare-root .compare-distance-caption{position:absolute;width:80px;height:40px;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;font-size:12px;line-height:1.5;pointer-events:auto;color:#dde6e4;white-space:nowrap;padding:1px 0;border:1px solid transparent;border-radius:7px;background:transparent}
      .compare-root .compare-distance-caption:hover{background:#1b3039;border-color:#3e5863;color:#fff}
      .compare-root .compare-distance-caption span{display:block;color:var(--compare-muted);font-size:10px;font-variant-numeric:tabular-nums}
      .compare-root .compare-distance-stem{position:absolute;border-left:1px solid #425760}
      .compare-root .compare-tick{position:absolute;top:242px;font-size:10px;color:#82929b;transform:translateX(-50%);font-variant-numeric:tabular-nums}
      .compare-root .compare-tick:before{content:'';position:absolute;top:-9px;left:50%;height:5px;border-left:1px solid #425760}
      .compare-root .compare-distance-bottom{display:grid;grid-template-columns:minmax(240px,.8fr) minmax(0,1.2fr);gap:18px;margin-top:18px}
      .compare-root .compare-slider-label{display:block;font-size:18px;font-weight:500;line-height:1.5;margin:8px 0 16px}
      .compare-root .compare-range{width:100%;height:28px;accent-color:#b7ebcf;cursor:pointer;margin:8px 0}
      .compare-root .compare-range-limits{display:flex;justify-content:space-between;color:var(--compare-muted);font-size:11px}
      .compare-root .compare-range-output{color:var(--compare-mint);font-weight:700;white-space:nowrap}
      .compare-root .compare-school-table{width:100%;border-collapse:collapse;font-size:12px}
      .compare-root .compare-school-table th{font-size:10px;letter-spacing:.4px;color:var(--compare-muted);font-weight:500;text-align:right;padding:0 0 12px;line-height:1.5}
      .compare-root .compare-school-table th:first-child{text-align:left}
      .compare-root .compare-school-table td{text-align:right;padding:8px 0;border-top:1px solid var(--compare-line);font-variant-numeric:tabular-nums}
      .compare-root .compare-school-table td:first-child{text-align:left}
      .compare-root .compare-color-dot{display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--body-color);vertical-align:middle;margin-right:8px}
      .compare-root .compare-age-header{display:flex;align-items:center;justify-content:space-between;gap:25px;flex-wrap:wrap;margin-bottom:20px}
      .compare-root .compare-age-control{display:flex;align-items:center;gap:12px;padding:12px 15px;background:#15242d;border:1px solid var(--compare-line);border-radius:12px}
      .compare-root .compare-age-control label{font-size:13px;color:#d5e1dc}
      .compare-root .compare-age-control input{width:66px;border:0;border-bottom:1px solid #6c857a;background:transparent;color:#b7ebcf;font-weight:700;font-size:23px;padding:4px;color-scheme:dark;font-variant-numeric:tabular-nums}
      .compare-root .compare-years-list{display:grid;grid-template-columns:1fr 1fr;column-gap:34px}
      .compare-root .compare-year-row{padding:18px 0;border-bottom:1px solid var(--compare-line);min-width:0}
      .compare-root .compare-year-top{display:flex;justify-content:space-between;align-items:flex-start;gap:12px}
      .compare-root .compare-explore{background:transparent;border:0;padding:0;min-height:26px;font-size:14px;color:#eaf0ee;text-align:left}
      .compare-root .compare-explore:hover{text-decoration:underline;text-underline-offset:4px}
      .compare-root .compare-year-age{text-align:right;color:#b7ebcf;font-size:22px;font-weight:500;font-variant-numeric:tabular-nums;letter-spacing:-.5px}
      .compare-root .compare-year-age small{font-size:11px;color:var(--compare-muted);letter-spacing:0;display:block;margin-top:3px}
      .compare-root .compare-year-period{font-size:11px;margin:7px 0 11px;color:var(--compare-muted)}
      .compare-root .compare-year-track{height:4px;border-radius:4px;background:#263741;overflow:hidden}
      .compare-root .compare-year-bar{height:100%;background:var(--body-color);border-radius:0 3px 3px 0}
      .compare-root .compare-zero{font-size:11px;color:#b7ebcf;margin-top:7px}
      @media(max-width:760px){.compare-root .compare-size-layout,.compare-root .compare-distance-bottom{grid-template-columns:1fr}.compare-root .compare-card{padding:19px}.compare-root .compare-size-stats{display:grid;grid-template-columns:1fr 1fr;gap:0 18px}.compare-root .compare-size-stats .compare-kicker,.compare-root .compare-size-stats .compare-data-table,.compare-root .compare-size-stats .compare-reason{grid-column:1/-1}.compare-root .compare-stat{margin:8px 0 15px}.compare-root .compare-stat-value{font-size:36px}.compare-root .compare-stat-small{font-size:27px}.compare-root .compare-years-list{grid-template-columns:1fr;gap:0}.compare-root .compare-age-header{gap:16px}}
      @media(max-width:420px){.compare-root .compare-tab{padding:10px 14px;font-size:13px}.compare-root .compare-pair{gap:15px}.compare-root .compare-body-stage{height:170px;--compare-disc-limit:160px}.compare-root .compare-card{padding:16px}.compare-root .compare-diameter{font-size:11px}.compare-root .compare-stat-value{font-size:30px}.compare-root .compare-stat-small{font-size:25px}.compare-root .compare-data-table{font-size:11px}.compare-root .compare-age-control{width:100%;justify-content:space-between}}
      @media(prefers-reduced-motion:reduce){.compare-root *{scroll-behavior:auto!important;transition:none!important}}
    </style>
    <div class="compare-tabs" role="group" aria-label="Qué quieres comparar">
      <button type="button" class="compare-tab" data-compare-mode="sizes" aria-pressed="true">Tamaños</button>
      <button type="button" class="compare-tab" data-compare-mode="distances" aria-pressed="false">Distancias</button>
      <button type="button" class="compare-tab" data-compare-mode="years" aria-pressed="false">Años</button>
    </div>
    <section class="compare-section" data-compare-section="sizes" aria-label="Comparación de tamaños">
      <div class="compare-intro"><p class="compare-kicker">Una misma regla para todos</p><h3>¿Cuánto más grande?</h3><p>En el mapa ampliamos los planetas para encontrarlos. Aquí sus diámetros sí comparten una misma escala. Elige dos cuerpos y compara.</p></div>
      <div class="compare-size-layout">
        <div class="compare-card">
          <div class="compare-pair">
            <div><label class="compare-selector">Primer cuerpo<select data-compare-select="a" aria-label="Primer cuerpo para comparar"></select></label><div class="compare-body-stage" data-compare-stage="a"></div><div class="compare-body-title" data-compare-name="a"></div><p class="compare-diameter" data-compare-diameter="a"></p></div>
            <div><label class="compare-selector">Segundo cuerpo<select data-compare-select="b" aria-label="Segundo cuerpo para comparar"></select></label><div class="compare-body-stage" data-compare-stage="b"></div><div class="compare-body-title" data-compare-name="b"></div><p class="compare-diameter" data-compare-diameter="b"></p></div>
          </div>
          <p class="compare-note" data-compare-size-note></p>
        </div>
        <div class="compare-card compare-size-stats" data-compare-size-stats></div>
      </div>
    </section>
    <section class="compare-section" data-compare-section="distances" aria-label="Comparación de distancias" hidden>
      <div class="compare-intro"><p class="compare-kicker">Lo que más hay es espacio</p><h3>Un vecindario muy separado.</h3><p>Esta línea conserva las proporciones de las distancias medias al Sol. Los puntos solo señalan la posición: sus tamaños no están a escala.</p></div>
      <div class="compare-scroll-note"><span>Escala lineal · 1 UA ≈ 149,6 millones de km</span><span>Desliza la línea para recorrerla</span></div>
      <div class="compare-distance-scroll" tabindex="0" aria-label="Distancias a escala. Usa las flechas del teclado o desliza horizontalmente."><div class="compare-distance-lane" data-compare-distance-lane></div></div>
      <div class="compare-distance-bottom">
        <div class="compare-card"><p class="compare-kicker">Construye tu modelo</p><label class="compare-slider-label" for="compare-earth-distance">Si la Tierra estuviera a <output class="compare-range-output" data-compare-meters>10 m</output> del Sol…</label><input class="compare-range" id="compare-earth-distance" type="range" min="1" max="20" step="1" value="10" aria-label="Distancia entre el Sol y la Tierra en el modelo, en metros"><div class="compare-range-limits"><span>1 metro</span><span>20 metros</span></div><p class="compare-note" data-compare-school-note></p><p class="compare-reason">Aquí también calculamos los diámetros con esa misma escala. Así se entiende por qué los planetas casi desaparecen cuando dibujamos todo el sistema de una vez.</p></div>
        <div class="compare-card"><table class="compare-school-table"><thead><tr><th scope="col">Planeta</th><th scope="col">Distancia<br>al Sol</th><th scope="col">Diámetro<br>en el modelo</th></tr></thead><tbody data-compare-school-rows></tbody></table></div>
      </div>
      <p class="compare-note">Las distancias medias se representan mediante el semieje mayor de cada órbita. No son las posiciones actuales ni la distancia entre dos planetas. La Luna queda fuera de esta línea porque orbita la Tierra.</p>
    </section>
    <section class="compare-section" data-compare-section="years" aria-label="Comparación de años" hidden>
      <div class="compare-age-header"><div class="compare-intro"><p class="compare-kicker">La misma edad, otros cumpleaños</p><h3>¿Cuántos años tendrías?</h3><p>Un año es una vuelta al Sol. La duración cambia según el planeta.</p></div><div class="compare-age-control"><label for="compare-earth-age">Tu edad en la Tierra</label><input type="number" min="1" max="120" step="1" value="9" id="compare-earth-age" inputmode="numeric" aria-label="Edad en años terrestres"></div></div>
      <div class="compare-card"><div class="compare-years-list" data-compare-years-list></div><p class="compare-note">Las barras comparan la duración de una órbita en una misma escala, con Neptuno como máximo. Tu cuerpo no envejecería más deprisa ni más despacio: solo cambia la unidad con la que cuentas tu edad. Cálculo aproximado con años orbitales sidéreos.</p></div>
    </section>`;

  const find = selector => container.querySelector(selector);
  const options = bodies.map(body => `<option value="${esc(body.id)}">${esc(body.name)}</option>`).join('');
  for (const side of ['a', 'b']) {
    find(`[data-compare-select="${side}"]`).innerHTML = options;
  }
  find('[data-compare-select="a"]').value = sizeA;
  find('[data-compare-select="b"]').value = sizeB;

  function rotationLabel(body) {
    if (!Number.isFinite(body.rotationHours) || body.rotationHours === 0) return '—';
    const hours = Math.abs(body.rotationHours);
    const duration = hours >= 48 ? `${number(hours / 24, 1)} días` : `${number(hours, 2)} h`;
    return duration + (body.rotationHours < 0 ? ' · retrógrada' : '') + (['sun', 'jupiter', 'saturn', 'uranus', 'neptune'].includes(body.id) ? ' ≈' : '');
  }

  function renderSizes() {
    const a = byId.get(sizeA), b = byId.get(sizeB);
    const maxRadius = Math.max(a.radiusKm, b.radiusKm);
    const smaller = a.radiusKm <= b.radiusKm ? a : b;
    const larger = a.radiusKm >= b.radiusKm ? a : b;
    const ratio = larger.radiusKm / smaller.radiusKm;
    let tiny = false;
    for (const [side, body] of [['a', a], ['b', b]]) {
      const fraction = body.radiusKm / maxRadius;
      const isTiny = fraction < .015;
      tiny ||= isTiny;
      find(`[data-compare-stage="${side}"]`).innerHTML = `<div class="compare-disc-frame" aria-hidden="true"><div class="compare-disc" data-body="${esc(body.id)}" style="--body-color:${esc(body.color)};width:${fraction * 100}%"></div>${isTiny ? '<span class="compare-locator"></span>' : ''}</div>`;
      find(`[data-compare-name="${side}"]`).textContent = body.name;
      find(`[data-compare-diameter="${side}"]`).textContent = `${number(body.radiusKm * 2, 0)} km de diámetro medio`;
    }
    find('[data-compare-size-note]').innerHTML = `<strong>Diámetros a escala.</strong> Los colores y las superficies son ilustraciones. No se incluyen los anillos.${tiny ? ' El cuerpo pequeño puede medir menos de un píxel: la rayita bajo su posición ayuda a localizarlo, sin ampliar su tamaño.' : ''}`;
    const same = a.id === b.id;
    find('[data-compare-size-stats]').innerHTML = `
      <p class="compare-kicker">${same ? 'El mismo cuerpo' : `${esc(larger.name)} respecto a ${esc(smaller.name)}`}</p>
      <div class="compare-stat"><span class="compare-stat-value">${number(ratio, 2)} ×</span><span class="compare-stat-label">el diámetro</span></div>
      <div class="compare-stat"><span class="compare-stat-value compare-stat-small">${number(ratio ** 3, 0)} ×</span><span class="compare-stat-label">el volumen aproximado</span></div>
      <table class="compare-data-table"><thead><tr><th scope="col">Compara</th><th scope="col">${esc(a.name)}</th><th scope="col">${esc(b.name)}</th></tr></thead><tbody><tr><th scope="row">Diámetro medio</th><td>${number(a.radiusKm * 2, 0)} km</td><td>${number(b.radiusKm * 2, 0)} km</td></tr><tr><th scope="row">Rotación sidérea</th><td>${esc(rotationLabel(a))}</td><td>${esc(rotationLabel(b))}</td></tr></tbody></table>
      <p class="compare-reason">${a.id === 'venus' || b.id === 'venus' ? 'Venus tarda unos 243 días terrestres en girar sobre sí mismo y 225 en dar una vuelta al Sol. Pero de un mediodía al siguiente pasan unos 117 días. Rotación y día solar no son lo mismo.' : 'El volumen crece con el cubo del diámetro: duplicar el diámetro multiplica el volumen por ocho. La comparación supone esferas; no indica cuántas bolas pequeñas se podrían empaquetar dentro.'}</p>
      ${a.id === 'venus' || b.id === 'venus' ? '<p class="compare-note">El volumen se calcula como el cubo de la relación de diámetros, suponiendo esferas; no es un cálculo de empaquetado.</p>' : ''}
      ${a.id === 'sun' || b.id === 'sun' ? '<p class="compare-note">La rotación del Sol es aproximada: el ecuador y los polos no giran a la misma velocidad.</p>' : ''}
      ${a.id === 'moon' || b.id === 'moon' ? '<p class="compare-note">La Luna tarda unos 27,3 días en rotar y también en dar una vuelta a la Tierra. Por eso nos muestra casi la misma cara.</p>' : ''}`;
  }

  function renderDistanceLine() {
    const displayed = [byId.get('sun'), ...planets].filter(Boolean);
    const maxAU = Math.max(...planets.map(body => body.distanceAU));
    const width = 1800, pad = 70;
    const position = distance => pad + distance / maxAU * (width - 2 * pad);
    const labelTop = { sun: 152, mercury: 18, venus: 196, earth: 62, mars: 151, jupiter: 35, saturn: 159, uranus: 35, neptune: 159 };
    let html = '<div class="compare-distance-line"></div>';
    for (const body of displayed) {
      const x = position(body.distanceAU || 0);
      const top = labelTop[body.id] ?? 35;
      const upper = top < 130;
      const stemTop = upper ? top + 38 : 138;
      const stemHeight = upper ? 122 - stemTop : top - stemTop - 4;
      html += `<div class="compare-distance-stem" style="left:${x}px;top:${stemTop}px;height:${Math.max(0, stemHeight)}px"></div><button type="button" class="compare-distance-point" data-body="${esc(body.id)}" data-compare-explore="${esc(body.id)}" style="left:${x}px;--body-color:${esc(body.color)}" aria-label="Explorar ${esc(body.name)}; distancia media ${number(body.distanceAU || 0, 2)} UA"><span class="compare-distance-dot"></span></button><button type="button" class="compare-distance-caption" data-compare-explore="${esc(body.id)}" aria-label="Explorar ${esc(body.name)}; distancia media ${number(body.distanceAU || 0, 2)} UA" style="left:${x}px;top:${top}px">${esc(body.name)}<span>${number(body.distanceAU || 0, 2)} UA</span></button>`;
    }
    for (let tick = 0; tick <= 30; tick += 5) html += `<span class="compare-tick" style="left:${position(tick)}px">${tick} UA</span>`;
    find('[data-compare-distance-lane]').innerHTML = html;
  }

  function diameterInModel(body) {
    return body.radiusKm * 2 / AU_KM * distanceMeters * 1000;
  }
  function renderSchoolModel() {
    find('[data-compare-meters]').textContent = `${number(distanceMeters, 0)} m`;
    const sun = byId.get('sun');
    find('[data-compare-school-note]').innerHTML = `${sun ? `El Sol mediría <strong>${number(diameterInModel(sun), 1)} mm</strong> de diámetro. ` : ''}La Tierra mediría <strong>${number(diameterInModel(earth), 3)} mm</strong>. Estas medidas sí usan la misma escala para tamaños y distancias.`;
    find('[data-compare-school-rows]').innerHTML = planets.map(body => `<tr><td><span class="compare-color-dot" style="--body-color:${esc(body.color)}"></span>${esc(body.name)}</td><td>${number(body.distanceAU * distanceMeters, 2)} m</td><td>${number(diameterInModel(body), 3)} mm</td></tr>`).join('');
  }

  function renderYears() {
    const maxDays = Math.max(...planets.map(body => body.orbitDays));
    find('[data-compare-years-list]').innerHTML = planets.map(body => {
      const planetaryAge = age * YEAR_DAYS / body.orbitDays;
      const period = body.orbitDays < YEAR_DAYS * 2 ? `${number(body.orbitDays, 0)} días terrestres` : `${number(body.orbitDays / YEAR_DAYS, 1)} años terrestres`;
      return `<div class="compare-year-row"><div class="compare-year-top"><div><button type="button" class="compare-explore" data-compare-explore="${esc(body.id)}"><span class="compare-color-dot" style="--body-color:${esc(body.color)}"></span>${esc(body.name)}</button><p class="compare-year-period">Una órbita: ${period}</p></div><div class="compare-year-age">${number(planetaryAge, 2)}<small>años en ${esc(body.name)}</small></div></div><div class="compare-year-track" aria-hidden="true"><div class="compare-year-bar" style="width:${body.orbitDays / maxDays * 100}%;--body-color:${esc(body.color)}"></div></div>${planetaryAge < 1 ? '<div class="compare-zero">Aún no habrías completado tu primera vuelta.</div>' : ''}</div>`;
    }).join('');
  }

  function setMode(next) {
    if (!['sizes', 'distances', 'years'].includes(next)) return false;
    mode = next;
    for (const button of container.querySelectorAll('[data-compare-mode]')) button.setAttribute('aria-pressed', String(button.dataset.compareMode === mode));
    for (const section of container.querySelectorAll('[data-compare-section]')) section.hidden = section.dataset.compareSection !== mode;
    return true;
  }

  function setPair(firstId, secondId = 'earth') {
    if (!byId.has(firstId) || !byId.has(secondId)) return false;
    sizeA = firstId;
    sizeB = secondId;
    find('[data-compare-select="a"]').value = sizeA;
    find('[data-compare-select="b"]').value = sizeB;
    renderSizes();
    setMode('sizes');
    return true;
  }

  container.addEventListener('click', event => {
    const tab = event.target.closest('[data-compare-mode]');
    if (tab && container.contains(tab)) setMode(tab.dataset.compareMode);
    const explore = event.target.closest('[data-compare-explore]');
    if (explore && container.contains(explore)) onExplore(explore.dataset.compareExplore);
  }, { signal: abort.signal });
  container.addEventListener('change', event => {
    const side = event.target.dataset.compareSelect;
    if (side && byId.has(event.target.value)) {
      if (side === 'a') sizeA = event.target.value;
      else sizeB = event.target.value;
      renderSizes();
    }
    if (event.target.id === 'compare-earth-age') {
      const input = Number(event.target.value);
      if (event.target.value.trim() !== '' && Number.isFinite(input)) age = Math.max(1, Math.min(120, Math.round(input)));
      event.target.value = String(age);
      renderYears();
    }
  }, { signal: abort.signal });
  container.addEventListener('input', event => {
    if (event.target.id === 'compare-earth-distance') {
      const input = Number(event.target.value);
      if (Number.isFinite(input)) distanceMeters = Math.max(1, Math.min(20, Math.round(input)));
      event.target.value = String(distanceMeters);
      renderSchoolModel();
    }
    if (event.target.id === 'compare-earth-age') {
      const input = Number(event.target.value);
      if (Number.isFinite(input) && input >= 1 && input <= 120) {
        age = input;
        renderYears();
      }
    }
  }, { signal: abort.signal });

  renderSizes();
  renderDistanceLine();
  renderSchoolModel();
  renderYears();
  return {
    setMode,
    setPair,
    refresh() { renderSizes(); renderSchoolModel(); renderYears(); setMode(mode); },
    destroy() { abort.abort(); container.replaceChildren(); container.classList.remove('compare-root'); }
  };
}
