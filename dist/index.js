import t, { Grid as s } from "pathfinding"; class e { constructor({ canvasWidth: t, canvasHeight: s, father: e, ctx: i }) { this.perspective = { PERSPECTIVE: .8 * this.canvasWidth || 1e3, PROJECTION_CENTER_X: this.canvasWidth / 2 || 500, PROJECTION_CENTER_Y: this.canvasHeight / 2 || 500 }, this.canvasWidth = t, this.canvasHeight = s, this.father = e, this.ctx = i, this.x = 0, this.y = 0, this.z = 0, this.theta = 0, this.phi = 0, this.radius = 10, this.globalRadius = this.canvasWidth / 3, this.xProjected = 0, this.yProjected = 0, this.scaleProjected = 0; } project({ x: t, y: s, z: e }, { PERSPECTIVE: i, PROJECTION_CENTER_X: o, PROJECTION_CENTER_Y: h }) { const r = i / (i + s); return { size: r, x: t * r + o, y: e * r + h }; } update() { this.father && this.father.draw(!0); } } const i = (t, s, e, i = !0) => { let o, h = Object.assign({}, t); const r = Object.fromEntries(Object.keys(e).map(s => { const i = e[s] - t[s]; return [s, { v: Math.abs(i), face: i > 0 }]; })); return new Promise((a, n) => { const c = n => { o || (o = n); const l = n - o + 0; Object.entries(r).forEach(([e, { v: i, face: o }]) => { t[e] = o ? h[e] + i * l / s : h[e] - i * l / s; }), l < s ? requestAnimationFrame(c) : i ? (h = Object.assign({}, t), o = n, Object.keys(r).forEach(t => r[t].face = !r[t].face), requestAnimationFrame(c)) : (console.log("sfsd", h, e), a()); }; requestAnimationFrame(c); }); }, o = (t, s) => { Object.keys(t).forEach(e => { void 0 !== t[e] && (s[e] = "object" == typeof t[e] ? Object.assign(s[e] || {}, t[e]) : t[e]); }); }, h = (t = "rgba(0, 255, 0, 1)") => (s, e) => { s.backUpAttr.state.changed ? s.restore() : (o({ faceColor: s.faceColor }, s.backUpAttr.attr), o({ changed: !0 }, s.backUpAttr.state), s.faceColor[1] = t), s.update(); }, r = t => new Promise((s, e) => { setTimeout(() => s(), t); }), a = (t, s, e, i, o) => ({ x: h, y: r }) => ({ x: (h - t / 2 + i) * e, y: (r - s / 2 + o) * e }), n = (t, { vector: s, colors: e }) => { const { p1: i, p2: o } = s, h = t.createLinearGradient(i.x, i.y, o.x, o.y); return e.forEach(({ color: t, p: s }) => { h.addColorStop(s, t); }), h; }; class c { constructor(t = 1, s = (() => { }), e = []) { return this.concurrency = t, this.running = 0, this.queue = e, this.finalTask = s, this; } pushTask(t) { this.queue.push(t), this.next(); } clear() { this.queue = []; } next() { for (;this.running < this.concurrency && this.queue.length;) { this.queue.shift()().then(() => { this.running-- , this.next(); }), this.running++; } 0 === this.running && 0 === this.queue.length && this.finalTask(); } } const l = (t, s) => { const e = []; let i, o = [], h = []; return t.forEach(t => { const { x: r, y: a } = t.pos; void 0 === i && (i = a), a !== i && (i = a, e.push(...o.reverse(), ...h), o = [], h = []), r < s / 2 ? h.push(t) : o.push(t); }), e.push(...h, ...o.reverse()), e; }, d = t => new Promise(s => { const e = new Image; e.src = t, e.onload = () => s(e); }), p = (t, s) => void 0 !== t ? t : (Math.random() - .5) * s, u = [[0, 1], [1, 3], [3, 2], [2, 0], [2, 6], [3, 7], [0, 4], [1, 5], [6, 7], [6, 4], [7, 5], [4, 5]], f = [[0, 1, 3, 2], [0, 1, 5, 4], [3, 2, 6, 7], [4, 5, 7, 6], [0, 2, 6, 4], [1, 3, 7, 5]], g = [[-1, -1, -1], [1, -1, -1], [-1, 1, -1], [1, 1, -1], [-1, -1, 1], [1, -1, 1], [-1, 1, 1], [1, 1, 1]]; class m extends e { constructor(t) { super(t), this.faces = [], this.faceColor = { 0: "rgba(48, 48, 48, 0.75)", 1: "rgba(200, 32, 32, 0.9)", 2: "rgba(41, 41, 41, 0.9)" }, this.todo = {}, this.strokeStyle = "rgb(64, 170, 191, 0.5)", this.backUpAttr = { attr: {}, state: {} }, this.text = ""; const { cubeLength: s, cubeWidth: e, cubeHeight: i, canvasWidth: o, canvasHeight: r, x: a, y: n, z: c, radius: l, theta: d, faceColor: u, pos: f } = t; this.radius = l || Math.floor(12 * Math.random() + 10), this.pos = f, this.width = e || this.radius, this.height = i || l || 10, this.length = s || this.radius, this.x = p(a, o), this.y = p(n, r), this.z = p(c, r), u && (this.faceColor[1] = u), this.theta = d || 0, this.ctx.lineJoin = "round", this.ctx.lineWidth = 2, this.on("click", h()); } restore() { o({ ...this.backUpAttr.attr }, this), o({ changed: !1 }, this.backUpAttr.state); } set(t) { o(t, this); } pointInPath(t) { const s = this.faces.some(s => this.ctx.isPointInPath(s, t.layerX, t.layerY)); return !!s && (this.todo[t.type] && this.todo[t.type].forEach(t => t.call(this, this, this.father)), s); } on(t, s) { this.todo[t] || (this.todo[t] = []), this.todo[t].push(s); } animate(t) { i(this, 1e4, t); } viToXy([t, s, e]) { const i = { x: this.x + this.width * t, z: this.z + this.length * e, y: this.y + this.height * s }; return this.project((({ x: t, y: s, z: e }) => ({ x: t, y: s * Math.cos(this.theta) + e * Math.sin(this.theta), z: s * Math.sin(this.theta) + e * Math.cos(this.theta) }))(i), this.perspective); } drawFace(t = 1) { const s = new Path2D, e = this.ctx; if (f[t].forEach((t, e) => { const { x: i, y: o } = this.viToXy(g[t]); 0 === e ? s.moveTo(i, o) : s.lineTo(i, o); }), s.closePath(), e.fillStyle = this.faceColor[t] || this.faceColor[0], e.fill(s), 1 === t) { const { x: t, y: s } = this.viToXy([1, -1, 0]); let i = 0 === this.pos.x ? this.pos.y : 0 === this.pos.y ? this.pos.x : this.text; e.font = `${this.radius / 2}px sans-serif`, e.fillStyle = "#313131", e.textAlign = "right", e.fillText(i + " ", t, s); } e.restore(), 0 !== t && 1 !== t || (this.faces[t] = s); } draw() { const t = this.ctx; this.z < -this.perspective.PERSPECTIVE + this.radius || (u.forEach((s, e) => { if (2 === e || 8 === e) return; const i = this.viToXy(g[s[0]]), o = this.viToXy(g[s[1]]); this.ctx.lineWidth = 2, t.beginPath(), t.moveTo(i.x, i.y), t.lineTo(o.x, o.y), this.ctx.strokeStyle = this.strokeStyle, t.stroke(); }), this.drawFace(0), this.drawFace(1)); } } const x = { tile_bigforce: { name: "特种战术点", description: "置于其中的我方单位在推动或拉动敌方单位时力度增大", color: "hsla(342, 98%, 67%, 1)" }, tile_def: { name: "防御符文", description: "置于其中的干员获得额外的防御力", color: "hsla(342, 98%, 67%, 1)" }, tile_fence: { name: "围栏", description: "可放置近战单位，不可以通行", color: "hsla(342, 98%, 67%, 1)" }, tile_healing: { name: "医疗符文", description: "置于其中的干员会持续恢复生命", color: "hsla(342, 98%, 67%, 1)" }, tile_rcm_crate: { name: "推荐障碍放置点", description: "PRTS推荐的障碍物放置点", color: "hsla(342, 98%, 67%, 1)" }, tile_rcm_operator: { name: "推荐干员放置点", description: "PRTS推荐的战术放置点", color: "hsla(342, 98%, 67%, 1)" }, tile_shallowwater: { name: "浅水区", description: "代表岸边的水地形", color: "hsla(342, 98%, 67%, 1)" }, tile_corrosion: { name: "腐蚀地面", description: "置于其中的干员防御力减半", color: "hsla(179, 18%, 42%, 1)" }, tile_deepwater: { name: "深水区", description: "代表离岸较远的水地形", color: "hsla(224, 100%, 25%, 0.7)" }, tile_end: { name: "保护目标", description: "蓝色目标点，敌方进入后会减少此目标点的耐久", color: "hsl(189, 96%, 37%)" }, tile_floor: { name: "不可放置位", description: "不可放置单位，可以通行", color: "hsla(38, 92%, 90%, 1)" }, tile_flystart: { name: "空袭侵入点", description: "敌方飞行单位会从此处进入战场", color: "hsl(0, 95%, 61%)" }, tile_forbidden: { name: "禁入区", description: "不可放置单位，不可通行", color: "rgba(230,230,230, 0.9)" }, tile_gazebo: { name: "防空符文", description: "置于其中的干员攻击速度略微下降，但在攻击空中单位时攻击力大幅度提升", color: "hsla(48, 83%, 57%, 1)" }, tile_grass: { name: "草丛", description: "置于其中的干员不会成为敌军远程攻击的目标", color: "green" }, tile_hole: { name: "地穴", description: "危险的凹陷地形或地面破洞，经过的敌人会摔落至底部直接死亡", color: "hsla(219, 57%, 14%, 1)" }, tile_infection: { name: "活性源石", description: "部署的友军和经过的敌军获得攻击力和攻击速度提升的效果，但会持续失去生命", color: "red" }, tile_road: { name: "平地", description: "可以放置近战单位，可以通行", color: "#fff" }, tile_start: { name: "侵入点", description: "敌方会从此进入战场", color: "rgb(255, 61, 61)" }, tile_telin: { name: "通道入口", description: "敌方会从此进入通道，从通道出口出现", color: "rgb(244, 152, 0)" }, tile_telout: { name: "通道出口", description: "进入通道的敌方单位会从此处再度出现", color: "rgb(244, 152, 0)" }, tile_volcano: { name: "热泵通道", description: "每隔一段时间便会喷出高温气体，对其上的任何单位造成无视防御和法抗的伤害", color: "hsla(25, 100%, 49%, 0.9)" }, tile_volspread: { name: "岩浆喷射处", description: "每隔一段时间会喷出岩浆，对周围8格内的我方单位造成大量伤害且可以融化障碍物", color: "hsl(0, 100%, 24%)" }, tile_wall: { name: "高台", description: "可以放置远程单位，不可通行", color: "rgba(125, 253, 244, 0.9)" } }; class y extends e { constructor(t) { super(t), this.absPath = [], this.strokeStyle = "rgba(0, 0, 0, 0)", this.i = 0, this.points = t.points, this.x = 0, this.y = t.y || 20, this.z = 0, this.width = t.width || 5; } set(t) { o(t, this); } init() { this.absPath = this.points.map(t => this.viToXy(t)); const t = new Path2D; this.absPath.forEach(({ x: s, y: e }, i) => { 0 === i ? t.moveTo(s, e) : t.lineTo(s, e); }), this.path = t; } draw() { this.ctx.save(), this.ctx.lineWidth = this.width, this.init(), this.ctx.lineDashOffset = -this.i++ , this.i > 100 * this.radius && (this.i = 0), this.ctx.setLineDash([3.5 * this.radius * 2, 2 * this.radius * 2]), this.ctx.strokeStyle = this.strokeStyle, this.ctx.stroke(this.path), this.ctx.restore(); } viToXy({ x: t, y: s }) { const e = this.y; return this.project((({ x: t, y: s, z: e }) => ({ x: t, z: s * Math.cos(this.theta) + e * Math.sin(this.theta), y: s * Math.sin(this.theta) + e * Math.cos(this.theta) }))({ x: t, z: e, y: s }), this.perspective); } } class w extends y { constructor(t) { super(t), this._gradientColors = [{ color: "rgba(0, 0, 0, 0)", p: 0 }, { color: "rgba(0, 0, 0, 0)", p: 1 }], this.run = !0, this.gradientColors = t.gradientColors || this._gradientColors, this.time = t.time || 2e3, this.color = t.color || 360 * Math.random(); } update() { this.father.update(); } animate(t, s) { const e = t | this.time, i = s | this.color; return new Promise((t, s) => { let o; const h = s => { o || (o = s); const r = s - o + 0; if (!this.run) return void t(r); let a = 0, n = Math.min(r / e, 1); n > .618 && (a = 1 - (1 - n) / .382), n = Math.min(n / .7, 1); const c = [{ p: 0, color: `hsla(${i}, 100%, 50%, 0.1)` }, { p: a, color: `hsla(${i}, 100%, 50%, 0.7)` }, { p: n, color: `hsla(${i}, 100%, 35%, 1)` }, { p: Math.min(n + .02, 1), color: `hsla(${i}, 100%, 50%, 0)` }]; this.gradientColors = c, this.update(), r < e ? requestAnimationFrame(h) : t(); }; requestAnimationFrame(h); }); } set strokeStyle(t) { } get strokeStyle() { const t = this.absPath; return 0 === t.length ? "？？？？？？？" : n(this.ctx, { vector: { p1: t[0], p2: t[this.points.length - 1] }, colors: this.gradientColors }); } set gradientColors(t) { if (!t) throw Error("fuck you"); this._gradientColors = t; } get gradientColors() { return this._gradientColors; } } class v extends m { constructor(t) { super(t), this.tileInfo = t.tileInfo; } } const b = (t, s, e) => (t[s] = e(t[s]), t), E = t => s => t ? { col: s.col + t.x, row: s.row + t.y } : s, P = (t, s) => t.col === s.col && t.row === s.row, T = (t, s) => t > s ? [s, t] : [t, s], C = Math.abs; let _; const R = (s, e, i, o, h) => { if (!h) throw Error("No grid !"); const [r, a] = T(s, i), [n, c] = T(e, o), l = a - r, d = c - n, p = s === r ? 0 : l, u = e === n ? 0 : d, f = i === r ? 0 : l, g = o === n ? 0 : d, m = h.nodes.filter((t, s) => s <= c && s >= n).map(t => t.filter((t, s) => s <= a && s >= r).map(t => t.walkable ? 0 : 1)); try { m[g][f] = 0; } catch (t) { console.error(g, f, m); } const x = m.flat().filter(t => 1 === t).length; if (x) { const [h, a] = T(C(s - i), C(e - o)); if (1 === h && a > 2 && 1 === x) return [i, o]; const c = t.Util.compressPath(_.findPath(p, u, f, g, new t.Grid(m))); return 0 === c.length ? [-1, -1] : [r + c[1][0], n + c[1][1]]; } return [i, o]; }, k = t => ({ x: t.col, y: t.row }), M = (s, e) => { const { height: i } = e.data, { startPosition: o, endPosition: h, checkpoints: r } = s; _ = new t.AStarFinder({ diagonalMovement: 4, weight: Math.min(C(o.col - h.col), C(o.row - h.row)), heuristic: function (t, e) { const { x: i, y: o } = s.spawnRandomRange; return i > 0 && o > 0 ? Math.max(t * i, e * (1 + o)) : Math.max(t, e); } }); const a = e.grid, n = r.filter(t => t.type < 4 || 6 === t.type), c = n.map(t => ({ ...t.position, type: t.type, reachOffset: t.reachOffset })), l = c.some(t => 6 === t.type); c.push(h); const d = 1 === s.motionMode, p = d ? new t.Grid(a.width, a.height) : a.clone(); p.setWalkableAt(h.col, h.row, !0); let u = o; return c.reduce((e, i, o, h) => { let { col: r, row: a } = u, c = h[o], { col: f, row: g, reachOffset: m } = c; if (6 === c.type) return u = i, e; if (0 === f && 0 === g) { const t = n[o].time ? n[o].time : 0; return e.push({ stop: { pos: k(h[o - 1] || u), time: t } }), e; } let x = [u]; d && x.push(c); const y = s.allowDiagonalMove; if (!d && !l && y) { let [s, e] = [r, a], i = [], o = C(f - r), h = C(g - a); for (;o + h > 1;) { if ([s, e] = R(s, e, f, g, p), s > -1 && e > -1) x.push({ col: s, row: e }); else { if (0 === i.length) { const s = t.Util.compressPath(_.findPath(r, a, f, g, p)); if (s.length < 1) throw Error("can not find a way to the point"); i = s.slice(1); } if ([s, e] = i.shift(), x.length > 1) for (;P({ col: s, row: e }, x[x.length - 2]);) [s, e] = i.shift(); x.push({ col: s, row: e }); } o = C(f - s), h = C(g - e); } } P(c, x[x.length - 1]) || x.push(c), x = b(x, 0, E(u.reachOffset)), x = b(x, x.length - 1, E(m)), u = i; let w = x.shift(); return x.reduce((t, s) => { const { col: e, row: i } = w, o = Math.sqrt((e - s.col) ** 2 + (i - s.row) ** 2); return t.push({ points: [k(w), k(s)], time: 200 * o || 10 }), w = s, t; }, e); }, []); }; class O extends m { constructor(t) { super(t), this.time = t.time, this.faceColor[0] = "rgba(41, 230, 41, 0.3)"; } drawFace(t = 1) { const s = new Path2D, e = this.ctx; if (f[t].forEach((t, e) => { const { x: i, y: o } = this.viToXy(g[t]); 0 === e ? s.moveTo(i, o) : s.lineTo(i, o); }), s.closePath(), e.fillStyle = this.faceColor[t] || this.faceColor[0], e.fill(s), 1 === t) { const { x: t, y: s } = this.viToXy([0, 0, 0]); 0 === this.pos.x ? this.pos.y : 0 === this.pos.y ? this.pos.x : this.text; e.font = `${this.radius / 2}px sans-serif`, e.fillStyle = "white", e.textAlign = "center", e.fillText(this.time + "s ", t, s); } e.restore(), 0 !== t && 1 !== t || (this.faces[t] = s); } animate() { return Promise.resolve(); } } export default class { constructor(t, s = -75 / 360 * Math.PI, e, i, o) { this.dots = [], this.i = 0, this.theta = 0, this.data = { width: 8, height: 4 }, this.drawing = !1, this.routes = new Map, this.looping = !0, this.config(t, e, s), this.init(i, o), this.loop(); } loop() { requestAnimationFrame(() => { this.draw(!1).then(() => this.looping && this.loop()); }); } config(t, s, e) { this.canvas = t; let { width: i, height: o } = this.canvas.getBoundingClientRect(); this.canvas.width = i, this.canvas.height = o, this.context = this.canvas.getContext("2d"), this.canvasWidth = i, this.canvasHeight = o, this.baseOpt = { ctx: this.context, father: this, canvasWidth: i, canvasHeight: o }, this.baseFloor = new m({ ...this.baseOpt, x: 0, z: 0, y: 2, cubeHeight: 2, faceColor: "#414141", cubeLength: o / 2, cubeWidth: i / 2, pos: { x: 0, y: 0 } }); const h = { perspective: { PERSPECTIVE: s, PROJECTION_CENTER_X: i / 2, PROJECTION_CENTER_Y: o / 2 }, theta: e }; this.setPerspective(h); } init(t, e) { this.r = Math.min(this.canvas.width / t.width, this.canvas.height / t.height), this.xz = a(t.width, t.height, this.r, .5, .5), this.RawRoutes = e, this.dots = [], this.routes = new Map; const i = this.r, { width: o, height: h } = t, { width: r, height: n } = this.canvas, c = .1 * i, d = .25 * i, p = []; for (let s = h - 1;s > -1;s--) { const e = [], h = [], a = []; for (let l = o - 1;l > -1;l--) { const { x: p, y: u } = this.xz({ x: l, y: s }), f = { x: p, z: u, canvasWidth: r, canvasHeight: n, radius: i / 2, pos: { x: l, y: s }, ctx: this.context, father: this }, g = t.tiles[s * o + l], { tileKey: m, passableMask: y } = g, w = /end|hole/.test(m) || 3 !== y ? 1 : 0; a.push(w); const b = x[g.tileKey], E = (g.heightType ? d + c : c) / 2, P = new v({ ...f, cubeHeight: E, y: (g.heightType, -E), faceColor: b.color, tileInfo: b }); g.heightType ? e.push(P) : h.push(P), g.events && Object.entries(g.events).forEach(([t, s]) => { s.forEach(s => { P.on(t, s); }); }); } p.push(a.reverse()), this.dots.push(...l(h, o), ...l(e, o)); } this.grid = new s(p.reverse()); const { perspective: u, theta: f } = this; u && f && this.setPerspective({ perspective: u, theta: f }), this.canvas.addEventListener("click", t => { for (let s = this.dots.length - 1;s > -1;s--) { if (this.dots[s].pointInPath(t)) break; } }); } deleteRoute(t) { this.routes.delete(t), 0 === this.routes.size && (this.looping = !1); } deleteAll() { this.routes.clear(); } async loopRoutes(t = 0, s = this.RawRoutes.length) { this.RawRoutes.slice(t, s).map((t, s) => { t && this.initRoute(t, s); }); } loopRoute(t, s) { if (this.routes.has(t)) this.routes.delete(t); else { const e = this.RawRoutes[t]; e && (this.looping = !0, this.loop(), this.initRoute(e, t, s)); } } initRoute(t, s, e = Math.floor(360 * Math.random())) { const { canvasHeight: i, canvasWidth: h } = this, r = M(t, this).map(({ points: s, time: r, stop: a }) => { const n = 1 === t.motionMode; if (s) return this.initPath(s, r, e, n); if (a) { const { x: t, y: s } = this.xz(a.pos), e = new O({ x: t, z: s, y: n ? -this.r : -this.r / 3, cubeHeight: .05 * this.r / 2, canvasWidth: h, canvasHeight: i, radius: this.r / 2, pos: { x: t, y: s }, ctx: this.context, father: this, time: a.time, faceColor: "rgba(144,230, 13, 0.7)" }); return o({ perspective: this.perspective, theta: this.theta }, e), e; } return { animate: () => Promise.resolve(), draw: () => { }, set: () => { } }; }); this.routes.set(s, r); (() => { const t = r.map(t => t.animate.bind(t)); new c(1, () => { console.log("next"); }, t).next(); })(); } initPath(t, s = 2e3, e, i = !1) { const h = t.map(t => this.xz(t)), r = new w({ ...this.baseOpt, width: this.r / 10, y: i ? -this.r : -this.r / 2, r: this.r, points: h, time: s, color: e }); return o({ perspective: this.perspective, theta: this.theta }, r), r; } setPerspective(t) { o(t, this), this.dots.forEach(s => s.set(t)), this.routes.forEach(s => s.forEach(s => s.set(t))), this.baseFloor.set(t), this.draw(!0); } update() { } async draw(t) { this.drawing && (this.drawing = !1, await r(100)), this.drawing = !0, this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight); const s = new c(1, () => this.drawing = !1); t ? (s.pushTask(() => (this.baseFloor.draw(), Promise.resolve())), this.dots.forEach(t => { s.pushTask(async () => { this.drawing || s.clear(), t.draw(); }); })) : this.background && this.context.drawImage(this.background, 0, 0), this.routes.forEach(t => { s.pushTask(async () => { this.drawing || s.clear(), t.forEach(t => t.draw()); }); }), t && s.pushTask(async () => { const t = this.canvas.toDataURL(); this.background = await d(t); }); } }
