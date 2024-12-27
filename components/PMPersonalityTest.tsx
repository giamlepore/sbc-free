import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { ChevronRight, Flag, Check, Copy } from "lucide-react";
import { useSession } from "next-auth/react";
import {
  SCALE_OPTIONS,
  questions,
  personalityDescriptions,
  personalityDetails,
} from "@/data/pm-personality-test";

export function PMPersonalityTest() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [result, setResult] = useState<string | null>(null);
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const { data: session } = useSession();

  const copyReferralLink = async () => {
    const personalityType = result;
    const personalityDescription = personalityDescriptions[result || ""];

    const shareMessage = `🎯 Fiz o teste de personalidade para Product Managers e meu resultado foi: ${personalityType}\n\n${personalityDescription}\n\nFaça você também:`;
    const referralLink = `${window.location.origin}?ref=${session?.user?.id}`;
    const fullMessage = `${shareMessage}\n${referralLink}`;

    await navigator.clipboard.writeText(fullMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const calculatePersonalityType = () => {
    const scores = {
      EI: 0,
      SN: 0,
      TF: 0,
      JP: 0,
    };

    Object.entries(answers).forEach(([questionId, value]) => {
      const question = questions.find((q) => q.id === parseInt(questionId));
      if (!question) return;

      const score = parseInt(value);
      const weight =
        question.direction === "positive" ? score - 4 : -(score - 4);
      scores[question.dimension] += weight;
    });

    return [
      scores.EI > 0 ? "I" : "E",
      scores.SN > 0 ? "S" : "N",
      scores.TF > 0 ? "T" : "F",
      scores.JP > 0 ? "J" : "P",
    ].join("");
  };

  const handleAnswer = (value: string) => {
    setSelectedValue(value);
    setAnswers((prev) => ({ ...prev, [currentQuestion]: value }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedValue(""); // Reseta o valor selecionado
    } else {
      const type = calculatePersonalityType();
      setResult(type);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setResult(null);
    setSelectedValue("");
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (result) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto p-1 h-[600px]"
      >
        <Card className="bg-gray-800/90 backdrop-blur-sm p-4 rounded-xl shadow-xl border border-gray-700 h-full overflow-y-auto">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-6 text-indigo-400 top-0 bg-gray-800/95 py-4 backdrop-blur-sm z-10">
              Seu tipo de personalidade é: {result}
            </h2>

            <div className="pt-1 pb-2 space-y-4">
              <Button
                onClick={copyReferralLink}
                className="w-full flex items-center justify-center gap-2 bg-green-500/50 hover:bg-gray-600"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Link copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Compartilhar meu resultado e convidar PMs
                  </>
                )}
              </Button>
            </div>

            <p className="text-gray-300 mb-8 leading-relaxed">
              {personalityDescriptions[result]}
            </p>

            {result && personalityDetails[result] && (
              <div className="space-y-6 mb-8">
                <div>
                  <h3 className="text-xl font-semibold text-indigo-300 mb-3">
                    Situações Cotidianas do PM {result}
                  </h3>

                  <div className="space-y-4">
                    {personalityDetails[result].situations.map(
                      (situation, index) => (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          key={index}
                          className="border-l-4 border-indigo-500 pl-4"
                        >
                          <h4 className="text-lg font-medium text-gray-200">
                            {situation.title}
                          </h4>
                          <p className="text-gray-400 mt-2">
                            👍 Como age: {situation.action}
                          </p>
                          <p className="text-gray-400">
                            💡 Resultado: {situation.result}
                          </p>
                          <p className="text-gray-400">
                            ⚠️ Desafio: {situation.challenge}
                          </p>
                        </motion.div>
                      ),
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-indigo-300 mb-3">
                    Dicas de Desenvolvimento
                  </h3>
                  <ul className="list-disc list-inside text-gray-300 space-y-2">
                    {personalityDetails[result].tips.map((tip, index) => (
                      <motion.li
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        key={index}
                      >
                        {tip}
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-indigo-300 mb-3">
                    Pontos Fortes Únicos
                  </h3>
                  <ul className="list-disc list-inside text-gray-300 space-y-2">
                    {personalityDetails[result].strengths.map(
                      (strength, index) => (
                        <motion.li
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1 + index * 0.1 }}
                          key={index}
                        >
                          {strength}
                        </motion.li>
                      ),
                    )}
                  </ul>
                </div>
              </div>
            )}

            <div className="pt-6 pb-2 space-y-4">
              <Button
                onClick={handleRestart}
                className="w-full bg-indigo-600 hover:bg-indigo-500 transition-all duration-200 
                         py-6 text-lg font-medium shadow-lg hover:shadow-indigo-500/20"
              >
                Fazer o teste novamente
              </Button>

              <Button
                onClick={copyReferralLink}
                className="w-full flex items-center justify-center gap-2 bg-green-500/50 hover:bg-gray-600"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Link copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Compartilhar meu resultado e convidar PMs
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto p-1"
    >
      <Card className="bg-gray-800/90 backdrop-blur-sm p-8 rounded-xl shadow-xl border border-gray-700">
        {/* Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
            className="bg-green-500/50 h-2 rounded-full"
          />
        </div>

        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 text-indigo-400 mb-3">
            <span className="text-sm font-medium bg-indigo-400/10 px-2 py-1 rounded-md">
              {currentQuestion + 1}/{questions.length}
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400/50" />
            <span className="text-sm font-medium text-indigo-400/50">
              Questão
            </span>
          </div>
          <p className="text-gray-200 text-base leading-relaxed">
            {questions[currentQuestion].text}
          </p>
        </motion.div>

        <RadioGroup
          value={selectedValue}
          onValueChange={handleAnswer}
          className="space-y-1 mb-4"
        >
          {SCALE_OPTIONS.map((option, index) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              key={index}
              className="relative"
            >
              <div
                className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 border ${
                  selectedValue === option.value.toString()
                    ? "bg-green-700/20 border-green-500/50"
                    : "hover:bg-gray-700/50 border-gray-700/50 hover:border-indigo-500/50"
                }`}
              >
                <RadioGroupItem
                  value={option.value.toString()}
                  id={`option-${index}`}
                />
                <Label
                  htmlFor={`option-${index}`}
                  className={`text-gray-200 cursor-pointer flex-1 text-sm leading-relaxed ${
                    selectedValue === option.value.toString()
                      ? "text-green-100"
                      : ""
                  }`}
                >
                  {option.text}
                </Label>
              </div>
            </motion.div>
          ))}
        </RadioGroup>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            onClick={handleNext}
            disabled={!selectedValue}
            className="w-full bg-indigo-600 hover:bg-indigo-500 transition-all duration-200 
                     disabled:opacity-50 disabled:cursor-not-allowed py-6 text-lg font-medium
                     shadow-lg hover:shadow-indigo-500/20"
          >
            {currentQuestion < questions.length - 1 ? (
              <>
                Próxima pergunta
                <ChevronRight className="ml-2 h-5 w-5" />
              </>
            ) : (
              <>
                Ver resultado
                <Flag className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </motion.div>
      </Card>
    </motion.div>
  );
}
