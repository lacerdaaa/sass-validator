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
          "You are a deliberately biased, sarcastic, and humorous AI called the 'SaaS Validator'. Your job is to judge SaaS ideas quickly and with personality. Be concise, witty, and occasionally harsh — but provide one practical suggestion to actually improve the idea. Do not be abusive or hateful. Keep responses under 220 words. Response in PT-BT."
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
      const messages = buildPrompt(title, description, tone);

      const resp = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages,
          max_tokens: 450,
          temperature: Math.min(1.2, 0.1 + (tone / 10) * 1.1),
        }),
      });

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`Erro do servidor: ${resp.status} ${text}`);
      }

      const data = await resp.json();

      let assistantText = "";
      if (data.reply) assistantText = data.reply;
      else if (data.choices && data.choices[0] && data.choices[0].message)
        assistantText = data.choices[0].message.content;
      else if (data.output && data.output[0] && data.output[0].content)
        assistantText = data.output[0].content[0].text;
      else assistantText = JSON.stringify(data);

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
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-gradient-to-r from-slate-900 via-purple-800 to-sky-700 text-white rounded-2xl p-6 shadow-2xl">
        <h1 className="text-3xl font-extrabold">SaaS Validator</h1>
        <p className="mt-2 text-sm opacity-90">Uma IA sarcástica (mas útil) que 'julga' ideias de SaaS — diversão para devs e founders.</p>

        <div className="mt-6 grid grid-cols-1 gap-4">
          <input
            className="w-full rounded-md p-3 text-slate-800"
            placeholder="Nome da ideia (ex: 'ZapShip: entregas sob demanda para pets')"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="w-full min-h-[120px] rounded-md p-3 text-slate-800"
            placeholder="Descrição curta da ideia (problema que resolve, público, diferencial)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="flex items-center gap-4">
            <label className="text-sm">Nível de sarcasmo</label>
            <input
              type="range"
              min={1}
              max={10}
              value={tone}
              onChange={(e) => setTone(Number(e.target.value))}
            />
            <div className="ml-auto text-sm">{tone}/10</div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={submit}
              disabled={loading}
              className="bg-white text-slate-900 px-4 py-2 rounded-md font-semibold hover:scale-105 transition disabled:opacity-60"
            >
              {loading ? "Julgando..." : "Verificar ideia"}
            </button>

            <button
              onClick={() => { setTitle(""); setDescription(""); }}
              className="border border-white/30 px-4 py-2 rounded-md text-sm hover:bg-white/5"
            >
              Limpar
            </button>
          </div>

          {error && (
            <div className="bg-red-600/80 p-3 rounded-md text-white text-sm">{error}</div>
          )}
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-bold">Resultado</h2>

        {!result && (
          <div className="mt-3 text-sm text-slate-600">Ainda não tem julgamento — mande uma ideia!</div>
        )}

        {result && (
          <div className="mt-3 p-4 rounded-lg border">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="font-semibold">{result.title}</div>
                <div className="text-sm mt-1 whitespace-pre-wrap">{result.reply}</div>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  className="text-sm border px-3 py-1 rounded-md"
                  onClick={() => copyResult(result.reply)}
                >Copiar</button>
                <button
                  className="text-sm border px-3 py-1 rounded-md"
                  onClick={() => navigator.clipboard.writeText(JSON.stringify(result))}
                >Salvar JSON</button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6">
          <h3 className="font-semibold">Histórico</h3>
          {history.length === 0 && <div className="text-sm text-slate-500 mt-2">Nenhum histórico ainda — suas ideias aparecerão aqui.</div>}
          <ul className="mt-3 space-y-2">
            {history.map(h => (
              <li key={h.id} className="p-3 border rounded-md bg-white/5">
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <div className="font-medium">{h.title}</div>
                    <div className="text-xs text-slate-400">Sarcasmo: {h.tone}/10</div>
                    <div className="text-sm mt-2 whitespace-pre-wrap">{h.reply.slice(0, 220)}{h.reply.length > 220 ? "..." : ""}</div>
                  </div>
                  <div className="text-xs text-slate-400">{new Date(h.id).toLocaleString()}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

      </div>

      <footer className="mt-8 text-center text-xs text-slate-500">SaaS Validator — uma brincadeira para founders. Use com responsabilidade 😉</footer>
    </div>
  );
}
