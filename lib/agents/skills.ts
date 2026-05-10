import type { AgentSkill } from "./types";

export const SKILLS: Record<string, AgentSkill[]> = {
  marketing: [
    { id: "seo-audit", name: "SEO Audit", description: "Full website SEO analysis", category: "marketing" },
    { id: "content-calendar", name: "Content Calendar", description: "Plan and schedule content", category: "marketing" },
    { id: "ad-campaign", name: "Ad Campaigns", description: "Create and optimize ad campaigns", category: "marketing" },
    { id: "social-metrics", name: "Social Metrics", description: "Track social media performance", category: "marketing" },
    { id: "competitor-analysis", name: "Competitor Analysis", description: "Analyze competitor strategies", category: "marketing" },
  ],
  seo: [
    { id: "keyword-research", name: "Keyword Research", description: "Find high-value keywords", category: "seo" },
    { id: "on-page-seo", name: "On-Page SEO", description: "Optimize page content and structure", category: "seo" },
    { id: "backlink-analysis", name: "Backlink Analysis", description: "Analyze and build backlinks", category: "seo" },
    { id: "technical-seo", name: "Technical SEO", description: "Fix technical SEO issues", category: "seo" },
    { id: "rank-tracking", name: "Rank Tracking", description: "Monitor keyword rankings", category: "seo" },
  ],
  design: [
    { id: "brand-identity", name: "Brand Identity", description: "Create visual brand systems", category: "design" },
    { id: "ui-design", name: "UI Design", description: "Design user interfaces", category: "design" },
    { id: "motion-graphics", name: "Motion Graphics", description: "Create animated visuals", category: "design" },
    { id: "design-system", name: "Design System", description: "Build component libraries", category: "design" },
    { id: "prototyping", name: "Prototyping", description: "Create interactive prototypes", category: "design" },
  ],
  development: [
    { id: "code-review", name: "Code Review", description: "Review and improve code quality", category: "development" },
    { id: "frontend-code", name: "Frontend Development", description: "Build responsive UIs", category: "development" },
    { id: "api-development", name: "API Development", description: "Design and build APIs", category: "development" },
    { id: "testing", name: "Testing", description: "Write and run tests", category: "development" },
    { id: "deployment", name: "Deployment", description: "Deploy applications", category: "development" },
  ],
  copywriting: [
    { id: "landing-page", name: "Landing Pages", description: "Write high-converting landing pages", category: "copywriting" },
    { id: "email-sequence", name: "Email Sequences", description: "Write email nurture sequences", category: "copywriting" },
    { id: "ad-copy", name: "Ad Copy", description: "Write compelling ad copy", category: "copywriting" },
    { id: "blog-post", name: "Blog Posts", description: "Write SEO-optimized blog content", category: "copywriting" },
    { id: "social-content", name: "Social Content", description: "Create social media content", category: "copywriting" },
  ],
  analytics: [
    { id: "dashboard-creation", name: "Dashboard Creation", description: "Build data dashboards", category: "analytics" },
    { id: "data-analysis", name: "Data Analysis", description: "Analyze datasets for insights", category: "analytics" },
    { id: "kpi-tracking", name: "KPI Tracking", description: "Define and track KPIs", category: "analytics" },
    { id: "reporting", name: "Reporting", description: "Create automated reports", category: "analytics" },
    { id: "ab-testing", name: "A/B Testing", description: "Design and analyze experiments", category: "analytics" },
  ],
  social: [
    { id: "community-mgmt", name: "Community Management", description: "Manage online communities", category: "social" },
    { id: "content-scheduling", name: "Content Scheduling", description: "Schedule social posts", category: "social" },
    { id: "engagement-analysis", name: "Engagement Analysis", description: "Analyze engagement metrics", category: "social" },
    { id: "influencer-outreach", name: "Influencer Outreach", description: "Connect with influencers", category: "social" },
  ],
  qa: [
    { id: "test-planning", name: "Test Planning", description: "Create test plans and strategies", category: "qa" },
    { id: "regression-testing", name: "Regression Testing", description: "Run regression test suites", category: "qa" },
    { id: "performance-testing", name: "Performance Testing", description: "Test application performance", category: "qa" },
    { id: "bug-reporting", name: "Bug Reporting", description: "Document and track bugs", category: "qa" },
  ],
};

export function getSkillsForDepartment(dept: string): AgentSkill[] {
  return SKILLS[dept] || [];
}

export function getAllSkills(): AgentSkill[] {
  return Object.values(SKILLS).flat();
}
