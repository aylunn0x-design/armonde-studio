import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, 'data');
const dataFile = path.join(dataDir, 'content.json');
const ADMIN_PASSWORD = process.env.ARMONDE_ADMIN_PASSWORD || 'changeme123';
const PORT = process.env.PORT || 4321;
fs.mkdirSync(dataDir, { recursive: true });

const defaultContent = {
  siteName: 'Armonde',
  heroTitle: 'Designing timeless spaces with quiet luxury.',
  heroText: 'Luxury architecture, interior design, brochures, and premium presentation materials for refined brands and clients.',
  about: 'Armonde is a luxury architecture and interior design business focused on elegant spaces, refined detail, and intentional living.',
  services: [
    { title: 'Architecture Design', text: 'Residential and commercial architectural concepts and planning.' },
    { title: 'Interior Design', text: 'Elegant interior concepts, space planning, and styling.' },
    { title: '3D Visualization', text: 'High-end visuals that communicate space, mood, and design quality.' },
    { title: 'Project Management', text: 'Refined coordination and client-facing design delivery.' }
  ],
  projects: [],
  contactEmail: 'hello@armonde.studio',
  instagram: '@armonde.studio',
  phone: '+976 0000 0000',
  locationText: 'Ulaanbaatar, Mongolia'
};
if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, JSON.stringify(defaultContent, null, 2));
const readContent = () => JSON.parse(fs.readFileSync(dataFile, 'utf8'));
const writeContent = (data) => fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
const send = (res, status, body, type='text/html; charset=utf-8') => { res.writeHead(status, { 'content-type': type }); res.end(body); };
const readBody = (req) => new Promise(resolve => { let data=''; req.on('data', c => data += c); req.on('end', () => resolve(data)); });
const isAuthed = (req) => (req.headers.cookie || '').includes('armonde_admin=1');
const h = (s='') => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');

