import { useState } from "react";

type ChatMessage = {
  id: number;
  type: 'user' | 'assistant';
  content: string;
  isTyping?: boolean;
};

export default function SaasValidator() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showForm, setShowForm] = useState(true);
  const [typingText, setTypingText] = useState("");

  const typeWriter = (text: string, callback?: () => void) => {
    setTypingText("");
    let i = 0;

    const timer = setInterval(() => {
      if (i < text.length) {
        setTypingText(prev => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
        if (callback) callback();
      }
    }, 30);
  };

  const submit = async () => {
    setError(null);

    if (!title.trim() && !description.trim()) {
      setError("Escreva ao menos um título ou descrição da ideia.");
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now(),
      type: 'user',
      content: `Minha ideia que vai me deixar milionário, :\n\n${title || "Sem título"}\n\n${description}`
    };

    setMessages(prev => [...prev, userMessage]);
    setShowForm(false);
    setLoading(true);

    try {
      const systemPrompt = `Você é um crítico de ideias SaaS com humor ácido e ironia afiada. Sua missão é zoar, tirar sarro e fazer piadas sobre qualquer ideia apresentada, sem papas na língua. Seja engraçado, sarcástico e criativo. Responda sempre em português brasileiro, sem ser sério nem construtivo.`;

      const response = await fetch("/api/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Analise esta ideia de SaaS:\nTítulo: ${title || "Sem título"}\nDescrição: ${description}` }
          ],
          max_tokens: 1000,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error?.message || `Erro HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || "Não foi possível obter resposta.";

      const assistantMessage: ChatMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: reply,
        isTyping: true
      };

      setMessages(prev => [...prev, assistantMessage]);
      setLoading(false);

      typeWriter(reply, () => {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === assistantMessage.id
              ? { ...msg, isTyping: false }
              : msg
          )
        );
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido. Verifique sua chave da API e tente novamente.";
      setError(errorMessage);
      setLoading(false);
    }
  };

  const startNew = () => {
    setShowForm(true);
    setMessages([]);
    setTitle("");
    setDescription("");
    setTypingText("");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Copiado!");
    }).catch(() => {
      alert("Erro ao copiar");
    });
  };

  return (
    <div className="min-h-screen bg-white">

      <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">S</span>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">SaaS Validator</h1>
            <span className="text-xs text-gray-500 font-medium ml-2">Honestity as a Service</span>
          </div>
          {!showForm && (
            <button
              onClick={startNew}
              className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg border transition-colors"
            >
              Nova consulta
            </button>
          )}
        </div>
      </header>

      <div className="max-w-3xl mx-auto">
        {showForm && (
          <div className="px-4 py-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Valide sua ideia de SaaS
              </h2>
              <p className="text-gray-600">
                Uma IA que analisa ideias com honestidade (e um pouco de humor)
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome da ideia
                  </label>
                  <input
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                    placeholder="ex: VendaAI - O seu (in)útil CRM de vendas."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição
                  </label>
                  <textarea
                    className="w-full h-32 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none resize-none"
                    placeholder="Descreva sua ideia inovadora... Ou nem tanto."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <button
                  onClick={submit}
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
                >
                  {loading ? "Analisando..." : "Analisar ideia"}
                </button>

                {error && (
                  <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
                    {error}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {!showForm && (
          <div className="px-4 py-6">
            <div className="space-y-6">
              {messages.map((message) => (
                <div key={message.id} className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${message.type === 'user'
                      ? 'bg-blue-600'
                      : 'bg-green-600'
                      }`}>
                      <span className="text-white text-sm font-bold">
                        {message.type === 'user' ? 'V' : 'S'}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="bg-gray-50 rounded-lg p-4">
                      {message.type === 'user' ? (
                        <div className="text-gray-900 whitespace-pre-wrap">
                          {message.content}
                        </div>
                      ) : (
                        <div className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                          {message.isTyping ? typingText : message.content}
                          {message.isTyping && (
                            <span className="inline-block w-2 h-5 bg-gray-400 ml-1 animate-pulse"></span>
                          )}
                        </div>
                      )}
                    </div>
                    {message.type === 'assistant' && !message.isTyping && (
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => copyToClipboard(message.content)}
                          className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100 transition-colors"
                        >
                          Copiar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">S</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-1 text-gray-500">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

        )}

        <footer className="text-center text-sm text-gray-500 py-4">
          <div>
            feito com <span className="line-through">amor</span> sarcasmo por{" "}
            <a
              href="https://github.com/lacerdaaa"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-green-600"
            >
              @lacerdaaa
            </a>
          </div>
          <div className="mt-2">
            curta o site? financie mais respostas inúteis:{" "}
            <span className="font-mono bg-gray-100 px-2 py-1 rounded">
              edulacerdaaa@gmail.com
            </span>{" "}
            (pix)
          </div>
        </footer>

      </div>

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: #16a34a;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .slider::-moz-range-thumb {
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: #16a34a;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
}