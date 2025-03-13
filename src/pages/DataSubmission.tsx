import { useState } from "react";
import { useWebhookSettings } from "@/hooks/useWebhookSettings";
import { useBasicAuth } from "@/hooks/useBasicAuth";
import { Button } from "@/components/ui/button";

type DataSubmissionProps = {
  theme: string;
  selectedPrompt: any;
  selectedNarrative: any;
  onPrevious: () => void;
  onReset: () => void;
};

const DataSubmission = ({
  theme,
  selectedPrompt,
  selectedNarrative,
  onPrevious,
  onReset,
}: DataSubmissionProps) => {
  const { webhookUrl, testWebhook } = useWebhookSettings();
  const { generateBasicAuth } = useBasicAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<string | null>(null);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmissionResult(null);

    const data = {
      theme,
      prompt: selectedPrompt?.text,
      narrative: selectedNarrative?.text,
    };

    try {
      const authHeader = generateBasicAuth();
      if (!authHeader) {
        setSubmissionResult("Failed to generate auth header");
        return;
      }

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmissionResult("Data submitted successfully!");
      } else {
        setSubmissionResult(`Submission failed: ${response.statusText}`);
      }
    } catch (error: any) {
      setSubmissionResult(`Submission failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Data Submission</h2>
      <div className="mb-4">
        <p>
          <strong>Theme:</strong> {theme}
        </p>
        <p>
          <strong>Prompt:</strong> {selectedPrompt?.text}
        </p>
        <p>
          <strong>Narrative:</strong> {selectedNarrative?.text}
        </p>
      </div>
      {submissionResult && (
        <div className="mb-4">
          <p>{submissionResult}</p>
        </div>
      )}
      <div className="flex justify-between">
        <Button variant="secondary" onClick={onPrevious}>
          Previous
        </Button>
        <div>
          <Button
            variant="destructive"
            onClick={onReset}
            className="mr-2"
          >
            Reset
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DataSubmission;