function shell(title, body) {
  return `<!doctype html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>${h(title)}</title><style>
  :root{--bg:#0b0b0d;--bg2:#121316;--panel:#17181c;--line:rgba(255,255,255,.08);--text:#f5f5f5;--muted:#9ca3af;--accent:#d8b47a;--danger:#ef4444;--white:#fff}
  *{box-sizing:border-box} body{font-family:Inter,system-ui,sans-serif;margin:0;background:linear-gradient(180deg,#0b0b0d,#101114);color:var(--text)} a{text-decoration:none;color:inherit} img{display:block;max-width:100%}
  .wrap{max-width:1240px;margin:0 auto;padding:28px}.narrow{max-width:900px}.muted{color:var(--muted)} .mini{font-size:.84rem;color:var(--muted)}
  .btn{display:inline-flex;align-items:center;justify-content:center;padding:12px 18px;border-radius:14px;border:1px solid var(--line);background:var(--accent);color:#111;font-weight:700;cursor:pointer}.btn.secondary{background:transparent;color:var(--text)}.btn.danger{background:var(--danger);color:#fff}.btn.light{background:#fff;color:#111}
  .top{display:flex;justify-content:space-between;align-items:center;gap:18px}.site-nav{position:sticky;top:0;z-index:20;background:rgba(11,11,13,.72);backdrop-filter:blur(14px);border-bottom:1px solid rgba(255,255,255,.06)} .nav-wrap{display:flex;justify-content:space-between;align-items:center;gap:20px;min-height:76px}.brand{font-weight:800;letter-spacing:.22em}.nav-links{display:flex;gap:22px;color:#d7d7d7}.nav-links a:hover{color:#fff}
  h1,h2,h3{font-family:Manrope,Inter,sans-serif;margin:0 0 12px;line-height:1.02}.hero{position:relative;min-height:92vh;display:flex;align-items:end;overflow:hidden}.hero-bg{position:absolute;inset:0;background:url('https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1800&q=80') center/cover no-repeat;transform:scale(1.04)}.hero-shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.2),rgba(0,0,0,.78))}.hero-inner{position:relative;z-index:1;padding:120px 0 56px}.eyebrow{letter-spacing:.18em;text-transform:uppercase;font-size:.76rem;color:#e9d4b2;font-weight:700}.hero h1{font-size:clamp(3rem,8vw,6rem);max-width:820px}.lead{max-width:700px;font-size:1.08rem;color:#d8d8d8}.section{padding:92px 0}.section.soft{background:rgba(255,255,255,.03)}
  .grid{display:grid;gap:20px}.grid-2{grid-template-columns:1fr 1fr}.cards{display:grid;gap:18px}.card,.panel,.sidebar,.login-card,.project-card,.glass{background:rgba(255,255,255,.03);border:1px solid var(--line);border-radius:24px;box-shadow:0 22px 60px rgba(0,0,0,.28)}.card,.panel{padding:24px}.glass{padding:26px;backdrop-filter:blur(10px)}
  .project-showcase{display:grid;grid-template-columns:1.3fr 1fr 1fr;gap:18px;margin-top:28px}.feature{position:relative;overflow:hidden;border-radius:28px;min-height:420px}.feature.large{grid-row:span 2;min-height:860px}.feature img,.project-card img,.preview img,.gallery-item img{width:100%;height:100%;object-fit:cover;transition:transform .5s ease}.feature:hover img,.project-card:hover img,.gallery-item:hover img{transform:scale(1.03)}.overlay{position:absolute;inset:auto 0 0 0;padding:20px;background:linear-gradient(180deg,transparent,rgba(0,0,0,.66));color:#fff}.overlay span{display:block;font-weight:700}.overlay small{opacity:.82}
  .footer{padding:34px 0;border-top:1px solid rgba(255,255,255,.06);color:#c7c7c7}.footer-grid{display:grid;grid-template-columns:1fr auto auto;gap:28px}
  .layout{display:grid;grid-template-columns:320px 1fr;gap:20px}.sidebar{padding:20px;position:sticky;top:22px;height:fit-content}.nav-item{display:block;padding:12px 14px;border-radius:14px;color:var(--muted)}.nav-item.active,.nav-item:hover{background:rgba(255,255,255,.06);color:#fff}
  input,textarea,select{width:100%;padding:13px 14px;border-radius:14px;border:1px solid var(--line);background:var(--panel);color:var(--text);font:inherit}textarea{resize:vertical}label{display:block;font-size:.9rem;color:#d1d5db;margin:8px 0}
  .row{display:grid;grid-template-columns:1fr 1fr;gap:14px}.toolbar{display:flex;gap:10px;flex-wrap:wrap}.pill{display:inline-block;padding:7px 10px;border-radius:999px;background:rgba(216,180,122,.12);color:#f3d7ae;font-size:.78rem}.status-pill{padding:6px 10px;border-radius:999px;font-size:.76rem;font-weight:700}.published{background:rgba(34,197,94,.16);color:#9bf2b4}.draft{background:rgba(255,255,255,.08);color:#ddd}
  .project-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:18px}.project-card{overflow:hidden}.project-card img{height:220px;background:#0f0f11}.project-body{padding:18px}.composer{display:grid;gap:14px}.preview{border-radius:20px;overflow:hidden;border:1px solid var(--line);height:300px}.dropzone{border:1px dashed rgba(255,255,255,.16);padding:18px;border-radius:18px;background:rgba(255,255,255,.02)} .hint{font-size:.84rem;color:var(--muted)} .stack{display:grid;gap:14px}
  .login-wrap{min-height:100vh;display:grid;place-items:center;padding:24px}.login-card{width:min(460px,100%);padding:28px}.gallery-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.gallery-item{border-radius:20px;overflow:hidden;min-height:200px;border:1px solid var(--line)} .lang-tabs{display:flex;gap:10px}.lang-tab{padding:9px 12px;border-radius:999px;border:1px solid var(--line);background:transparent;color:#fff}.helper-box{padding:14px 16px;border-radius:18px;background:rgba(255,255,255,.04);border:1px solid var(--line)}
  @media(max-width:980px){.grid-2,.layout,.row,.project-grid,.project-showcase,.footer-grid,.gallery-grid{grid-template-columns:1fr}.feature.large{grid-row:span 1;min-height:420px}.sidebar{position:static}.nav-links{display:none}}
  </style></head><body>${body}</body></html>`;
}

