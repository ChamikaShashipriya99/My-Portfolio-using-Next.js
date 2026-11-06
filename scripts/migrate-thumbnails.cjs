// Convert root portfolio thumbnails without removing existing PNG links.
const fs = require('node:fs/promises');
const path = require('node:path');
const os = require('node:os');
const { createHash } = require('node:crypto');
const sharp = require('sharp');
const execFile = require('node:util').promisify(require('node:child_process').execFile);
const owner = 'ChamikaShashipriya99';
const staging = path.join(os.tmpdir(), 'portfolio-thumbnail-webp-migration');

async function main() {
    const env = await fs.readFile(path.join(__dirname, '..', '.env.local'), 'utf8');
    const line = env.split(/\r?\n/).find(line => /^GITHUB_PAT\s*=/.test(line));
    const token = line?.slice(line.indexOf('=') + 1).trim().replace(/^(['"])(.*)\1$/, '$2');
    if (!token) throw new Error('GITHUB_PAT is not configured');
    async function api(resource, options = {}) {
        const response = await fetch(`https://api.github.com/${resource}`, {
            ...options,
            headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json' },
            signal: AbortSignal.timeout(30000),
        });
        if (!response.ok) throw new Error(`GitHub ${response.status}: ${resource}`);
        return response.json();
    }
    if (process.argv.includes('--apply')) {
        const report = JSON.parse(await fs.readFile(path.join(staging, 'report.json'), 'utf8'));
        for (const item of report.filter(item => item.status === 'prepared')) {
            try {
                const resource = `repos/${owner}/${item.repo}/contents`;
                const entries = await api(`${resource}?ref=${encodeURIComponent(item.branch)}`);
                const png = entries.find(entry => entry.name === item.source);
                if (png?.sha !== item.sourceSha) throw new Error('Source thumbnail changed; prepare again');
                if (entries.some(entry => entry.name.toLowerCase() === 'thumbnail.webp')) throw new Error('WebP already exists; preserved');
                const content = await fs.readFile(path.join(staging, `${item.repo}.webp`));
                const created = await api(`${resource}/thumbnail.webp`, { method: 'PUT', body: JSON.stringify({ message: 'Add optimised WebP project thumbnail', branch: item.branch, content: content.toString('base64') }) });
                const verified = await api(`${resource}/thumbnail.webp?ref=${encodeURIComponent(item.branch)}`);
                if (verified.sha !== created.content.sha || verified.size !== content.length) throw new Error('Verification mismatch');
                item.status = 'uploaded'; item.commit = created.commit.html_url;
                console.log(`Uploaded and verified: ${item.repo}`);
            } catch (error) { item.error = error.message; console.log(`Skipped: ${item.repo}: ${error.message}`); }
            await fs.writeFile(path.join(staging, 'report.json'), JSON.stringify(report, null, 2));
        }
        console.log(`Report: ${path.join(staging, 'report.json')}`);
        return;
    }
    await fs.mkdir(staging, { recursive: true });
    const repos = [];
    for (let page = 1; ; page++) {
        const batch = await api(`users/${owner}/repos?per_page=100&page=${page}`);
        repos.push(...batch); if (batch.length < 100) break;
    }
    const localImages = new Map();
    for (const directory of await fs.readdir(path.resolve(__dirname, '../..'), { withFileTypes: true })) {
        if (!directory.isDirectory()) continue;
        try {
            const bytes = await fs.readFile(path.resolve(__dirname, '../..', directory.name, 'thumbnail.png'));
            localImages.set(createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex'), bytes);
        } catch {}
    }
    const report = [];
    async function prepare(repo) {
        const item = { repo: repo.name, branch: repo.default_branch };
        try {
            if (repo.archived || !repo.permissions?.push) { item.status = 'read-only'; report.push(item); return; }
            const entries = await api(`repos/${owner}/${repo.name}/contents?ref=${encodeURIComponent(repo.default_branch)}`);
            const png = entries.find(entry => entry.type === 'file' && entry.name.toLowerCase() === 'thumbnail.png');
            if (entries.some(entry => entry.name.toLowerCase() === 'thumbnail.webp')) item.status = 'already-webp';
            else if (!png) item.status = 'no-thumbnail';
            else {
                const sourcePath = path.join(staging, `${repo.name}.png`);
                let source = localImages.get(png.sha);
                if (!source) {
                    try {
                        const bytes = await fs.readFile(sourcePath);
                        if (createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex') === png.sha) source = bytes;
                    } catch {}
                }
                if (!source && process.argv.includes('--local-only')) { item.status = 'download-needed'; report.push(item); console.log(`download-needed: ${item.repo}`); return; }
                if (!source) {
                    const chunkSize = 256 * 1024;
                    const count = Math.ceil(png.size / chunkSize);
                    const chunks = new Array(count);
                    let next = 0;
                    await Promise.all(Array.from({ length: Math.min(8, count) }, async () => {
                        while (next < count) {
                            const index = next++;
                            const start = index * chunkSize, end = Math.min(png.size - 1, start + chunkSize - 1);
                            const partPath = `${sourcePath}.part-${index}`;
                            await execFile('curl.exe', ['--silent', '--show-error', '--fail', '--location', '--retry', '2', '--range', `${start}-${end}`, '--max-time', '40', '--output', partPath, png.download_url]);
                            const bytes = await fs.readFile(partPath);
                            if (bytes.length !== end - start + 1) throw new Error('Invalid ranged download length');
                            chunks[index] = bytes;
                        }
                    }));
                    source = Buffer.concat(chunks);
                    await fs.writeFile(sourcePath, source);
                }
                if (createHash('sha1').update(`blob ${source.length}\0`).update(source).digest('hex') !== png.sha) throw new Error('Downloaded image hash mismatch');
                const result = await sharp(source).rotate().webp({ quality: 85, effort: 6 }).toBuffer();
                const metadata = await sharp(result).metadata();
                if (metadata.format !== 'webp' || !metadata.width || !metadata.height) throw new Error('Invalid conversion');
                await fs.writeFile(path.join(staging, `${repo.name}.webp`), result);
                Object.assign(item, { status: 'prepared', source: png.name, sourceSha: png.sha, before: source.length, after: result.length, width: metadata.width, height: metadata.height });
            }
        } catch (error) { item.status = 'failed'; item.error = error.message; }
        report.push(item); console.log(`${item.status}: ${item.repo}${item.error ? `: ${item.error}` : ''}${item.before ? ` (${item.before} -> ${item.after} bytes)` : ''}`);
    }
    for (let offset = 0; offset < repos.length; offset += 4) await Promise.all(repos.slice(offset, offset + 4).map(prepare));
    await fs.writeFile(path.join(staging, 'report.json'), JSON.stringify(report, null, 2));
    console.log(`Prepared only; no repositories changed. Report: ${path.join(staging, 'report.json')}`);
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
