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
    { title: 'Brochure & Presentation', text: 'Studio brochures, branded materials, and visual presentations.' }
  ],
  projects: [
    { title: 'Private Residence', category: 'Residential', year: '2026', location: 'Ulaanbaatar', description: 'Luxury private home concept with calm modern detailing.', image: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1200&q=80' },
    { title: 'Boutique Interior', category: 'Interior', year: '2026', location: 'Seoul', description: 'Soft luxury interior concept for a boutique commercial space.', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80' }
  ],
  contactEmail: 'hello@armonde.studio',
  instagram: '@armonde.studio'
};
if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, JSON.stringify(defaultContent, null, 2));
const readContent = () => JSON.parse(fs.readFileSync(dataFile, 'utf8'));
const writeContent = (data) => fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
const send = (res, status, body, type='text/html; charset=utf-8') => { res.writeHead(status, { 'content-type': type }); res.end(body); };
const readBody = (req) => new Promise(resolve => { let data=''; req.on('data', c => data += c); req.on('end', () => resolve(data)); });
const isAuthed = (req) => (req.headers.cookie || '').includes('armonde_admin=1');

function layout(title, body) {
  return `<!doctype html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>${title}</title><style>
  :root{--bg:#0b0b0d;--panel:#121316;--panel2:#17181c;--line:rgba(255,255,255,.08);--text:#f5f5f5;--muted:#9ca3af;--accent:#d8b47a;--danger:#ef4444}
  *{box-sizing:border-box} body{font-family:Inter,system-ui,sans-serif;margin:0;background:linear-gradient(180deg,#0b0b0d,#101114);color:var(--text)} a{text-decoration:none;color:inherit}
  .wrap{max-width:1180px;margin:0 auto;padding:28px} .top{display:flex;justify-content:space-between;align-items:center;gap:18px;margin-bottom:22px}
  h1,h2,h3{font-family:ui-sans-serif,system-ui,sans-serif;margin:0 0 10px} p{line-height:1.6} .muted{color:var(--muted)}
  .btn{display:inline-flex;align-items:center;justify-content:center;padding:12px 18px;border-radius:14px;border:1px solid var(--line);background:var(--accent);color:#111;font-weight:700;cursor:pointer} .btn.secondary{background:transparent;color:var(--text)} .btn.danger{background:var(--danger);color:#fff}
  .grid{display:grid;gap:20px} .layout{grid-template-columns:320px 1fr} .sidebar,.panel,.project-card,.login-card{background:rgba(255,255,255,.03);border:1px solid var(--line);border-radius:24px;box-shadow:0 20px 60px rgba(0,0,0,.24)}
  .sidebar{padding:20px;position:sticky;top:24px;height:fit-content}.panel{padding:24px}.section-title{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}
  .nav-item{padding:12px 14px;border-radius:14px;color:var(--muted);display:block}.nav-item.active,.nav-item:hover{background:rgba(255,255,255,.06);color:var(--text)}
  input,textarea,select{width:100%;padding:13px 14px;border-radius:14px;border:1px solid var(--line);background:var(--panel2);color:var(--text);font:inherit} textarea{resize:vertical}
  label{display:block;font-size:.9rem;color:#d1d5db;margin:8px 0 8px}.project-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:18px}.project-card{overflow:hidden}.project-card img{width:100%;height:220px;object-fit:cover;background:#0f0f11}.project-body{padding:18px}.pill{display:inline-block;padding:7px 10px;border-radius:999px;background:rgba(216,180,122,.15);color:#f2d3a2;font-size:.8rem}.row{display:grid;grid-template-columns:1fr 1fr;gap:14px}.login-wrap{min-height:100vh;display:grid;place-items:center;padding:24px}.login-card{width:min(460px,100%);padding:28px}.composer{display:grid;gap:14px}.dropzone{border:1px dashed rgba(255,255,255,.15);border-radius:18px;padding:18px;background:rgba(255,255,255,.02)} .preview{border-radius:18px;overflow:hidden;border:1px solid var(--line)} .preview img{width:100%;height:260px;object-fit:cover}
  .toolbar{display:flex;gap:10px;flex-wrap:wrap}.helper{font-size:.85rem;color:var(--muted)} .mini{font-size:.82rem;color:var(--muted)}
  @media(max-width:980px){.layout,.row,.project-grid{grid-template-columns:1fr}.sidebar{position:static}}
  </style></head><body>${body}</body></html>`;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const content = readContent();

  if (req.method === 'GET' && url.pathname === '/') {
    return send(res, 200, layout(content.siteName, `<div class="wrap"><div class="top"><h1>${content.siteName}</h1><a class="btn" href="/admin">Open Admin</a></div><p class="muted">Admin-enabled starter for Armonde.</p></div>`));
  }

  if (req.method === 'GET' && url.pathname === '/admin/login') {
    return send(res, 200, layout('Admin Login', `<div class="login-wrap"><div class="login-card"><h1>Armonde Admin</h1><p class="muted">Sign in to manage the website.</p><form method="POST" action="/admin/login"><label>Password</label><input type="password" name="password" placeholder="Enter admin password"/><button class="btn" type="submit">Login</button></form></div></div>`));
  }

  if (req.method === 'POST' && url.pathname === '/admin/login') {
    const raw = await readBody(req); const params = new URLSearchParams(raw);
    if ((params.get('password') || '') === ADMIN_PASSWORD) { res.writeHead(302, { 'Set-Cookie': 'armonde_admin=1; HttpOnly; Path=/', Location: '/admin' }); return res.end(); }
    return send(res, 401, layout('Denied', `<div class="login-wrap"><div class="login-card"><h1>Wrong password</h1><a class="btn secondary" href="/admin/login">Try again</a></div></div>`));
  }

  if (req.method === 'GET' && url.pathname === '/admin/logout') {
    res.writeHead(302, { 'Set-Cookie': 'armonde_admin=0; Max-Age=0; Path=/', Location: '/admin/login' }); return res.end();
  }

  if (url.pathname.startsWith('/admin') && !isAuthed(req)) { res.writeHead(302, { Location: '/admin/login' }); return res.end(); }

  if (req.method === 'GET' && url.pathname === '/admin') {
    return send(res, 200, layout('Admin Panel', `
      <div class="wrap grid layout">
        <aside class="sidebar">
          <h2>ARMONDE</h2>
          <p class="mini">Premium content dashboard</p>
          <a class="nav-item active" href="/admin">Dashboard</a>
          <a class="nav-item" href="/admin/new-project">New Showcase Project</a>
          <a class="nav-item" href="/admin/settings">General Settings</a>
          <a class="nav-item" href="/admin/logout">Logout</a>
        </aside>
        <section class="grid">
          <div class="panel">
            <div class="section-title"><div><h1>Showcase Projects</h1><p class="muted">Manage what appears on the portfolio and homepage.</p></div><a class="btn" href="/admin/new-project">+ Add Project</a></div>
            <div class="project-grid">
              ${content.projects.map((p, i) => `
                <div class="project-card">
                  <img src="${p.image || ''}" alt="${p.title}" />
                  <div class="project-body">
                    <span class="pill">${p.category || 'Project'}</span>
                    <h3 style="margin-top:12px">${p.title}</h3>
                    <p class="mini">${p.location || ''} ${p.year ? '· ' + p.year : ''}</p>
                    <p>${p.description}</p>
                    <div class="toolbar">
                      <a class="btn secondary" href="/admin/edit-project?id=${i}">Edit</a>
                      <form method="POST" action="/admin/delete-project" style="display:inline"><input type="hidden" name="id" value="${i}"/><button class="btn danger" type="submit">Delete</button></form>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </section>
      </div>
    `));
  }

  if (req.method === 'GET' && url.pathname === '/admin/new-project') {
    return send(res, 200, layout('New Project', projectComposer('Create Showcase Project', '/admin/new-project', {
      title:'', category:'Residential', year:'', location:'', description:'', image:''
    })));
  }

  if (req.method === 'POST' && url.pathname === '/admin/new-project') {
    const params = new URLSearchParams(await readBody(req));
    content.projects.unshift({
      title: params.get('title') || 'Untitled Project',
      category: params.get('category') || 'Residential',
      year: params.get('year') || '',
      location: params.get('location') || '',
      description: params.get('description') || '',
      image: params.get('image') || ''
    });
    writeContent(content);
    res.writeHead(302, { Location: '/admin' }); return res.end();
  }

  if (req.method === 'GET' && url.pathname === '/admin/edit-project') {
    const id = Number(url.searchParams.get('id') || '-1');
    const project = content.projects[id];
    if (!project) return send(res, 404, layout('Missing', `<div class="wrap"><h1>Project not found</h1></div>`));
    return send(res, 200, layout('Edit Project', projectComposer('Edit Showcase Project', '/admin/edit-project', project, id)));
  }

  if (req.method === 'POST' && url.pathname === '/admin/edit-project') {
    const params = new URLSearchParams(await readBody(req));
    const id = Number(params.get('id') || '-1');
    if (!content.projects[id]) return send(res, 404, 'Not found', 'text/plain');
    content.projects[id] = {
      title: params.get('title') || '',
      category: params.get('category') || '',
      year: params.get('year') || '',
      location: params.get('location') || '',
      description: params.get('description') || '',
      image: params.get('image') || ''
    };
    writeContent(content);
    res.writeHead(302, { Location: '/admin' }); return res.end();
  }

  if (req.method === 'POST' && url.pathname === '/admin/delete-project') {
    const params = new URLSearchParams(await readBody(req));
    const id = Number(params.get('id') || '-1');
    if (id >= 0) content.projects.splice(id, 1);
    writeContent(content);
    res.writeHead(302, { Location: '/admin' }); return res.end();
  }

  if (req.method === 'GET' && url.pathname === '/admin/settings') {
    return send(res, 200, layout('Settings', `
      <div class="wrap grid layout">
        <aside class="sidebar"><h2>ARMONDE</h2><a class="nav-item" href="/admin">Dashboard</a><a class="nav-item" href="/admin/new-project">New Showcase Project</a><a class="nav-item active" href="/admin/settings">General Settings</a><a class="nav-item" href="/admin/logout">Logout</a></aside>
        <section class="panel"><h1>General Settings</h1><form method="POST" action="/admin/settings"><label>Site Name</label><input name="siteName" value="${content.siteName}"/><label>Hero Title</label><input name="heroTitle" value="${content.heroTitle}"/><label>Hero Text</label><textarea name="heroText" rows="4">${content.heroText}</textarea><label>About</label><textarea name="about" rows="5">${content.about}</textarea><label>Contact Email</label><input name="contactEmail" value="${content.contactEmail}"/><label>Instagram</label><input name="instagram" value="${content.instagram}"/><button class="btn" type="submit">Save Settings</button></form></section>
      </div>
    `));
  }

  if (req.method === 'POST' && url.pathname === '/admin/settings') {
    const params = new URLSearchParams(await readBody(req));
    content.siteName = params.get('siteName') || content.siteName;
    content.heroTitle = params.get('heroTitle') || content.heroTitle;
    content.heroText = params.get('heroText') || content.heroText;
    content.about = params.get('about') || content.about;
    content.contactEmail = params.get('contactEmail') || content.contactEmail;
    content.instagram = params.get('instagram') || content.instagram;
    writeContent(content);
    res.writeHead(302, { Location: '/admin/settings' }); return res.end();
  }

  send(res, 404, 'Not found', 'text/plain');
});

function projectComposer(title, action, project, id='') {
  return `
    <div class="wrap grid layout">
      <aside class="sidebar">
        <h2>ARMONDE</h2>
        <p class="mini">Project composer</p>
        <a class="nav-item" href="/admin">Dashboard</a>
        <a class="nav-item active" href="/admin/new-project">New Showcase Project</a>
        <a class="nav-item" href="/admin/settings">General Settings</a>
      </aside>
      <section class="grid">
        <div class="panel">
          <div class="section-title"><div><h1>${title}</h1><p class="muted">Designed to feel simple, visual, and fast — like creating a polished post.</p></div></div>
          <form class="composer" method="POST" action="${action}">
            ${id !== '' ? `<input type="hidden" name="id" value="${id}"/>` : ''}
            <div class="dropzone">
              <label>Project cover image URL</label>
              <input id="imageInput" name="image" value="${project.image || ''}" placeholder="Paste image URL here" />
              <p class="helper">Tip: use a strong wide-format architectural image. This acts like the cover visual.</p>
            </div>
            <div class="preview"><img id="imagePreview" src="${project.image || 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1200&q=80'}" alt="preview"/></div>
            <div class="row">
              <div><label>Project title</label><input name="title" value="${project.title || ''}" placeholder="Private Residence"/></div>
              <div><label>Category</label><select name="category"><option ${project.category==='Residential'?'selected':''}>Residential</option><option ${project.category==='Commercial'?'selected':''}>Commercial</option><option ${project.category==='Interior'?'selected':''}>Interior</option></select></div>
            </div>
            <div class="row">
              <div><label>Location</label><input name="location" value="${project.location || ''}" placeholder="Ulaanbaatar"/></div>
              <div><label>Year</label><input name="year" value="${project.year || ''}" placeholder="2026"/></div>
            </div>
            <div><label>Description</label><textarea name="description" rows="6" placeholder="Write a strong, short concept description...">${project.description || ''}</textarea></div>
            <div class="toolbar"><button class="btn" type="submit">Save Project</button><a class="btn secondary" href="/admin">Cancel</a></div>
          </form>
        </div>
      </section>
    </div>
    <script>
      const input = document.getElementById('imageInput');
      const preview = document.getElementById('imagePreview');
      if (input && preview) input.addEventListener('input', ()=> { preview.src = input.value || preview.src; });
    </script>
  `;
}

server.listen(PORT, () => {
  console.log(`Armonde admin site running on http://localhost:${PORT}`);
  console.log(`Admin password: ${ADMIN_PASSWORD}`);
});
