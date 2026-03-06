import { useCallback, useEffect, useState } from "react";
import {
  data,
  useActionData,
  useNavigation,
} from "react-router";
import type { Route } from "./+types/_index";
import { appendExpense } from "~/lib/sheets.server";
import { expenseSchema } from "~/lib/validation";
import { ExpenseForm } from "~/components/expense-form";
import { Toast } from "~/components/toast";
import { log } from "~/lib/logger.server";

type ActionData =
  | {
      success: true;
      entry: {
        date: string;
        amount: number;
        category: string;
        method: string;
        user: string;
        note: string;
      };
    }
  | { success: false; errors: Record<string, string> }
  | { success: false; error: string };

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const raw = {
    date: formData.get("date") as string,
    amount: formData.get("amount") as string,
    category: formData.get("category") as string,
    method: formData.get("method") as string,
    user: formData.get("user") as string,
    note: formData.get("note") as string,
  };

  const result = expenseSchema.safeParse(raw);

  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0] as string;
      if (!fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    return data({ success: false as const, errors: fieldErrors });
  }

  const parsed = result.data;
  const row = [
    new Date().toISOString(),
    parsed.user,
    parsed.category,
    String(parsed.amount),
    parsed.method,
    parsed.note,
    parsed.date,
  ];

  try {
    await appendExpense(row);
    return data({
      success: true as const,
      entry: {
        date: parsed.date,
        amount: parsed.amount,
        category: parsed.category,
        method: parsed.method,
        user: parsed.user,
        note: parsed.note,
      },
    });
  } catch (err) {
    log("error", "action_append_error", {
      error: (err as Error).message,
    });
    return data(
      { success: false as const, error: "Failed to save. Please try again." },
      { status: 500 },
    );
  }
}

export default function Index() {
  const actionData = useActionData<typeof action>() as ActionData | undefined;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const [formKey, setFormKey] = useState(0);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
    visible: boolean;
  }>({ message: "", type: "success", visible: false });

  const dismissToast = useCallback(
    () => setToast((prev) => ({ ...prev, visible: false })),
    [],
  );

  useEffect(() => {
    if (!actionData) return;

    if (actionData.success) {
      setToast({
        message: `Saved: ${actionData.entry.category} — IDR ${actionData.entry.amount.toLocaleString()}`,
        type: "success",
        visible: true,
      });
      setFormKey((k) => k + 1);
    } else if ("error" in actionData && actionData.error) {
      setToast({
        message: actionData.error,
        type: "error",
        visible: true,
      });
    }
  }, [actionData]);

  const errors =
    actionData && !actionData.success && "errors" in actionData
      ? actionData.errors
      : undefined;

  return (
    <main className="mx-auto min-h-screen max-w-md bg-white">
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onDismiss={dismissToast}
      />
      <header className="px-4 pt-6 pb-2">
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          DuitLog
        </h1>
      </header>
      <ExpenseForm
        key={formKey}
        errors={errors}
        isSubmitting={isSubmitting}
        defaultUser="Danny"
      />
    </main>
  );
}
