/**
 * The tools registry.
 *
 * Every tool named in a week's `tools:` frontmatter must have an entry here — the
 * content schema validates against these keys, so a typo or an unregistered tool
 * fails the build rather than silently rendering an uncategorised chip.
 *
 * To add a tool: add one entry below, then use the exact key in week frontmatter.
 */

export const TOOL_CATEGORIES = [
  'Cloud',
  'DevOps',
  'GenAI',
  'Backend',
  'Frontend',
  'Practices',
] as const;

export type ToolCategory = (typeof TOOL_CATEGORIES)[number];

export interface Tool {
  category: ToolCategory;
  /** Optional link to official docs, used on the /skills page. */
  docs?: string;
}

export const tools = {
  // ── Cloud ────────────────────────────────────────────────────────────────
  'Amazon S3': { category: 'Cloud', docs: 'https://docs.aws.amazon.com/s3/' },
  'Amazon CloudFront': { category: 'Cloud', docs: 'https://docs.aws.amazon.com/cloudfront/' },
  'Amazon ECR': { category: 'Cloud', docs: 'https://docs.aws.amazon.com/ecr/' },
  'Amazon ECS': { category: 'Cloud', docs: 'https://docs.aws.amazon.com/ecs/' },
  'AWS IAM': { category: 'Cloud', docs: 'https://docs.aws.amazon.com/iam/' },
  'AWS Lambda': { category: 'Cloud', docs: 'https://docs.aws.amazon.com/lambda/' },
  'Amazon EC2': { category: 'Cloud', docs: 'https://docs.aws.amazon.com/ec2/' },
  'Amazon VPC': { category: 'Cloud', docs: 'https://docs.aws.amazon.com/vpc/' },
  'Amazon CloudWatch': { category: 'Cloud', docs: 'https://docs.aws.amazon.com/cloudwatch/' },
  'OpenSearch Serverless': {
    category: 'Cloud',
    docs: 'https://docs.aws.amazon.com/opensearch-service/latest/developerguide/serverless.html',
  },

  // ── DevOps ───────────────────────────────────────────────────────────────
  Docker: { category: 'DevOps', docs: 'https://docs.docker.com/' },
  'AWS CodeBuild': { category: 'DevOps', docs: 'https://docs.aws.amazon.com/codebuild/' },
  'AWS CodePipeline': { category: 'DevOps', docs: 'https://docs.aws.amazon.com/codepipeline/' },
  'GitHub Actions': { category: 'DevOps', docs: 'https://docs.github.com/actions' },
  Terraform: { category: 'DevOps', docs: 'https://developer.hashicorp.com/terraform/docs' },
  'AWS CDK': { category: 'DevOps', docs: 'https://docs.aws.amazon.com/cdk/' },

  // ── GenAI ────────────────────────────────────────────────────────────────
  'Amazon Bedrock': { category: 'GenAI', docs: 'https://docs.aws.amazon.com/bedrock/' },
  'Bedrock Agents': {
    category: 'GenAI',
    docs: 'https://docs.aws.amazon.com/bedrock/latest/userguide/agents.html',
  },
  'Bedrock Knowledge Bases': {
    category: 'GenAI',
    docs: 'https://docs.aws.amazon.com/bedrock/latest/userguide/knowledge-base.html',
  },
  'Titan Embeddings': {
    category: 'GenAI',
    docs: 'https://docs.aws.amazon.com/bedrock/latest/userguide/titan-embedding-models.html',
  },
  'Prompt engineering': { category: 'GenAI' },
  RAG: { category: 'GenAI' },

  // ── Backend ──────────────────────────────────────────────────────────────
  Java: { category: 'Backend', docs: 'https://docs.oracle.com/en/java/' },
  'Spring Boot': { category: 'Backend', docs: 'https://docs.spring.io/spring-boot/index.html' },
  Python: { category: 'Backend', docs: 'https://docs.python.org/3/' },
  PostgreSQL: { category: 'Backend', docs: 'https://www.postgresql.org/docs/' },
  'REST APIs': { category: 'Backend' },
  Maven: { category: 'Backend', docs: 'https://maven.apache.org/guides/' },

  // ── Frontend ─────────────────────────────────────────────────────────────
  React: { category: 'Frontend', docs: 'https://react.dev/' },
  TypeScript: { category: 'Frontend', docs: 'https://www.typescriptlang.org/docs/' },
  CSS: { category: 'Frontend', docs: 'https://developer.mozilla.org/en-US/docs/Web/CSS' },
  Vite: { category: 'Frontend', docs: 'https://vite.dev/' },

  // ── Practices ────────────────────────────────────────────────────────────
  Git: { category: 'Practices', docs: 'https://git-scm.com/doc' },
  'Code review': { category: 'Practices' },
  'Agile / Scrum': { category: 'Practices' },
  Testing: { category: 'Practices' },
  'Technical writing': { category: 'Practices' },
  Observability: { category: 'Practices' },
} satisfies Record<string, Tool>;

export type ToolName = keyof typeof tools;

/** All registered tool names — used by the content schema to validate frontmatter. */
export const toolNames = Object.keys(tools) as [ToolName, ...ToolName[]];

/** Stable anchor id for a tool, used by ToolChip links and /skills headings. */
export function toolSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function getTool(name: string): Tool | undefined {
  return (tools as Record<string, Tool>)[name];
}

/** Category for a tool name, falling back to 'Practices' for unknown names. */
export function categoryOf(name: string): ToolCategory {
  return getTool(name)?.category ?? 'Practices';
}
