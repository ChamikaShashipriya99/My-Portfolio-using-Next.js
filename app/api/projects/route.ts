import { NextResponse } from 'next/server';

export const revalidate = 3600; // Cache on the edge/server for 1 hour

export async function GET() {
    try {
        const response = await fetch('https://api.github.com/users/ChamikaShashipriya99/repos?sort=updated&per_page=100', {
            next: { revalidate: 3600 }
        });
        
        if (!response.ok) {
            throw new Error(`GitHub API returned ${response.status}`);
        }

        const data = await response.json();

        const projectData = await Promise.all(data.map(async (repo: any) => {
            const branches = ['main', 'master'];
            let finalImage = `https://opengraph.githubassets.com/1/ChamikaShashipriya99/${repo.name}`;
            let readmeDesc = repo.description || 'No description provided.';

            for (const branch of branches) {
                const thumbUrl = `https://raw.githubusercontent.com/ChamikaShashipriya99/${repo.name}/${branch}/thumbnail.png`;
                const readmeUrl = `https://raw.githubusercontent.com/ChamikaShashipriya99/${repo.name}/${branch}/README.md`;

                try {
                    if (finalImage.includes('opengraph')) {
                        const imgCheck = await fetch(thumbUrl, { method: 'HEAD', next: { revalidate: 3600 } });
                        if (imgCheck.ok) finalImage = thumbUrl;
                    }

                    const readmeRes = await fetch(readmeUrl, { next: { revalidate: 3600 } });
                    if (readmeRes.ok) {
                        const text = await readmeRes.text();
                        const cleanText = text
                            .replace(/<[^>]*>?/gm, '')
                            .replace(/#.*?\n/g, '')
                            .replace(/!\[.*?\]\(.*?\)/g, '')
                            .replace(/\[.*?\]\(.*?\)/g, '')
                            .replace(/[*_~`]/g, '')
                            .trim();

                        if (cleanText.length > 50) {
                            readmeDesc = cleanText.substring(0, 180) + '...';
                        }
                    }
                } catch (e) { }
            }

            return {
                title: repo.name.replace(/-/g, ' '),
                description: readmeDesc,
                tech: repo.language ? [repo.language] : ['Web'],
                link: repo.homepage || repo.html_url,
                github: repo.html_url,
                image: finalImage
            };
        }));

        return NextResponse.json(projectData);
    } catch (error) {
        console.error('Failed to fetch repositories:', error);
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
}