function publicHome(content) {
  const featured = content.projects.filter(p => p.status !== 'draft').slice(0, 3);
  return shell(content.siteName, `
    <header class="site-nav"><div class="wrap nav-wrap"><div class="brand">${h(content.siteName.toUpperCase())}</div><nav class="nav-links"><a href="#projects">Projects</a><a href="#about">About</a><a href="#services">Services</a><a href="#contact">Contact</a><a href="/admin">Admin</a></nav><a class="btn light" href="#contact">Contact Us</a></div></header>
    <main>
      <section class="hero"><div class="hero-bg"></div><div class="hero-shade"></div><div class="wrap hero-inner"><p class="eyebrow">Luxury Architecture Studio</p><h1>${h(content.heroTitle)}</h1><p class="lead">${h(content.heroText)}</p><div class="toolbar"><a class="btn" href="#projects">View Projects</a><a class="btn secondary" href="#contact">Start a Project</a></div></div></section>
      <section id="projects" class="section"><div class="wrap"><div class="top"><div><p class="mini">Featured Projects</p><h2>Selected work</h2></div></div><div class="project-showcase">
        ${featured.map((p, i) => `<a class="feature ${i===0?'large':''}" href="/project/${slugify(p.titleEn || p.title)}"><img src="${h(p.image)}" alt="${h(p.titleEn || p.title)}"/><div class="overlay"><span>${h(p.titleEn || p.title)}</span><small>${h(p.location || '')} · ${h(p.year || '')}</small></div></a>`).join('')}
      </div></div></section>
      <section id="about" class="section soft"><div class="wrap grid grid-2"><div><p class="mini">About the studio</p><h2>Architecture that feels calm, expensive, and unforgettable.</h2></div><div class="glass"><p>${h(content.about)}</p></div></div></section>
      <section id="services" class="section"><div class="wrap"><div class="top"><div><p class="mini">Services</p><h2>What we do</h2></div></div><div class="cards grid-2">${content.services.map(s => `<div class="card"><h3>${h(s.title)}</h3><p>${h(s.text)}</p></div>`).join('')}</div></div></section>
      <section id="contact" class="section soft"><div class="wrap grid grid-2"><div><p class="mini">Contact</p><h2>Let’s create something exceptional.</h2><p class="lead">Book a consultation, request a brochure, or ask about a project.</p><p>Email: ${h(content.contactEmail)}<br/>Phone: ${h(content.phone)}<br/>Location: ${h(content.locationText)}<br/>Instagram: ${h(content.instagram)}</p></div><div class="glass"><h3>Fast inquiry</h3><p class="muted">Contact form hookup can be added next. For now, use the direct email above.</p><div class="toolbar"><a class="btn" href="mailto:${h(content.contactEmail)}">Email Us</a></div></div></div></section>
    </main>
    <footer class="footer"><div class="wrap footer-grid"><div><div class="brand">${h(content.siteName.toUpperCase())}</div><p>Premium architecture & interior design studio.</p></div><div><strong>Social</strong><p>Instagram<br/>Pinterest<br/>Behance</p></div><div><strong>Contact</strong><p>${h(content.contactEmail)}<br/>${h(content.locationText)}</p></div></div></footer>
  `);
}

function publicProjectPage(content, project) {
  const gallery = Array.isArray(project.gallery) && project.gallery.length ? project.gallery : [project.image].filter(Boolean);
  return shell(`${project.titleEn || project.title} — ${content.siteName}`, `
    <header class="site-nav"><div class="wrap nav-wrap"><a class="brand" href="/">${h(content.siteName.toUpperCase())}</a><nav class="nav-links"><a href="/">Home</a><a href="/admin">Admin</a></nav></div></header>
    <main>
      <section class="section"><div class="wrap grid grid-2"><div><p class="mini">${h(project.category || '')}</p><h1>${h(project.titleEn || project.title)}</h1><p class="lead">${h(project.location || '')} · ${h(project.year || '')}</p></div><div class="glass"><p>${h(project.descriptionEn || project.description || '')}</p></div></div></section>
      <section class="section soft"><div class="wrap"><div class="top"><div><p class="mini">Gallery</p><h2>Project visuals</h2></div></div><div class="gallery-grid">${gallery.map(img => `<div class="gallery-item"><img src="${h(img)}" alt="gallery"/></div>`).join('')}</div></div></section>
    </main>
  `);
}

