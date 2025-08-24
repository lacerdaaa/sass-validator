import { useState } from "react";

type Entry = {
  id: number;
  title: string;
  description: string;
  tone: number;
  reply: string;
};

export default function SaasValidator() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tone, setTone] = useState(7);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Entry | null>(null);
  const [history, setHistory] = useState<Entry[]>([]);

  const buildPrompt = (title: string, description: string, tone: number) => {
    return [
      {
        role: "system",
        content:
          "You are a deliberately biased, sarcastic, and humorous AI called the 'SaaS Validator'. Your job is to judge SaaS ideas quickly and with personality. Be concise, witty, and occasionally harsh — but provide one practical suggestion to actually improve the idea. Do not be abusive or hateful. Keep responses under 220 words. Response in PT-BR."
      },
      {
        role: "user",
        content: `Idea: ${title}\n\nDescription: ${description}\n\nTone level: ${tone} (1 = supportive, 10 = brutally sarcastic).`,
      }
    ];
  };

  const submit = async () => {
    setError(null);
    setResult(null);

    if (!title.trim() && !description.trim()) {
      setError("Escreva ao menos um título ou descrição da ideia.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer `,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: buildPrompt(title, description, tone),
          max_tokens: 512,
          temperature: 0.8
        })
      });

      if (!response.ok) {
        throw new Error("Falha ao conectar à API.");
      }

      const data = await response.json();
      const assistantText = data.choices?.[0]?.message?.content || "Sem resposta da IA.";

      const entry: Entry = {
        id: Date.now(),
        title: title || "(sem título)",
        description: description,
        tone: tone,
        reply: assistantText,
      };

      setResult(entry);
      setHistory(prev => [entry, ...prev]);
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message || "Erro desconhecido");
      } else {
        setError("Erro desconhecido");
      }
    } finally {
      setLoading(false);
    }
  };

  const copyResult = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Resultado copiado para a área de transferência!");
    } catch {
      alert("Não foi possível copiar. Use Ctrl+C.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header com animação */}
        <div className="relative overflow-hidden bg-black/40 backdrop-blur-sm border border-white/10 rounded-3xl p-8 mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-2xl flex items-center justify-center">
                <span className="text-2xl font-black text-white">🤖</span>
              </div>
              <div>
                <h1 className="text-4xl font-black tracking-tight text-white" style={{ fontFamily: 'ui-monospace, monospace' }}>
                  SAAS.VALIDATOR
                </h1>
                <p className="text-cyan-300/80 font-mono text-sm tracking-wider">
                  ▸ BRUTAL.HONESTY.AS.A.SERVICE
                </p>
              </div>
            </div>
            <p className="text-white/70 font-mono text-sm max-w-2xl">
              Uma IA sarcástica que julga suas ideias de SaaS sem dó nem piedade.
              Prepare-se para a verdade nua e crua (mas útil).
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-white/90 font-mono text-sm font-bold tracking-wider">
                › NOME.DA.IDEIA
              </label>
              <input
                className="w-full bg-white/5 border border-white/20 rounded-xl p-4 text-white font-mono placeholder-white/40 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all"
                placeholder="ex: UberForCats - transporte premium para felinos"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-white/90 font-mono text-sm font-bold tracking-wider">
                › DESCRIÇÃO.DETALHADA
              </label>
              <textarea
                className="w-full min-h-[140px] bg-white/5 border border-white/20 rounded-xl p-4 text-white font-mono placeholder-white/40 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all resize-none"
                placeholder="Descreva o problema, público-alvo, diferencial... seja específico!"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <label className="block text-white/90 font-mono text-sm font-bold tracking-wider">
                › NÍVEL.DE.SARCASMO [{tone}/10]
              </label>
              <div className="relative">
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={tone}
                  onChange={(e) => setTone(Number(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${tone * 10}%, rgba(255,255,255,0.1) ${tone * 10}%, rgba(255,255,255,0.1) 100%)`
                  }}
                />
                <div className="flex justify-between text-xs font-mono text-white/50 mt-2">
                  <span>SUAVE</span>
                  <span>DESTRUIÇÃO</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={submit}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-mono font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.02] disabled:scale-100 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    PROCESSANDO...
                  </span>
                ) : (
                  "JULGAR.IDEIA"
                )}
              </button>

              <button
                onClick={() => { setTitle(""); setDescription(""); }}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-mono font-bold py-4 px-6 rounded-xl transition-all"
              >
                RESET
              </button>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4">
                <div className="text-red-300 font-mono text-sm">❌ {error}</div>
              </div>
            )}
          </div>
        </div>

        =        <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-8">
          <h2 className="text-white font-mono font-bold text-xl tracking-wider mb-4">
            › VEREDICTO.FINAL
          </h2>

          {!result && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">⚖️</div>
              <div className="text-white/50 font-mono">Aguardando julgamento...</div>
            </div>
          )}

          {result && (
            <div className="bg-gradient-to-r from-white/5 to-white/10 border border-white/20 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">🔥</span>
                </div>
                <div className="flex-1 space-y-3">
                  <div className="font-mono font-bold text-white text-lg">
                    {result.title}
                  </div>
                  <div className="text-white/80 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                    {result.reply}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-white/50">
                    <span>SARCASMO: {result.tone}/10</span>
                    <span>•</span>
                    <span>{new Date(result.id).toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button
                    className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-mono text-xs py-2 px-3 rounded-lg transition-all"
                    onClick={() => copyResult(result.reply)}
                  >
                    COPY
                  </button>
                  <button
                    className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-mono text-xs py-2 px-3 rounded-lg transition-all"
                    onClick={() => navigator.clipboard.writeText(JSON.stringify(result, null, 2))}
                  >
                    JSON
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        =        <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <h3 className="text-white font-mono font-bold text-xl tracking-wider mb-4">
            › HISTÓRICO.DE.JULGAMENTOS
          </h3>

          {history.length === 0 && (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">📚</div>
              <div className="text-white/50 font-mono text-sm">Histórico vazio — suas ideias aparecerão aqui</div>
            </div>
          )}

          <div className="space-y-4">
            {history.map((h, index) => (
              <div key={h.id} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="font-mono font-bold text-white text-sm">
                      #{history.length - index}: {h.title}
                    </div>
                    <div className="text-white/70 font-mono text-xs leading-relaxed">
                      {h.reply.slice(0, 180)}{h.reply.length > 180 ? "..." : ""}
                    </div>
                    <div className="text-white/40 font-mono text-xs">
                      SARCASMO: {h.tone}/10
                    </div>
                  </div>
                  <div className="text-white/30 font-mono text-xs flex-shrink-0">
                    {new Date(h.id).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        =        <footer className="text-center mt-12 pb-8">
          <div className="text-white/30 font-mono text-xs tracking-wider">
            SAAS.VALIDATOR © 2025 — USE.COM.RESPONSABILIDADE 🚀
          </div>
        </footer>
      </div>
    </div>
  );
}