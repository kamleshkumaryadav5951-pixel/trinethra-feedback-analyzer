const fs = require('fs');
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Load context files
const rubricPath = path.join(__dirname, '../rubric.json');
const contextPath = path.join(__dirname, '../context.md');
const rubric = fs.existsSync(rubricPath) ? require(rubricPath) : {};
const contextText = fs.existsSync(contextPath) ? fs.readFileSync(contextPath, 'utf8') : '';

app.post('/analyze', async (req, res) => {
  try {
    const transcript = req.body.transcript;
    if (!transcript) {
      return res.status(400).json({ error: "Transcript is required" });
    }

    const prompt = `
You are an expert psychology intern analyzing a supervisor transcript about an execution Fellow at DeepThought.
Your task is to analyze the transcript and output ONLY a valid JSON response.

Here is the context about the Fellow model, Supervisor Biases, and Assessment Dimensions:
${contextText}

Here is the 1-10 Rubric and KPI definitions:
${JSON.stringify(rubric, null, 2)}

Transcript to analyze:
"${transcript}"

Extract the following information and return it STRICTLY as a JSON object with this exact structure. Do not output any markdown formatting, backticks, or conversational text.
{
  "score": {
    "value": <integer from 1 to 10>,
    "label": "<the exact label for this score from the rubric>",
    "band": "<the band name from the rubric>",
    "justification": "<one paragraph explaining why this score, paying attention to the 6 vs 7 critical boundary and biases>",
    "confidence": "<high|medium|low>"
  },
  "evidence": [
    {
      "quote": "<exact quote from transcript>",
      "signal": "<positive|negative|neutral>",
      "dimension": "<execution|systems_building|kpi_impact|change_management>",
      "interpretation": "<your interpretation of the quote, noting if it's Layer 1 (execution) or Layer 2 (systems building)>"
    }
  ],
  "kpiMapping": [
    {
      "kpi": "<KPI label from the rubric>",
      "evidence": "<what the supervisor said that connects to this KPI>",
      "systemOrPersonal": "<system|personal>"
    }
  ],
  "gaps": [
    {
      "dimension": "<execution|systems_building|kpi_impact|change_management>",
      "detail": "<explanation of what was NOT covered or missing in the transcript regarding this dimension>"
    }
  ],
  "followUpQuestions": [
    {
      "question": "<the specific question to ask the supervisor next time>",
      "targetGap": "<the dimension this targets>",
      "lookingFor": "<what you hope to learn from this question>"
    }
  ]
}
`;

    const response = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "llama3.2",
        prompt,
        stream: false,
        format: "json"
      }
    );

    let result = response.data.response;
    let parsedJson;

    // Challenge 2: Structured Output Reliability
    try {
      parsedJson = JSON.parse(result);
    } catch (e) {
      // Fallback regex extraction if the model still adds text
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedJson = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Failed to parse JSON");
      }
    }

    res.json({ result: parsedJson });
  } catch (error) {
    console.error("Error analyzing transcript:", error?.response?.data || error.message);
    res.status(500).json({ error: "Failed to analyze transcript" });
  }
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});