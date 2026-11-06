import HomeShell from '@/components/ui/HomeShell';
import Hero from '@/components/ui/Hero';
import About from '@/components/ui/About';
import SkillsMarquee from '@/components/ui/SkillsMarquee';
import Projects from '@/components/ui/Projects';
import ContributionSkyline from '@/components/ui/ContributionSkyline';
import Experience from '@/components/ui/Experience';
import Contact from '@/components/ui/Contact';
import MainframeArcade from '@/components/ui/MainframeArcade';
import BusinessCard from '@/components/ui/BusinessCard';
import Footer from '@/components/ui/Footer';
import { siteDescription, siteUrl } from '@/lib/site';
export default function Home() {
    const structuredData = {
        '@context': 'https://schema.org',
        '@graph': [
            { '@type': 'Person', '@id': `${siteUrl}/#person`, name: 'Chamika Shashipriya', url: siteUrl, jobTitle: 'Full-Stack Web Developer', image: `${siteUrl}/images/chamika-portrait.webp`, sameAs: ['https://github.com/ChamikaShashipriya99', 'https://www.linkedin.com/in/chamika-shashipriya-722366321'] },
            { '@type': 'WebSite', '@id': `${siteUrl}/#website`, name: 'Chamika Shashipriya Portfolio', url: siteUrl, description: siteDescription, author: { '@id': `${siteUrl}/#person` }, inLanguage: 'en' },
            { '@type': 'ProfilePage', '@id': `${siteUrl}/#profile`, url: siteUrl, name: 'Chamika Shashipriya — Full-Stack Web Developer', mainEntity: { '@id': `${siteUrl}/#person` } },
        ],
    };
    return <main className="relative min-h-screen">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />
        <HomeShell><Hero /><About /><SkillsMarquee /><Projects /><ContributionSkyline /><Experience /><Contact /><MainframeArcade /><BusinessCard /><Footer /></HomeShell>
    </main>;
}
