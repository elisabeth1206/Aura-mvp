export default async function handler(req, res){
  try{
    if(req.method !== 'POST'){ res.status(405).json({error:'Method not allowed'}); return; }
    const { input, mode } = req.body || {};
    if(!input){ res.status(400).json({error:'Missing input'}); return; }
    if(!process.env.OPENAI_API_KEY){ res.status(500).json({error:'Missing OPENAI_API_KEY'}); return; }

    const persona = {
      flirty_funny: 'You are a witty, playful dating coach. Keep replies short, human, confident, and respectful. Avoid cheesy lines.',
      calm_grounded: 'You are a calm, grounded dating coach. Prioritize warmth, empathy, and clarity.',
      charismatic_bold: 'You are a charismatic, bold dating coach. Encourage concise, confident statements with a spark of humor.'
    }[mode || 'flirty_funny'];

    const systemPrompt = `${persona}
RULES:
- Offer 1–2 polished replies (A/B) the user could send.
- If asked about IRL connection, include 1–2 practical, safe real-world steps.
- Keep replies natural and brief.
- If user over-explains, suggest a lighter re-open.
- No guarantees or inappropriate content.`;

    const resp = await fetch('https://api.openai.com/v1/chat/completions',{
      method:'POST',
      headers:{
        'Authorization':`Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        model:'gpt-4o-mini',
        temperature:0.7,
        max_tokens:350,
        messages:[
          {role:'system',content:systemPrompt},
          {role:'user',content:input}
        ]
      })
    });

    if(!resp.ok){
      const txt = await resp.text();
      res.status(500).json({error:'OpenAI error: ' + txt.slice(0,400)});
      return;
    }
    const data = await resp.json();
    res.status(200).json({advice:data.choices?.[0]?.message?.content||'No reply.'});
  }catch(e){
    res.status(500).json({error:e.message});
  }
}