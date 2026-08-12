"use client"

import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastActions,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, variant, ...props }) => (
        <Toast key={id} variant={variant} {...props}>
          {title && <ToastTitle>{title}</ToastTitle>}
          {description && <ToastDescription>{description}</ToastDescription>}
          {action && (
            <ToastActions>
              <button
                type="button"
                onClick={() => dismiss(id)}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Dismiss
              </button>
              {action}
            </ToastActions>
          )}
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  )
}
