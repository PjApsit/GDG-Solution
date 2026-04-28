/**
 * Gemini AI Service
 * WHY: Centralizes all Gemini 1.5 Flash interactions.
 * - extractSurveyData: OCR + structured extraction from paper survey images
 * - generateTaskSuggestion: Creates task title + description from event data
 * - predictNeeds: Analyzes historical events to predict upcoming needs
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const SURVEY_EXTRACTION_PROMPT = `You are a data extraction assistant for humanitarian NGOs.

TASK: Extract structured community need data from this image of a paper survey or field report.

RULES:
1. Return ONLY valid JSON. No markdown, no explanation, no code fences.
2. Translate any Hindi, Marathi, Bengali, or regional language text into English.
3. Do NOT extract names, phone numbers, or ID numbers of affected individuals.
4. If any field is illegible, set it to null and set confidence_score to "low".
5. If the image does not contain community/humanitarian data, return: {"error": "No community data detected"}

REQUIRED JSON SCHEMA:
{
  "location_text": "string - location name from the survey",
  "problem_type": "string - category: Health, Flood, Water, Sanitation, Education, Infrastructure, Other",
  "severity": "number 1-10",
  "urgency": "number 1-10",
  "affected_count": "number - estimated people affected",
  "description": "string - 1-2 sentence summary of the problem",
  "type": "emergency | chronic",
  "confidence_score": "high | medium | low",
  "needs_human_review": "boolean"
}`;

/**
 * Extract structured data from a paper survey image using Gemini Vision
 * @param {string} base64Image - Base64-encoded image data
 * @param {string} mimeType - Image MIME type (default: image/jpeg)
 * @returns {object} Extracted survey data
 */
export const extractSurveyData = async (base64Image, mimeType = 'image/jpeg') => {
  const result = await model.generateContent([
    SURVEY_EXTRACTION_PROMPT,
    {
      inlineData: {
        data: base64Image,
        mimeType,
      },
    },
  ]);

  const responseText = result.response.text().trim();
  
  // Strip markdown code fences if present
  const cleaned = responseText.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
  
  try {
    return JSON.parse(cleaned);
  } catch (parseError) {
    console.error('Gemini response parsing failed:', responseText);
    throw new Error('AI response was not valid JSON. Please retry.');
  }
};

/**
 * Generate a task suggestion from event data
 * @param {object} eventData - Event object with location, problem_type, severity, etc.
 * @returns {object} { title, description, priority, why }
 */
export const generateTaskSuggestion = async (eventData) => {
  const prompt = `You are a humanitarian task coordinator AI.

Given this community need event, generate a concrete, actionable task for volunteers.

EVENT DATA:
- Location: ${eventData.location_text || eventData.location}
- Problem: ${eventData.problem_type}
- Severity: ${eventData.severity}/10
- Urgency: ${eventData.urgency}/10
- Affected People: ${eventData.affected_count}
- Description: ${eventData.description || 'N/A'}

Return ONLY valid JSON with this schema (no markdown, no explanation):
{
  "title": "string - concise task title (max 60 chars)",
  "description": "string - 1-2 sentence description of what volunteers should do",
  "priority": "critical | high | medium | low",
  "why": "string - 1 sentence explaining why this task matters"
}`;

  const result = await model.generateContent(prompt);
  const responseText = result.response.text().trim();
  const cleaned = responseText.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    return {
      title: `Respond to ${eventData.problem_type} in ${eventData.location_text || eventData.location}`,
      description: `Address the ${eventData.problem_type} affecting ${eventData.affected_count} people.`,
      priority: eventData.severity >= 8 ? 'critical' : eventData.severity >= 6 ? 'high' : 'medium',
      why: `Severity ${eventData.severity}/10 with ${eventData.affected_count} people affected.`,
    };
  }
};

/**
 * Predict upcoming needs based on historical event patterns
 * @param {Array} historicalEvents - Array of recent event objects
 * @returns {object} Prediction analysis
 */
export const predictNeeds = async (historicalEvents) => {
  const eventSummaries = historicalEvents.map(e => ({
    location: e.location_text || e.location,
    problem_type: e.problem_type,
    severity: e.severity,
    urgency: e.urgency,
    affected_count: e.affected_count,
    date: e.date_recorded || e.created_at,
  }));

  const prompt = `You are a humanitarian data analyst AI.

Analyze these recent community need events and predict what needs are likely to emerge in the next 2-4 weeks.

RECENT EVENTS (${eventSummaries.length} total):
${JSON.stringify(eventSummaries, null, 2)}

Return ONLY valid JSON with this schema (no markdown):
{
  "predictions": [
    {
      "predicted_problem": "string",
      "likely_location": "string",
      "probability": "high | medium | low",
      "reasoning": "string - 1-2 sentences",
      "recommended_action": "string - what NGOs should prepare for"
    }
  ],
  "overall_trend": "string - 1-2 sentence summary of observed patterns",
  "risk_level": "critical | elevated | moderate | low"
}`;

  const result = await model.generateContent(prompt);
  const responseText = result.response.text().trim();
  const cleaned = responseText.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    return {
      predictions: [],
      overall_trend: 'Unable to generate predictions. Insufficient data or AI parsing error.',
      risk_level: 'moderate',
    };
  }
};
