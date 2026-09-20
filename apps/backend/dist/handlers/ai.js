function buildFallbackDraft(prompt, context) {
    const promptText = prompt || 'Create a marketing update for Mescript Labs.';
    const contextText = context || 'creative product marketplace';
    const title = `AI Draft: ${promptText.split(' ').slice(0, 6).join(' ') || 'Mescript Update'}`;
    return {
        id: `ai_${Date.now()}`,
        title,
        summary: `This draft focuses on ${contextText} and keeps the messaging technical, premium, and conversion-focused for Mescript Labs.`,
        body: `Mescript Labs is building a premium creative marketplace for 3D assets, digital tools, and artist-first experiences. This generated draft emphasizes clarity, authority, and trust while keeping the brand voice technical and polished.\n\nKey ideas:\n- Position Mescript Labs as a premium storefront for high-quality 3D assets and tools\n- Highlight craftsmanship, licensing clarity, and creator trust\n- Support conversion with direct calls to action and benefit-based copy`,
        suggestions: [
            'Emphasize premium quality and creator trust.',
            'Use clearer product benefits and license tiers in the CTA.',
            'Keep the tone technical and modern for creative professionals.'
        ],
        model: 'local-fallback',
        status: 'pending_approval',
        requiresApproval: true
    };
}
async function callAiService(env, prompt, context) {
    if (!env.AI_SERVICE_URL)
        return null;
    try {
        const baseUrl = env.AI_SERVICE_URL.replace(/\/$/, '');
        const serviceUrl = new URL('/generate', baseUrl).toString();
        const headers = {
            'Content-Type': 'application/json'
        };
        if (env.AI_SERVICE_API_KEY) {
            headers.Authorization = `Bearer ${env.AI_SERVICE_API_KEY}`;
        }
        const response = await fetch(serviceUrl, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                prompt,
                context: context || 'Mescript Labs website and marketplace.',
                actionType: 'content'
            })
        });
        if (!response.ok)
            return null;
        const json = await response.json();
        const payload = json?.data ?? json;
        const parsedBody = typeof payload?.body === 'string' ? payload.body : payload?.output?.body || payload?.text || JSON.stringify(payload);
        const parsedTitle = payload?.title || payload?.output?.title || 'AI Draft';
        const parsedSummary = payload?.summary || payload?.output?.summary || 'AI summary generated successfully.';
        const parsedSuggestions = Array.isArray(payload?.suggestions)
            ? payload.suggestions
            : Array.isArray(payload?.output?.suggestions)
                ? payload.output.suggestions
                : [parsedSummary || 'Review and approve this content.'];
        return {
            id: `ai_${Date.now()}`,
            title: parsedTitle,
            summary: parsedSummary,
            body: parsedBody,
            suggestions: parsedSuggestions,
            model: env.AI_MODEL || 'hf-space',
            status: 'pending_approval',
            requiresApproval: env.AI_ADMIN_APPROVAL_REQUIRED !== 'false'
        };
    }
    catch (error) {
        console.error('AI service generation failed:', error);
        return null;
    }
}
async function callOpenAI(env, prompt, context) {
    if (!env.OPENAI_API_KEY)
        return null;
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: env.AI_MODEL || 'gpt-4o-mini',
                temperature: 0.7,
                messages: [
                    {
                        role: 'system',
                        content: 'You are a product marketing assistant for a creative digital storefront. Return valid JSON with keys: title, summary, body, suggestions. Keep it concise and useful for an admin dashboard.'
                    },
                    {
                        role: 'user',
                        content: `Create a marketing draft for: ${prompt}. Context: ${context || 'Mescript Labs website and marketplace.'}`
                    }
                ]
            })
        });
        if (!response.ok)
            return null;
        const json = await response.json();
        const content = json?.choices?.[0]?.message?.content;
        if (!content)
            return null;
        const parsed = JSON.parse(content);
        return {
            id: `ai_${Date.now()}`,
            title: parsed.title || 'AI Draft',
            summary: parsed.summary || 'AI summary generated successfully.',
            body: parsed.body || content,
            suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [parsed.summary || 'Review and approve this content.'],
            model: env.AI_MODEL || 'gpt-4o-mini',
            status: 'pending_approval',
            requiresApproval: env.AI_ADMIN_APPROVAL_REQUIRED !== 'false'
        };
    }
    catch (error) {
        console.error('OpenAI generation failed:', error);
        return null;
    }
}
async function callHuggingFace(env, prompt, context) {
    const hfKey = env.HUGGINGFACE_API_KEY || env.AI_SERVICE_API_KEY;
    const model = env.HUGGINGFACE_MODEL || env.AI_MODEL || 'gpt2';
    if (!hfKey)
        return null;
    try {
        const resp = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${hfKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ inputs: `Create a concise marketing draft for: ${prompt}. Context: ${context || 'Mescript Labs website and marketplace.'}`, options: { wait_for_model: true } })
        });
        if (!resp.ok)
            return null;
        const text = await resp.text();
        // Try to parse JSON output if the model returns structured JSON
        let parsed = null;
        try {
            parsed = JSON.parse(text);
        }
        catch (e) {
            parsed = null;
        }
        const bodyText = parsed?.generated_text || (Array.isArray(parsed) && parsed[0]?.generated_text) || text;
        return {
            id: `ai_${Date.now()}`,
            title: `AI Draft: ${prompt.split(' ').slice(0, 6).join(' ')}`,
            summary: `Generated by Hugging Face model ${model}`,
            body: bodyText,
            suggestions: ['Review and refine the generated text.'],
            model: `hf:${model}`,
            status: 'pending_approval',
            requiresApproval: env.AI_ADMIN_APPROVAL_REQUIRED !== 'false'
        };
    }
    catch (error) {
        console.error('Hugging Face generation failed:', error);
        return null;
    }
}
async function callAnthropic(env, prompt, context) {
    if (!env.ANTHROPIC_API_KEY)
        return null;
    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'x-api-key': env.ANTHROPIC_API_KEY,
                'Content-Type': 'application/json',
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 500,
                system: 'You are a marketing assistant for a premium 3D asset storefront. Return JSON with title, summary, body, suggestions.',
                messages: [
                    {
                        role: 'user',
                        content: `Create a marketing draft for: ${prompt}. Context: ${context || 'Mescript Labs website and marketplace.'}`
                    }
                ]
            })
        });
        if (!response.ok)
            return null;
        const json = await response.json();
        const text = json?.content?.[0]?.text || '';
        if (!text)
            return null;
        const parsed = JSON.parse(text);
        return {
            id: `ai_${Date.now()}`,
            title: parsed.title || 'AI Draft',
            summary: parsed.summary || 'AI summary generated successfully.',
            body: parsed.body || text,
            suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [parsed.summary || 'Review and approve this content.'],
            model: env.AI_MODEL || 'claude-3-5-sonnet',
            status: 'pending_approval',
            requiresApproval: env.AI_ADMIN_APPROVAL_REQUIRED !== 'false'
        };
    }
    catch (error) {
        console.error('Anthropic generation failed:', error);
        return null;
    }
}
async function generateAiDraft(env, payload) {
    const prompt = payload.prompt || 'Create a premium, technical update for the Mescript Labs site';
    const context = payload.context || 'This is for the studio homepage, product pages, and social-ready marketing copy.';
    const serviceResult = await callAiService(env, prompt, context);
    if (serviceResult)
        return serviceResult;
    const hfResult = await callHuggingFace(env, prompt, context);
    if (hfResult)
        return hfResult;
    const openAiResult = await callOpenAI(env, prompt, context);
    if (openAiResult)
        return openAiResult;
    const anthropicResult = await callAnthropic(env, prompt, context);
    if (anthropicResult)
        return anthropicResult;
    const fallback = buildFallbackDraft(prompt, context);
    fallback.requiresApproval = env.AI_ADMIN_APPROVAL_REQUIRED !== 'false';
    fallback.status = fallback.requiresApproval ? 'pending_approval' : 'approved';
    return fallback;
}
export async function handleAiGenerate(request) {
    const env = request.env;
    if (env.ALLOW_AI_OPS === 'false') {
        return new Response(JSON.stringify({ error: 'AI operations are disabled' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    try {
        const payload = await request.json();
        const draft = await generateAiDraft(env, payload);
        return new Response(JSON.stringify(draft), {
            headers: { 'Content-Type': 'application/json' }
        });
    }
    catch (error) {
        return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unable to generate AI content' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
export async function handleAiApprove(request) {
    const env = request.env;
    if (env.ALLOW_AI_OPS === 'false') {
        return new Response(JSON.stringify({ error: 'AI operations are disabled' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    try {
        const payload = await request.json();
        const approved = Boolean(payload.approved ?? true);
        return new Response(JSON.stringify({
            ok: true,
            id: payload.id || 'ai_draft',
            approved,
            status: approved ? 'approved' : 'rejected',
            message: approved ? 'AI-drafted content approved and ready to publish.' : 'AI draft rejected. Changes can be revised.'
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
    }
    catch (error) {
        return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unable to approve AI content' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
