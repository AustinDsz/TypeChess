interface Env {
  GEMINI_API_KEY?: string;
}

interface RequestBody {
  fen: string;
  history: string[];
  legalMoves: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
  playerColor?: 'w' | 'b';
  aiColor?: 'w' | 'b';
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const body: RequestBody = await context.request.json();
    const { fen, history, legalMoves, difficulty = 'medium', aiColor = 'b' } = body;

    if (!legalMoves || legalMoves.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No legal moves available' }),
        { status: 400, headers }
      );
    }

    const apiKey = context.env.GEMINI_API_KEY;

    // If API key is not configured or in local development mode, use heuristic fallback
    if (!apiKey) {
      const fallbackMove = selectFallbackMove(legalMoves, difficulty);
      return new Response(
        JSON.stringify({
          move: fallbackMove,
          commentary: 'Playing standard tactical response (Local Fallback: No API Key found).',
          isFallback: true,
          engine: 'Local Heuristic Engine (Missing API Key)',
        }),
        { status: 200, headers }
      );
    }

    const prompt = `You are a Grandmaster Chess Engine and witty personality named "TypeChess AI".
You are playing as ${aiColor === 'w' ? 'White' : 'Black'}.
Difficulty setting: ${difficulty.toUpperCase()}.

Current Board FEN: "${fen}"
Move History: ${history && history.length > 0 ? history.join(' ') : 'Game start'}
Strictly Legal Moves Available: [${legalMoves.map((m) => `"${m}"`).join(', ')}]

CRITICAL RULES:
1. You MUST select exactly ONE move from the "Strictly Legal Moves Available" array above. Do NOT invent any move outside that list.
2. Provide a short, fun, 1-sentence chess commentary or reaction to the game state.

Respond ONLY with a valid JSON object matching this schema:
{
  "move": "<one move chosen strictly from the legal moves list>",
  "commentary": "<short witty or tactical 1-sentence comment>"
}`;

    // Active Flash models for current tier 1 accounts (gemini-3.6-flash, gemini-3.5-flash, gemini-3.1-flash-lite)
    const candidateModels = [
      'gemini-3.6-flash',
      'gemini-3.5-flash',
      'gemini-3.1-flash-lite',
      'gemini-3.8-flash',
    ];

    let lastError: string = '';
    let selectedModelUsed = '';
    let rawContent: string | null = null;

    for (const modelName of candidateModels) {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
      try {
        const response = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              response_mime_type: 'application/json',
              temperature: difficulty === 'easy' ? 0.7 : difficulty === 'medium' ? 0.4 : 0.1,
            },
          }),
        });

        if (response.ok) {
          const data = await response.json();
          rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawContent) {
            selectedModelUsed = modelName;
            break;
          }
        } else {
          lastError = await response.text();
          console.warn(`Model ${modelName} returned status ${response.status}:`, lastError);
        }
      } catch (e: any) {
        lastError = e.message;
      }
    }

    if (!rawContent) {
      const fallbackMove = selectFallbackMove(legalMoves, difficulty);
      return new Response(
        JSON.stringify({
          move: fallbackMove,
          commentary: 'Calculated a solid positional move (API Fallback).',
          isFallback: true,
          engine: 'Local Heuristic Fallback (API error)',
          errorDetails: lastError,
        }),
        { status: 200, headers }
      );
    }

    let parsed: { move?: string; commentary?: string };
    try {
      parsed = JSON.parse(rawContent);
    } catch {
      parsed = {};
    }

    const isMoveValid = parsed.move && legalMoves.includes(parsed.move);
    const selectedMove = isMoveValid
      ? parsed.move
      : selectFallbackMove(legalMoves, difficulty);

    return new Response(
      JSON.stringify({
        move: selectedMove,
        commentary: parsed.commentary || 'Let\'s see how you handle this!',
        isFallback: !isMoveValid,
        engine: isMoveValid ? `Google ${selectedModelUsed} (Cloud)` : 'Local Heuristic Fallback (Invalid Move by LLM)',
      }),
      { status: 200, headers }
    );
  } catch (err: any) {
    console.error('AI Edge Function Error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Internal server error' }),
      { status: 500, headers }
    );
  }
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};

function selectFallbackMove(legalMoves: string[], difficulty: string): string {
  if (!legalMoves || legalMoves.length === 0) return '';

  const tacticalMoves = legalMoves.filter((m) => m.includes('x') || m.includes('+') || m.includes('#'));

  if (difficulty === 'hard' && tacticalMoves.length > 0) {
    return tacticalMoves[Math.floor(Math.random() * tacticalMoves.length)];
  }

  if (difficulty === 'medium') {
    if (tacticalMoves.length > 0 && Math.random() > 0.4) {
      return tacticalMoves[Math.floor(Math.random() * tacticalMoves.length)];
    }
  }

  return legalMoves[Math.floor(Math.random() * legalMoves.length)];
}
