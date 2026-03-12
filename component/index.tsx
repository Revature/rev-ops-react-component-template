import { useState } from "react";
import type { ProcessComponentProps } from "./types";

/**
 * Custom Process Form Component
 *
 * Edit this file to build your process form UI.
 * The component receives props defined in types.ts.
 *
 * Available props:
 *   record           — current record data
 *   fields           — field definitions for this process
 *   context          — execution context (objectApiName, processApiName, etc.)
 *   preProcessResult — output from pre-process step (if any)
 *   onSubmit         — call with form data to submit
 *   onCancel         — call to cancel the process
 */
export default function ProcessForm({
  fields,
  preProcessResult,
  onSubmit,
  onCancel,
}: ProcessComponentProps) {
  const [formData, setFormData] = useState<Record<string, string>>(() => {
    // Pre-fill from pre-process result if available
    const initial: Record<string, string> = {};
    if (preProcessResult) {
      for (const [key, val] of Object.entries(preProcessResult)) {
        if (val !== null && val !== undefined) {
          initial[key] = String(val);
        }
      }
    }
    return initial;
  });

  function handleChange(fieldApiName: string, value: string) {
    setFormData((prev) => ({ ...prev, [fieldApiName]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(formData);
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2 style={{ margin: 0, fontSize: "18px" }}>Custom Process Form</h2>

      {fields.map((field) => (
        <div key={field.api_name}>
          <label style={{ display: "block", marginBottom: "4px", fontSize: "14px", fontWeight: 500 }}>
            {field.name}
          </label>
          <input
            type="text"
            value={formData[field.api_name] ?? ""}
            onChange={(e) => handleChange(field.api_name, e.target.value)}
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #d1d5db",
              fontSize: "14px",
            }}
          />
        </div>
      ))}

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "8px" }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: "8px 16px",
            borderRadius: "6px",
            border: "1px solid #d1d5db",
            background: "white",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          style={{
            padding: "8px 16px",
            borderRadius: "6px",
            border: "none",
            background: "#7c3aed",
            color: "white",
            cursor: "pointer",
          }}
        >
          Submit
        </button>
      </div>
    </form>
  );
}
