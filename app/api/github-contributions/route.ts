import { NextResponse } from 'next/server';

const GITHUB_GRAPHQL_URL = 'https://api.github.com/graphql';

const GITHUB_QUERY = `
  query($username: String!) {
    user(login: $username) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
              color
            }
          }
        }
      }
    }
  }
`;

// Helper to generate realistic mock contributions when GITHUB_PAT is missing
function generateMockContributions() {
    const weeks = [];
    let totalContributions = 0;
    const endDate = new Date();
    // Start date is 364 days ago (52 weeks)
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 364);

    const current = new Date(startDate);

    for (let w = 0; w < 52; w++) {
        const contributionDays = [];
        for (let d = 0; d < 7; d++) {
            const dateStr = current.toISOString().split('T')[0];
            const isWeekend = current.getDay() === 0 || current.getDay() === 6;
            
            // Generate counts with weight distributions:
            // - Weekends: 60% chance of 0, 30% chance of 1, 10% chance of 2-3
            // - Weekdays: 20% chance of 0, 40% chance of 1-3, 30% chance of 4-6, 10% chance of 7-10 (high productivity days)
            let count = 0;
            const rand = Math.random();

            if (isWeekend) {
                if (rand > 0.6 && rand <= 0.9) count = 1;
                else if (rand > 0.9) count = Math.floor(Math.random() * 2) + 2; // 2 or 3
            } else {
                if (rand > 0.2 && rand <= 0.6) count = Math.floor(Math.random() * 3) + 1; // 1-3
                else if (rand > 0.6 && rand <= 0.9) count = Math.floor(Math.random() * 3) + 4; // 4-6
                else if (rand > 0.9) count = Math.floor(Math.random() * 4) + 7; // 7-10
            }

            // Introduce occasional vacation weeks (0 commits for the whole week)
            // Or heavy coding sprints (double commits)
            // Let's add simple cycle variation
            const cycleFactor = Math.sin(w / 4) * 0.5 + 0.5; // oscillate between 0 and 1
            if (cycleFactor < 0.15) {
                count = 0; // vacation/break period
            } else if (cycleFactor > 0.85 && count > 0) {
                count = Math.min(count * 2, 12); // sprint period
            }

            totalContributions += count;

            // Map counts to GitHub-like palette colors
            let color = '#161b22'; // 0 commits
            if (count > 0 && count <= 2) color = '#0e4429';
            else if (count > 2 && count <= 4) color = '#006d32';
            else if (count > 4 && count <= 6) color = '#26a641';
            else if (count > 6) color = '#39d353';

            contributionDays.push({
                date: dateStr,
                contributionCount: count,
                color
            });

            // Move to next day
            current.setDate(current.getDate() + 1);
        }
        weeks.push({ contributionDays });
    }

    return {
        totalContributions,
        weeks
    };
}

export async function GET() {
    const username = 'ChamikaShashipriya99';
    const token = process.env.GITHUB_PAT;

    if (!token) {
        // Fallback to high-quality mock data so the portfolio works zero-setup
        console.log('GITHUB_PAT not configured. Serving simulated contribution skyline.');
        return NextResponse.json({ 
            source: 'mocked', 
            data: generateMockContributions() 
        });
    }

    try {
        const res = await fetch(GITHUB_GRAPHQL_URL, {
            method: 'POST',
            headers: {
                'Authorization': `bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: GITHUB_QUERY,
                variables: { username }
            }),
            next: { revalidate: 86400 } // Cache response for 24 hours
        });

        if (!res.ok) {
            throw new Error(`GitHub GraphQL API responded with status ${res.status}`);
        }

        const json = await res.json();

        if (json.errors) {
            console.error('GitHub GraphQL errors:', json.errors);
            throw new Error('GraphQL Errors detected');
        }

        const calendar = json.data?.user?.contributionsCollection?.contributionCalendar;
        
        if (!calendar) {
            throw new Error('Failed to parse contribution calendar from GitHub API response');
        }

        return NextResponse.json({
            source: 'github',
            data: calendar
        });

    } catch (err: any) {
        console.error('Error fetching real GitHub contributions:', err);
        return NextResponse.json({ 
            source: 'mocked_fallback', 
            data: generateMockContributions() 
        });
    }
}
