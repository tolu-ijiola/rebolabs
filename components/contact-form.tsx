"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle, Send, type LucideIcon } from "lucide-react";

const categories = [
  "Publisher support",
  "Integration help",
  "Payment question",
  "Partnership",
  "Bug report",
  "General inquiry",
];

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send message");
      }

      setSubmitStatus("success");
      setFormData({ name: "", email: "", subject: "", category: "", message: "" });
    } catch (error) {
      setSubmitStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const update = (field: keyof typeof formData, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-border bg-card p-7 shadow-[0_20px_48px_rgba(23,32,27,.08)] sm:p-9">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Name" value={formData.name} onChange={(value) => update("name", value)} required />
        <Field label="Email" type="email" value={formData.email} onChange={(value) => update("email", value)} required />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Subject" value={formData.subject} onChange={(value) => update("subject", value)} required />
        <label className="block">
          <span className="mb-2 block text-xs font-semibold text-foreground">Category</span>
          <select
            value={formData.category}
            onChange={(event) => update("category", event.target.value)}
            className="h-11 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none transition focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand-accent)]/20"
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </label>
      </div>
      <label className="block">
        <span className="mb-2 block text-xs font-semibold text-foreground">Message</span>
        <textarea
          value={formData.message}
          onChange={(event) => update("message", event.target.value)}
          required
          rows={6}
          className="w-full resize-none rounded-lg border border-border bg-card px-3 py-3 text-sm text-foreground outline-none transition focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand-accent)]/20"
          placeholder="Tell us what you're trying to do, what you expected, and what happened."
        />
      </label>
      <button type="submit" disabled={isSubmitting} className="btn-ink w-full disabled:opacity-60">
        <Send className="h-4 w-4" />
        {isSubmitting ? "Sending..." : "Send message"}
      </button>

      {submitStatus === "success" && (
        <Status icon={CheckCircle} tone="success" text="Message sent. We'll get back to you soon." />
      )}
      {submitStatus === "error" && (
        <Status icon={AlertCircle} tone="error" text={errorMessage || "Failed to send message. Please try again."} />
      )}
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold text-foreground">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none transition focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand-accent)]/20"
        required={required}
      />
    </label>
  );
}

function Status({ icon: Icon, tone, text }: { icon: LucideIcon; tone: "success" | "error"; text: string }) {
  return (
    <div
      className={`flex items-center gap-2 rounded-lg border px-4 py-3 text-sm ${
        tone === "success"
          ? "border-success/25 bg-success/5 text-success"
          : "border-destructive/25 bg-destructive/5 text-destructive"
      }`}
    >
      <Icon className="h-4 w-4" />
      {text}
    </div>
  );
}