function adminLayout(body) { return shell('Armonde Admin', body); }
function slugify(s='') { return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''); }

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const content = readContent();

  if (req.method === 'GET' && url.pathname === '/') return send(res, 200, publicHome(content));
  if (req.method === 'GET' && url.pathname.startsWith('/project/')) {
    const slug = url.pathname.split('/project/')[1] || '';
    const project = content.projects.find(p => slugify(p.titleEn || p.title) === slug);
    if (!project) return send(res, 404, shell('Not found', `<div class="wrap"><h1>Project not found</h1></div>`));
    return send(res, 200, publicProjectPage(content, project));
  }

  if (req.method === 'GET' && url.pathname === '/admin/login') return send(res, 200, adminLayout(`<div class="login-wrap"><div class="login-card"><h1>Armonde Admin</h1><p class="muted">Sign in to manage projects and website content.</p><form method="POST" action="/admin/login"><label>Password</label><input type="password" name="password" placeholder="Enter admin password"/><button class="btn" type="submit">Login</button></form></div></div>`));
  if (req.method === 'POST' && url.pathname === '/admin/login') { const raw = await readBody(req); const params = new URLSearchParams(raw); if ((params.get('password') || '') === ADMIN_PASSWORD) { res.writeHead(302, { 'Set-Cookie': 'armonde_admin=1; HttpOnly; Path=/', Location: '/admin' }); return res.end(); } return send(res, 401, adminLayout(`<div class="login-wrap"><div class="login-card"><h1>Wrong password</h1><a class="btn secondary" href="/admin/login">Try again</a></div></div>`)); }
  if (req.method === 'GET' && url.pathname === '/admin/logout') { res.writeHead(302, { 'Set-Cookie': 'armonde_admin=0; Max-Age=0; Path=/', Location: '/admin/login' }); return res.end(); }
  if (url.pathname.startsWith('/admin') && !isAuthed(req)) { res.writeHead(302, { Location: '/admin/login' }); return res.end(); }

  if (req.method === 'GET' && url.pathname === '/admin') {
    return send(res, 200, adminLayout(`
      <div class="wrap layout"><aside class="sidebar"><h2>ARMONDE</h2><p class="mini">Content Studio</p><a class="nav-item active" href="/admin">Dashboard</a><a class="nav-item" href="/admin/new-project">New Project</a><a class="nav-item" href="/admin/settings">Site Settings</a><a class="nav-item" href="/admin/logout">Logout</a></aside>
      <section class="stack"><div class="panel"><div class="top"><div><h1>Showcase Projects</h1><p class="muted">Manage what visitors see first — featured projects, gallery visuals, and public presentation quality.</p></div><a class="btn" href="/admin/new-project">+ Add Project</a></div><div class="project-grid">${content.projects.map((p, i) => `<div class="project-card"><img src="${h(p.image || '')}" alt="${h(p.title || '')}"/><div class="project-body"><div class="toolbar"><span class="pill">${h(p.category || 'Project')}</span><span class="status-pill ${p.status === 'published' ? 'published' : 'draft'}">${h(p.status || 'draft')}</span>${p.featured ? '<span class="pill">Featured</span>' : ''}</div><h3 style="margin-top:12px">${h(p.titleEn || p.title || '')}</h3><p class="mini">${h(p.location || '')}${p.year ? ' · ' + h(p.year) : ''}</p><p>${h(p.descriptionEn || p.description || '')}</p><div class="toolbar"><a class="btn secondary" href="/admin/edit-project?id=${i}">Edit</a><a class="btn secondary" href="/project/${slugify(p.titleEn || p.title)}" target="_blank">View Public</a><form method="POST" action="/admin/delete-project" style="display:inline"><input type="hidden" name="id" value="${i}"/><button class="btn danger" type="submit">Delete</button></form></div></div></div>`).join('')}</div></div></section></div>
    `));
  }

  if (req.method === 'GET' && url.pathname === '/admin/new-project') return send(res, 200, adminLayout(projectComposer('Create Showcase Project', '/admin/new-project', { title:'', titleMn:'', titleEn:'', category:'Residential', year:'', location:'', description:'', descriptionMn:'', descriptionEn:'', image:'', featured:true, status:'published', gallery:[] })));
  if (req.method === 'POST' && url.pathname === '/admin/new-project') {
    const params = new URLSearchParams(await readBody(req));
    const gallery = (params.get('gallery') || '').split('\n').map(s => s.trim()).filter(Boolean);
    const image = params.get('image') || gallery[0] || '';
    content.projects.unshift({ title: params.get('titleEn') || params.get('title') || 'Untitled Project', titleMn: params.get('titleMn') || '', titleEn: params.get('titleEn') || '', category: params.get('category') || 'Residential', year: params.get('year') || '', location: params.get('location') || '', description: params.get('descriptionEn') || params.get('description') || '', descriptionMn: params.get('descriptionMn') || '', descriptionEn: params.get('descriptionEn') || '', image, gallery: gallery.length ? gallery : [image].filter(Boolean), featured: params.get('featured') === 'on', status: params.get('status') || 'published' });
    writeContent(content); res.writeHead(302, { Location: '/admin' }); return res.end();
  }

  if (req.method === 'GET' && url.pathname === '/admin/edit-project') {
    const id = Number(url.searchParams.get('id') || '-1');
    const project = content.projects[id];
    if (!project) return send(res, 404, adminLayout(`<div class="wrap"><h1>Project not found</h1></div>`));
    return send(res, 200, adminLayout(projectComposer('Edit Showcase Project', '/admin/edit-project', project, id)));
  }
  if (req.method === 'POST' && url.pathname === '/admin/edit-project') {
    const params = new URLSearchParams(await readBody(req));
    const id = Number(params.get('id') || '-1');
    if (!content.projects[id]) return send(res, 404, 'Not found', 'text/plain');
    const gallery = (params.get('gallery') || '').split('\n').map(s => s.trim()).filter(Boolean);
    const image = params.get('image') || gallery[0] || '';
    content.projects[id] = { title: params.get('titleEn') || params.get('title') || '', titleMn: params.get('titleMn') || '', titleEn: params.get('titleEn') || '', category: params.get('category') || '', year: params.get('year') || '', location: params.get('location') || '', description: params.get('descriptionEn') || params.get('description') || '', descriptionMn: params.get('descriptionMn') || '', descriptionEn: params.get('descriptionEn') || '', image, gallery: gallery.length ? gallery : [image].filter(Boolean), featured: params.get('featured') === 'on', status: params.get('status') || 'draft' };
    writeContent(content); res.writeHead(302, { Location: '/admin' }); return res.end();
  }

  if (req.method === 'POST' && url.pathname === '/admin/delete-project') { const params = new URLSearchParams(await readBody(req)); const id = Number(params.get('id') || '-1'); if (id >= 0) content.projects.splice(id, 1); writeContent(content); res.writeHead(302, { Location: '/admin' }); return res.end(); }

  if (req.method === 'GET' && url.pathname === '/admin/settings') return send(res, 200, adminLayout(`<div class="wrap layout"><aside class="sidebar"><h2>ARMONDE</h2><p class="mini">Content Studio</p><a class="nav-item" href="/admin">Dashboard</a><a class="nav-item" href="/admin/new-project">New Project</a><a class="nav-item active" href="/admin/settings">Site Settings</a><a class="nav-item" href="/admin/logout">Logout</a></aside><section class="panel"><h1>Site Settings</h1><p class="muted">Core public-facing text and contact details.</p><form class="stack" method="POST" action="/admin/settings"><label>Site Name</label><input name="siteName" value="${h(content.siteName)}"/><label>Hero Title</label><input name="heroTitle" value="${h(content.heroTitle)}"/><label>Hero Text</label><textarea name="heroText" rows="4">${h(content.heroText)}</textarea><label>About</label><textarea name="about" rows="5">${h(content.about)}</textarea><div class="row"><div><label>Contact Email</label><input name="contactEmail" value="${h(content.contactEmail)}"/></div><div><label>Instagram</label><input name="instagram" value="${h(content.instagram)}"/></div></div><div class="row"><div><label>Phone</label><input name="phone" value="${h(content.phone || '')}"/></div><div><label>Location</label><input name="locationText" value="${h(content.locationText || '')}"/></div></div><button class="btn" type="submit">Save Settings</button></form></section></div>`));
  if (req.method === 'POST' && url.pathname === '/admin/settings') { const params = new URLSearchParams(await readBody(req)); content.siteName = params.get('siteName') || content.siteName; content.heroTitle = params.get('heroTitle') || content.heroTitle; content.heroText = params.get('heroText') || content.heroText; content.about = params.get('about') || content.about; content.contactEmail = params.get('contactEmail') || content.contactEmail; content.instagram = params.get('instagram') || content.instagram; content.phone = params.get('phone') || content.phone || ''; content.locationText = params.get('locationText') || content.locationText || ''; writeContent(content); res.writeHead(302, { Location: '/admin/settings' }); return res.end(); }

  send(res, 404, 'Not found', 'text/plain');
});

