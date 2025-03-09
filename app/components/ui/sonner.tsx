"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          // Bazowe style dla wszystkich toastów
          toast: `
            group toast 
            bg-[#0a0a0a]
            border border-[#404040]
            text-[#ffffff]
            shadow-xl
            backdrop-blur-lg
          `,

          // Styl dla opisu
          description: "text-[#b3b3b3]",

          // Przycisk akcji
          actionButton: `
            bg-[#FF6B6B] 
            text-white
            hover:bg-[#CC5555]
            transition-colors
          `,

          // Przycisk anulowania
          cancelButton: `
            bg-[#1a1a1a]
            text-[#b3b3b3]
            hover:bg-[#2a2a2a]
          `,

          // Customowe style dla typów toastów
          success: `
            !bg-[#1a2f1a]
            !border-[#2d6044]
            [&>svg]:text-[#4ade80]
          `,

          error: `
            !bg-[#2f1a1a]
            !border-[#602d2d]
            [&>svg]:text-[#de4a4a]
          `,

          // Styl dla ikony ładowania
          loading: "[&>svg]:text-[#FF6B6B]",

          // Styl dla ikony zamknięcia
          closeButton: `
            text-[#b3b3b3]
            hover:bg-[#2a2a2a]
            hover:text-[#FF6B6B]
          `,
        },
      }}
      duration={3000}
      {...props}
    />
  );
};

export { Toaster };
