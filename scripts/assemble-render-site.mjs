import { cp, mkdir, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const publishRoot = resolve(repoRoot, 'render-dist');
const landingBuild = resolve(repoRoot, 'parallax-portfolio/dist-main');
const portfolioBuild = resolve(repoRoot, 'parallax-portfolio/dist-portfolio');

await rm(publishRoot, { recursive: true, force: true });
await mkdir(publishRoot, { recursive: true });

await cp(landingBuild, publishRoot, { recursive: true, force: true });
await cp(resolve(landingBuild, 'index.html'), resolve(publishRoot, '404.html'));

await mkdir(resolve(publishRoot, 'portfolio'), { recursive: true });
await cp(portfolioBuild, resolve(publishRoot, 'portfolio'), {
    recursive: true,
    force: true,
});
