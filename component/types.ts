/**
 * Props contract for Rev-Ops process components.
 *
 * Your default export receives these props when rendered
 * inside a process flow.
 */

export interface ProcessComponentProps {
  /** The current record data (may be empty on create flows). */
  record: Record<string, any>;

  /** Field definitions selected for this process. */
  fields: FieldDefinition[];

  /** Execution context — identifiers for the current run. */
  context: {
    objectApiName: string;
    processApiName: string;
    userId: string;
    executionId: string;
  };

  /** Output from the pre-process step, if one ran. */
  preProcessResult?: Record<string, any>;

  /** Call this with form data to submit and trigger post-process. */
  onSubmit: (formData: Record<string, any>) => void;

  /** Call this to cancel and close the process modal. */
  onCancel: () => void;
}

export interface FieldDefinition {
  api_name: string;
  name: string;
  field_type: string;
  required?: boolean;
  options?: Record<string, unknown>;
}
