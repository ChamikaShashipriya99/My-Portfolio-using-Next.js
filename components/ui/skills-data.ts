import type { IconType } from 'react-icons';
import {
    SiJavascript, SiPython, SiC, SiCplusplus, SiSharp, SiPhp,
    SiKotlin, SiHtml5, SiCss3, SiMongodb, SiMysql,
    SiXampp, SiGit, SiGithub, SiNpm, SiFigma, SiCanva,
    SiCisco, SiTrello, SiNodemon, SiApachetomcat, SiReact, SiNodedotjs,
    SiExpress, SiBootstrap, SiTailwindcss, SiDotnet, SiSpringboot,
    SiJsonwebtokens, SiCodeigniter, SiWordpress, SiNextdotjs
} from 'react-icons/si';
import { FaJava, FaServer, FaDatabase } from 'react-icons/fa';
const originalCategories = [
    {
        title: "Programming Languages",
        skills: [
            { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
            { name: "Java", icon: FaJava, color: "#007396" },
            { name: "Python", icon: SiPython, color: "#3776AB" },
            { name: "C", icon: SiC, color: "#A8B9CC" },
            { name: "C++", icon: SiCplusplus, color: "#00599C" },
            { name: "C#", icon: SiSharp, color: "#239120" },
            { name: "PHP", icon: SiPhp, color: "#777BB4" },
            { name: "Kotlin", icon: SiKotlin, color: "#7F52FF" },
            { name: "HTML5", icon: SiHtml5, color: "#E34F26" },
            { name: "CSS3", icon: SiCss3, color: "#1572B6" },
        ]
    },
    {
        title: "Databases & Servers",
        skills: [
            { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
            { name: "MySQL", icon: SiMysql, color: "#4479A1" },
            { name: "MS SQL Server", icon: FaDatabase, color: "#CC2927" },
            { name: "XAMPP", icon: SiXampp, color: "#FB7A24" },
            { name: "WAMP", icon: FaServer, color: "#FFFFFF" },
        ]
    },
    {
        title: "Frameworks & Platforms",
        skills: [
            { name: "Next.js",     icon: SiNextdotjs,   color: "#ffffff" },
            { name: "React",       icon: SiReact,       color: "#61DAFB" },
            { name: "Node.js",     icon: SiNodedotjs,   color: "#339933" },
            { name: "Express.js",  icon: SiExpress,     color: "#FFFFFF" },
            { name: "Bootstrap",   icon: SiBootstrap,   color: "#7952B3" },
            { name: "Tailwind",    icon: SiTailwindcss, color: "#06B6D4" },
            { name: ".NET",        icon: SiDotnet,      color: "#512BD4" },
            { name: "Spring",      icon: SiSpringboot,  color: "#6DB33F" },
            { name: "JWT",         icon: SiJsonwebtokens, color: "#FFFFFF" },
            { name: "CodeIgniter", icon: SiCodeigniter, color: "#EE4323" },
            { name: "WordPress",   icon: SiWordpress,   color: "#21759B" },
        ]
    },
    {
        title: "Tools & IDE's",
        skills: [
            { name: "Git", icon: SiGit, color: "#F05032" },
            { name: "GitHub", icon: SiGithub, color: "#FFFFFF" },
            { name: "NPM", icon: SiNpm, color: "#CB3837" },
            { name: "Figma", icon: SiFigma, color: "#F24E1E" },
            { name: "Canva", icon: SiCanva, color: "#00C4CC" },
            { name: "Cisco", icon: SiCisco, color: "#1BA0D7" },
            { name: "Trello", icon: SiTrello, color: "#0052CC" },
            { name: "Nodemon", icon: SiNodemon, color: "#76D04B" },
            { name: "Apache Tomcat", icon: SiApachetomcat, color: "#F8DC75" },
        ]
    }
];


export interface Skill { name: string; icon: IconType; color: string }
const all: Skill[] = originalCategories.flatMap(category => category.skills);
const group = (names: string[]) => names.map(name => all.find(skill => skill.name === name)!).filter(Boolean);
export const skillCategories = [
    { title: 'Frontend', description: 'Responsive layouts and interactive web interfaces.', skills: group(['React', 'Next.js', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind', 'Bootstrap']) },
    { title: 'Backend', description: 'Server-side applications, API development, and authentication.', skills: group(['Node.js', 'Express.js', 'PHP', '.NET', 'Spring', 'CodeIgniter', 'JWT', 'WordPress']) },
    { title: 'Databases', description: 'Store, organise, and query application data.', skills: group(['MongoDB', 'MySQL', 'MS SQL Server']) },
    { title: 'Mobile', description: 'Native Android application development.', skills: group(['Kotlin']) },
    { title: 'Languages', description: 'Additional programming languages in my toolkit.', skills: group(['Java', 'Python', 'C', 'C++', 'C#']) },
    { title: 'Tools', description: 'Version control, design, and local development workflows.', skills: group(['Git', 'GitHub', 'NPM', 'Figma', 'Canva', 'Cisco', 'Trello', 'Nodemon', 'Apache Tomcat', 'XAMPP', 'WAMP']) }
];
export const mainStack = group(['MongoDB', 'Express.js', 'React', 'Node.js']);
const pawTracker = 'PawTracker_Oniline-Pet-Care-Management-System';
// Explicit mappings use project descriptions, source configuration, and the supplied CV.
export const skillEvidence: Record<string, { slug: string; title: string }[]> = {
    'MongoDB': [{ slug: pawTracker, title: 'PawTracker — pet care management' }],
    'Express.js': [{ slug: pawTracker, title: 'PawTracker — pet care management' }],
    'React': [{ slug: pawTracker, title: 'PawTracker — pet care management' }, { slug: 'My-Portfolio-using-Next.js', title: 'This portfolio' }],
    'Node.js': [{ slug: pawTracker, title: 'PawTracker — pet care management' }],
    'Next.js': [{ slug: 'My-Portfolio-using-Next.js', title: 'This portfolio' }],
    'Tailwind': [{ slug: 'My-Portfolio-using-Next.js', title: 'This portfolio' }],
    'PHP': [{ slug: 'DoRegister-Pluging-for-WordPress-', title: 'DoRegister — registration plugin' }],
    'WordPress': [{ slug: 'DoRegister-Pluging-for-WordPress-', title: 'DoRegister — registration plugin' }],
    'MySQL': [{ slug: 'DoRegister-Pluging-for-WordPress-', title: 'DoRegister — registration plugin' }],
    'Kotlin': [{ slug: 'PersonalFinanceTracker', title: 'Personal Finance Tracker — Android' }],
};
