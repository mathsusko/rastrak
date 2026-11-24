// Recebe o formulário de booking/contato.
// Envio por e-mail via Resend quando RESEND_API_KEY e CONTACT_TO estiverem configurados na Vercel;
// sem essas variáveis, apenas registra no log do servidor (modo MVP).

type Payload = { nome?: string; contato?: string; tipo?: string; mensagem?: string; website?: string };

const clean = (v: unknown, max = 2000) => String(v ?? "").trim().slice(0, max);

export async function POST(req: Request) {
  let body: Payload;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }

  // honeypot anti-spam
  if (body.website) return Response.json({ ok: true });

  const data = {
    nome: clean(body.nome, 200),
    contato: clean(body.contato, 200),
    tipo: clean(body.tipo, 100),
    mensagem: clean(body.mensagem),
  };
  if (!data.nome || !data.contato || !data.mensagem) {
    return Response.json({ ok: false, error: "campos obrigatórios" }, { status: 422 });
  }

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO;
  if (key && to) {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM ?? "RASTRAK Presskit <onboarding@resend.dev>",
        to: [to],
        subject: `[RASTRAK] ${data.tipo} — ${data.nome}`,
        text: `Nome: ${data.nome}\nContato: ${data.contato}\nTipo: ${data.tipo}\n\n${data.mensagem}`,
      }),
    });
    if (!r.ok) return Response.json({ ok: false }, { status: 502 });
  } else {
    console.log("[contato]", data);
  }

  return Response.json({ ok: true });
}
