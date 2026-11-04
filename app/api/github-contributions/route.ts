import { NextRequest, NextResponse } from 'next/server';

const GITHUB_GRAPHQL_URL = 'https://api.github.com/graphql';

const GITHUB_QUERY = `
  query($username: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $username) {
      contributionsCollection(from: $from, to: $to) {
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

export async function GET(request: NextRequest) {
    const now = new Date();
    const currentYear = now.getUTCFullYear();
    const year = Number(request.nextUrl.searchParams.get('year') ?? currentYear);
    if (!Number.isInteger(year) || year < 2023 || year > currentYear) {
        return NextResponse.json({ error: 'Invalid contribution year' }, { status: 400 });
    }
    const from = new Date(Date.UTC(year, 0, 1));
    const to = year === currentYear ? now : new Date(Date.UTC(year, 11, 31, 23, 59, 59));
    const username = 'ChamikaShashipriya99';
    const token = process.env.GITHUB_PAT;

    if (!token) {
        return NextResponse.json({ error: 'Data unavailable' }, { status: 503 });
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
                variables: { username, from: from.toISOString(), to: to.toISOString() }
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
            data: (() => {
                const first = from.toISOString().slice(0, 10);
                const last = to.toISOString().slice(0, 10);
                const weeks = calendar.weeks.map((week: { contributionDays: { date: string; contributionCount: number; color: string }[] }) => ({
                    contributionDays: week.contributionDays.filter(day => day.date >= first && day.date <= last)
                })).filter((week: { contributionDays: unknown[] }) => week.contributionDays.length > 0);
                return { weeks, totalContributions: weeks.reduce((sum: number, week: { contributionDays: { contributionCount: number }[] }) => sum + week.contributionDays.reduce((total, day) => total + day.contributionCount, 0), 0) };
            })()
        });

    } catch (err) {
        console.error('Error fetching real GitHub contributions:', err);
        return NextResponse.json({ error: 'Data unavailable' }, { status: 503 });
    }
}
