// HeatData.js

const CACHE_KEY = "heatmap_ai_data";
const TIME_KEY = "heatmap_ai_time";
const CACHE_DURATION_MS = 20 * 60 * 1000; // 2 minutes

export const fetchHeatmapDataFromGroq = async () => {
    try {
        // =========================
        // 1. CHECK CACHE FIRST
        // =========================
        const cached = localStorage.getItem(CACHE_KEY);
        const cachedTime = localStorage.getItem(TIME_KEY);

        if (cached && cachedTime) {
            const now = Date.now();
            const age = now - Number(cachedTime);

            if (age < CACHE_DURATION_MS) {
                const remain = Math.floor((CACHE_DURATION_MS - age) / 1000);

                console.log("✅ Using cached AI data");
                console.log(`⏳ Cache expires in ${remain} sec`);

                return JSON.parse(cached);
            } else {
                console.log("♻️ Cache expired. Fetching fresh data...");
            }
        }

        // =========================
        // 2. API KEY
        // =========================
        const apiKey = import.meta.env.VITE_GROQ_API_KEY;

        if (!apiKey) {
            console.log("❌ Missing API Key");
            return fallbackData();
        }

        console.log("🚀 Calling Groq API...");

        // =========================
        // 3. PROMPT
        // =========================
        const prompt = `
Return ONLY valid JSON array.

Exactly 10 India humanitarian crisis events.

Each object must contain:
id
latitude
longitude
priority_score
affected_count
location
problem_type
why
source
date_recorded

No markdown.
No explanation.
No text outside JSON.
`;

        // =========================
        // 4. API CALL
        // =========================
        const res = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "openai/gpt-oss-20b",
                    messages: [{ role: "user", content: prompt }],
                    temperature: 0.3,
                    max_tokens: 3500,
                }),
            }
        );

        console.log("📡 HTTP Status:", res.status);

        const data = await res.json();

        console.log("===== FULL GROQ RESPONSE =====");
        console.log(data);

        if (!res.ok) {
            console.log("❌ API Failed");
            return fallbackData();
        }

        // =========================
        // 5. RAW OUTPUT
        // =========================
        let raw = data?.choices?.[0]?.message?.content || "";

        console.log("===== RAW MODEL OUTPUT =====");
        console.log(raw);

        raw = raw
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        // =========================
        // 6. FIND JSON ARRAY
        // =========================
        const match = raw.match(/\[[\s\S]*\]/);

        if (!match) {
            console.log("❌ No complete JSON array found. Using fallback.");
            return fallbackData();
        }

        console.log("===== CLEAN JSON =====");
        console.log(match[0]);

        const parsed = JSON.parse(match[0]);

        const finalData = sanitizeData(parsed);

        console.log("✅ Parsed Events:", finalData);

        // =========================
        // 7. SAVE CACHE
        // =========================
        localStorage.setItem(CACHE_KEY, JSON.stringify(finalData));
        localStorage.setItem(TIME_KEY, Date.now().toString());

        console.log("💾 Saved fresh AI data to cache");

        return finalData;
    } catch (err) {
        console.log("🔥 ERROR:");
        console.log(err);

        return fallbackData();
    }
};

// ========================================
// CLEAN DATA
// ========================================
const sanitizeData = (arr) => {
    return arr.map((item, i) => ({
        id: item.id || `event-${i + 1}`,
        latitude: Number(item.latitude) || 20.5937,
        longitude: Number(item.longitude) || 78.9629,
        priority_score: Number(item.priority_score) || 50,
        affected_count: Number(item.affected_count) || 1000,
        location: item.location || "India",
        problem_type: item.problem_type || "Relief Need",
        why: item.why || "Immediate help needed",
        source: item.source || "AI Feed",
        date_recorded: item.date_recorded || new Date().toISOString(),
    }));
};

// ========================================
// FALLBACK DATA
// ========================================
const fallbackData = () => {
    console.log("⚠️ Using fallback static data");

    return [
        {
            id: "1",
            latitude: 19.076,
            longitude: 72.8777,
            priority_score: 88,
            affected_count: 4200,
            location: "Mumbai",
            problem_type: "Flood",
            why: "Heavy rainfall displaced families.",
            source: "Fallback",
            date_recorded: new Date().toISOString(),
        },
        {
            id: "2",
            latitude: 28.6139,
            longitude: 77.209,
            priority_score: 75,
            affected_count: 2500,
            location: "Delhi",
            problem_type: "Medical Shortage",
            why: "Relief camps need medicine.",
            source: "Fallback",
            date_recorded: new Date().toISOString(),
        },
        {
            id: "3",
            latitude: 22.5726,
            longitude: 88.3639,
            priority_score: 70,
            affected_count: 1800,
            location: "Kolkata",
            problem_type: "Food Crisis",
            why: "Need ration kits.",
            source: "Fallback",
            date_recorded: new Date().toISOString(),
        },
    ];
};