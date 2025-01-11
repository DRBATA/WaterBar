// Simplified version of the use-toast.ts file
import { useState } from "react"

type ToastProps = {
  title: string
  description: string
  variant?: "default" | "destructive"
}

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const toast = (props: ToastProps) => {
    setToasts((prevToasts) => [...prevToasts, props])
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.slice(1))
    }, 3000)
  }

  return { toast, toasts }
}

