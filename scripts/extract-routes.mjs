// Phase 11 helper: extract every Route path from src/App.tsx and classify it.
import fs from 'fs';

const src = fs.readFileSync('src/App.tsx', 'utf8');
const routeRe = /<Route\s+path="([^"]+)"\s+element=\{([\s\S]*?)\}\s*\/>/g;
let m;
const routes = [];
while ((m = routeRe.exec(src)) !== null) {
  const [, path, element] = m;
  const roleMatch = element.match(/ProtectedRoute\s+role="(\w+)"/);
  routes.push({
    path,
    role: roleMatch ? roleMatch[1] : 'public',
    shell: /PortalSidebar/.test(element),
    redirect: /<Navigate\s+to="([^"]+)"/.exec(element)?.[1] ?? null,
  });
}
// de-dup by path (first definition wins in React Router v6)
const seen = new Set();
const unique = routes.filter((r) => !seen.has(r.path) && !!seen.add(r.path));
fs.writeFileSync('scripts/routes.json', JSON.stringify(unique, null, 2));
console.log(`total <Route> defs: ${routes.length}, unique paths: ${unique.length}`);
console.log(
  'shelled:', unique.filter((r) => r.shell).length,
  '| redirects:', unique.filter((r) => r.redirect).length,
  '| unshelled protected:',
  unique.filter((r) => r.role !== 'public' && !r.shell && !r.redirect).map((r) => r.path).join(', ')
);
