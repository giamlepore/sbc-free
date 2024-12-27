"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function PurchaseComplete() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/update-access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setIsCompleted(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocorreu um erro ao processar seu acesso");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Background Page */}
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#111111] text-gray-200 px-4 relative">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(75 85 99 / 0.2) 1px, transparent 0)`,
            backgroundSize: "24px 24px",
          }}
        />

        <div className="max-w-4xl w-full space-y-12 text-center relative z-10">
          <div className="flex justify-center">
            <div className="bg-gray-800 p-1 rounded-xl">
              <img src="/logo-sbc.png" alt="SBC Logo" className="h-12 w-auto" />
            </div>
            <span className="inline-flex items-center px-4 py-2 rounded-full text-xs font-medium text-gray-200">
              SBC SCHOOL (SKEPTICAL BUT CURIOUS)
            </span>
          </div>

          <h1 className="text-4xl md:text-7xl font-bold tracking-tight text-gray-200 leading-tight">
            Alavanque sua carreira
            <br />
            <span className="text-gray-500">como Tech PM.</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Se você dedicar tempo e for consistente, vamos te ajudar a se
            posicionar melhor em conversas técnicas e ter mais autonomia.
          </p>
        </div>
      </div>

      {/* Modal Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <AnimatePresence mode="wait">
          {!isCompleted ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full"
            >
              <h1 className="text-2xl font-bold text-gray-200 mb-4">
                Parabéns pela sua compra!
              </h1>
              <p className="text-gray-300 mb-6">
                Digite o e-mail Google que você deseja usar para acessar o
                curso:
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full bg-gray-700 text-gray-200"
                  required
                />
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processando..." : "Receber acesso"}
                </Button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full text-center"
            >
              <div className="mb-4 flex justify-center">
                <div className="bg-green-500 rounded-full p-2">
                  <Check className="h-8 w-8 text-white" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-gray-200 mb-4">
                Seu acesso foi autorizado!
              </h2>
              <Button
                onClick={() =>
                  (window.location.href = "https://sbc-free.vercel.app")
                }
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                Acessar a plataforma
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
