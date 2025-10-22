"use server";

import { eq } from "drizzle-orm";

import { db, schema } from "@treeproai/db";

import { getActiveOrg } from "@/lib/get-active-org";

type TrainingSummary = {
  totalExamples: number;
  segments: {
    customers: number;
    leads: number;
    quotes: number;
    jobs: number;
    knowledgeBase: number;
  };
};

type TrainingSample = {
  id: string;
  type: string;
  content: string;
};

export type TrainingServiceStatus = {
  key: string;
  label: string;
  ready: boolean;
  records: number;
  description: string;
};

export type TrainingResult = {
  ok: boolean;
  message: string;
  summary?: TrainingSummary;
  sample?: TrainingSample[];
  services?: TrainingServiceStatus[];
};

function formatDate(value: Date | string | null | undefined) {
  if (!value) {
    return "Unknown";
  }

  try {
    const date = typeof value === "string" ? new Date(value) : value;
    return date.toISOString();
  } catch {
    return "Unknown";
  }
}

function normalizeLineItems(raw: unknown) {
  if (!raw) {
    return [] as { description?: string; quantity?: number }[];
  }

  if (Array.isArray(raw)) {
    return raw as { description?: string; quantity?: number }[];
  }

  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  if (typeof raw === "object" && raw !== null && "items" in raw) {
    const items = (raw as { items?: unknown }).items;
    return Array.isArray(items) ? (items as { description?: string; quantity?: number }[]) : [];
  }

  return [] as { description?: string; quantity?: number }[];
}

function truncateContent(content: string, limit = 240) {
  if (content.length <= limit) {
    return content;
  }
  return `${content.slice(0, limit - 1)}…`;
}

