const fs = require('fs');
const path = require('path');

function loadLocalEnv() {
    try {
        const envPath = path.join(process.cwd(), '.env');
        if (fs.existsSync(envPath)) {
            const envContent = fs.readFileSync(envPath, 'utf8');
            const lines = envContent.split('\n');
            const env = {};
            for (const line of lines) {
                const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
                if (match) {
                    const key = match[1];
                    let value = match[2] || '';
                    env[key] = value.trim().replace(/(^['"]|['"]$)/g, '');
                }
            }
            return env;
        }
    } catch (e) {
        // ignore
    }
    return {};
}

module.exports = async function (req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const { messages, model } = req.body;
    
    const localEnv = loadLocalEnv();
    const geminiApiKey = process.env.GEMINI_API_KEY || localEnv.GEMINI_API_KEY;
    const openrouterApiKey = process.env.OPENROUTER_API_KEY || localEnv.OPENROUTER_API_KEY;
    
    // If Gemini API Key is configured, use official Google Gemini API directly
    if (geminiApiKey) {
        const systemMessage = messages.find(m => m.role === 'system')?.content || '';
        const userMessage = messages.find(m => m.role === 'user')?.content || '';
        
        const geminiModelName = "gemini-flash-latest"; // Works with standard and custom developer keys
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModelName}:generateContent?key=${geminiApiKey}`;
        
        const geminiPayload = {
            contents: [
                {
                    parts: [
                        { text: userMessage }
                    ]
                }
            ],
            generationConfig: {
                temperature: 0.7
            }
        };
        
        if (systemMessage) {
            geminiPayload.systemInstruction = {
                parts: [
                    { text: systemMessage }
                ]
            };
        }
        
        // Force JSON output for audit or if system message explicitly requests JSON
        if (req.body.response_format?.type === "json_object" || systemMessage.toLowerCase().includes("json")) {
            geminiPayload.generationConfig.responseMimeType = "application/json";
        }
        
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(geminiPayload)
            });
            
            const geminiData = await response.json();
            
            if (response.ok && geminiData.candidates && geminiData.candidates.length > 0) {
                const text = geminiData.candidates[0].content.parts[0].text;
                return res.status(200).json({
                    choices: [
                        {
                            message: {
                                role: "assistant",
                                content: text
                            }
                        }
                    ]
                });
            } else {
                const errMsg = geminiData.error?.message || "Failed to generate content from Gemini API";
                return res.status(response.status || 500).json({ error: errMsg, details: geminiData });
            }
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    
    // Otherwise fallback to OpenRouter
    const apiKey = openrouterApiKey || "";
    const selectedModel = process.env.OPENROUTER_AI_MODEL || localEnv.OPENROUTER_AI_MODEL || model || "anthropic/claude-3.5-sonnet";
    
    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: selectedModel,
                messages: messages
            })
        });
        
        const data = await response.json();
        return res.status(response.status).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