function projectComposer(title, action, project, id='') {
  const galleryText = Array.isArray(project.gallery) ? project.gallery.join('\n') : '';
  return `
    <div class="wrap layout"><aside class="sidebar"><h2>ARMONDE</h2><p class="mini">Project Composer</p><a class="nav-item" href="/admin">Dashboard</a><a class="nav-item active" href="/admin/new-project">New Project</a><a class="nav-item" href="/admin/settings">Site Settings</a></aside>
    <section class="stack"><div class="panel"><div class="top"><div><h1>${h(title)}</h1><p class="muted">Built to feel more visual and safer for non-technical team members.</p></div></div>
    <div class="helper-box"><strong>Quick publishing flow</strong><p class="mini">Add a strong cover image, write the project name and concept, paste extra gallery visuals, then choose whether it goes live now or stays in draft.</p></div>
    <form class="composer" method="POST" action="${action}">${id !== '' ? `<input type="hidden" name="id" value="${id}"/>` : ''}
      <div class="dropzone"><label>Project cover image URL</label><input id="imageInput" name="image" value="${h(project.image || '')}" placeholder="Paste a strong image URL here"/><p class="hint">This becomes the main public project thumbnail.</p></div>
      <div class="preview"><img id="imagePreview" src="${h(project.image || 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1400&q=80')}" alt="preview"/></div>
      <div class="lang-tabs"><span class="pill">Bilingual Content</span></div>
      <div class="row"><div><label>Title (Mongolian)</label><input name="titleMn" value="${h(project.titleMn || '')}" placeholder="Төслийн нэр"/></div><div><label>Title (English)</label><input name="titleEn" value="${h(project.titleEn || project.title || '')}" placeholder="Project title"/></div></div>
      <div class="row"><div><label>Description (Mongolian)</label><textarea name="descriptionMn" rows="5" placeholder="Монгол тайлбар...">${h(project.descriptionMn || '')}</textarea></div><div><label>Description (English)</label><textarea name="descriptionEn" rows="5" placeholder="English description...">${h(project.descriptionEn || project.description || '')}</textarea></div></div>
      <div class="row"><div><label>Category</label><select name="category"><option ${project.category==='Residential'?'selected':''}>Residential</option><option ${project.category==='Commercial'?'selected':''}>Commercial</option><option ${project.category==='Interior'?'selected':''}>Interior</option></select></div><div><label>Status</label><select name="status"><option value="published" ${project.status==='published'?'selected':''}>Published</option><option value="draft" ${project.status==='draft'?'selected':''}>Draft</option></select></div></div>
      <div class="row"><div><label>Location</label><input name="location" value="${h(project.location || '')}" placeholder="Ulaanbaatar"/></div><div><label>Year</label><input name="year" value="${h(project.year || '')}" placeholder="2026"/></div></div>
      <div><label>Gallery image URLs (one per line)</label><textarea name="gallery" rows="6" placeholder="https://...\nhttps://...\nhttps://...">${h(galleryText)}</textarea><p class="hint">Paste multiple image links here to create the project gallery.</p></div>
      <div style="display:flex;align-items:end"><label style="display:flex;gap:10px;align-items:center"><input type="checkbox" name="featured" ${project.featured ? 'checked' : ''} style="width:auto"/> Feature on homepage</label></div>
      <div class="toolbar"><button class="btn" type="submit">Save Project</button><a class="btn secondary" href="/admin">Cancel</a></div>
    </form></div></section></div>
    <script>const input=document.getElementById('imageInput');const preview=document.getElementById('imagePreview');if(input&&preview)input.addEventListener('input',()=>{if(input.value.trim())preview.src=input.value.trim();});</script>
  `;
}

server.listen(PORT, () => {
  console.log(`Armonde admin site running on http://localhost:${PORT}`);
  console.log(`Admin password: ${ADMIN_PASSWORD}`);
});