export async function trainAiCore(): Promise<TrainingResult> {
  const activeOrgId = await getActiveOrg();

  if (!activeOrgId) {
    return {
      ok: false,
      message: "Active organization not detected. Please select or create an organization to train against.",
    };
  }

  const [customers, leads, quotes, jobs, knowledgeBase] = await Promise.all([
    db
      .select({
        id: schema.customers.id,
        name: schema.customers.name,
        email: schema.customers.email,
        phone: schema.customers.phone,
        address: schema.customers.address,
        createdAt: schema.customers.createdAt,
      })
      .from(schema.customers)
      .where(eq(schema.customers.orgId, activeOrgId)),
    db
      .select({
        id: schema.leads.id,
        name: schema.leads.name,
        email: schema.leads.email,
        phone: schema.leads.phone,
        source: schema.leads.source,
        status: schema.leads.status,
        createdAt: schema.leads.createdAt,
      })
      .from(schema.leads)
      .where(eq(schema.leads.orgId, activeOrgId)),
    db
      .select({
        id: schema.quotes.id,
        customerId: schema.quotes.customerId,
        status: schema.quotes.status,
        total: schema.quotes.total,
        lineItems: schema.quotes.lineItems,
        createdAt: schema.quotes.createdAt,
      })
      .from(schema.quotes)
      .where(eq(schema.quotes.orgId, activeOrgId)),
    db
      .select({
        id: schema.jobs.id,
        customerId: schema.jobs.customerId,
        status: schema.jobs.status,
        description: schema.jobs.description,
        scheduledDate: schema.jobs.scheduledDate,
        createdAt: schema.jobs.createdAt,
      })
      .from(schema.jobs)
      .where(eq(schema.jobs.orgId, activeOrgId)),
    db
      .select({
        id: schema.kbChunks.id,
        content: schema.kbChunks.content,
        sourceRef: schema.kbChunks.sourceRef,
        createdAt: schema.kbChunks.createdAt,
      })
      .from(schema.kbChunks)
      .where(eq(schema.kbChunks.orgId, activeOrgId)),
  ]);

  const dataset: TrainingSample[] = [];

  customers.forEach((customer) => {
    dataset.push({
      id: customer.id,
      type: "customer_profile",
      content: [
        `Name: ${customer.name}`,
        customer.email ? `Email: ${customer.email}` : null,
        customer.phone ? `Phone: ${customer.phone}` : null,
        customer.address ? `Address: ${customer.address}` : null,
        `Customer since: ${formatDate(customer.createdAt)}`,
      ]
        .filter(Boolean)
        .join(" | "),
    });
  });

  leads.forEach((lead) => {
    dataset.push({
      id: lead.id,
      type: "lead_record",
      content: [
        `Lead: ${lead.name}`,
        lead.email ? `Email: ${lead.email}` : null,
        lead.phone ? `Phone: ${lead.phone}` : null,
        lead.source ? `Source: ${lead.source}` : "Source unknown",
        `Status: ${lead.status}`,
        `Created: ${formatDate(lead.createdAt)}`,
      ]
        .filter(Boolean)
        .join(" | "),
    });
  });

  quotes.forEach((quote) => {
    const items = normalizeLineItems(quote.lineItems);

    dataset.push({
      id: quote.id,
      type: "quote",
      content: [
        `Customer: ${quote.customerId}`,
        `Status: ${quote.status}`,
        `Total: ${quote.total ?? "0"}`,
        items.length > 0
          ? `Line items: ${items
              .map((item) => `${item.description ?? "Service"} x${item.quantity ?? 1}`)
              .join(", ")}`
          : null,
        `Created: ${formatDate(quote.createdAt)}`,
      ]
        .filter(Boolean)
        .join(" | "),
    });
  });

  jobs.forEach((job) => {
    dataset.push({
      id: job.id,
      type: "job",
      content: [
        `Customer: ${job.customerId}`,
        `Status: ${job.status}`,
        job.description ? `Details: ${job.description}` : null,
        `Scheduled: ${job.scheduledDate ? formatDate(job.scheduledDate) : "Scheduling pending"}`,
        `Created: ${formatDate(job.createdAt)}`,
      ]
        .filter(Boolean)
        .join(" | "),
    });
  });

  knowledgeBase.forEach((chunk) => {
    dataset.push({
      id: chunk.id,
      type: "knowledge_base",
      content: [
        chunk.sourceRef ? `Source: ${chunk.sourceRef}` : "Knowledge base entry",
        truncateContent(chunk.content),
        `Indexed: ${formatDate(chunk.createdAt)}`,
      ]
        .filter(Boolean)
        .join(" | "),
    });
  });

  const summary: TrainingSummary = {
    totalExamples: dataset.length,
    segments: {
      customers: customers.length,
      leads: leads.length,
      quotes: quotes.length,
      jobs: jobs.length,
      knowledgeBase: knowledgeBase.length,
    },
  };

  const services: TrainingServiceStatus[] = [
    {
      key: "customers",
      label: "Customer CRM",
      ready: customers.length > 0,
      records: customers.length,
      description: customers.length > 0
        ? "Customer profiles will enrich personalization prompts."
        : "Add customer records to personalize AI output.",
    },
    {
      key: "leads",
      label: "Lead Management",
      ready: leads.length > 0,
      records: leads.length,
      description: leads.length > 0
        ? "Lead funnel data improves follow-up recommendations."
        : "Capture leads to train follow-up strategies.",
    },
    {
      key: "quotes",
      label: "Quote Engine",
      ready: quotes.length > 0,
      records: quotes.length,
      description: quotes.length > 0
        ? "Quote history tunes pricing and scope suggestions."
        : "Generate quotes to calibrate AI proposals.",
    },
    {
      key: "jobs",
      label: "Job Operations",
      ready: jobs.length > 0,
      records: jobs.length,
      description: jobs.length > 0
        ? "Job data enhances scheduling and crew planning insights."
        : "Schedule jobs to unlock operational coaching.",
    },
    {
      key: "knowledge_base",
      label: "Knowledge Base",
      ready: knowledgeBase.length > 0,
      records: knowledgeBase.length,
      description: knowledgeBase.length > 0
        ? "Your documents are ready for semantic search."
        : "Ingest SOPs and playbooks to power the knowledge engine.",
    },
  ];

  const sample = dataset.slice(0, 5);

  console.info("[AI TRAINING] Prepared dataset for org", {
    activeOrgId,
    summary,
  });

  return {
    ok: dataset.length > 0,
    message:
      dataset.length > 0
        ? "Training dataset prepared successfully."
        : "No AI-ready data found. Populate CRM, quoting, jobs, or knowledge base to begin training.",
    summary,
    sample,
    services,
  };
}

