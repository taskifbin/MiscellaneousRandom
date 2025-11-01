// script.js
class SpamDetector {
  constructor() {
    this.spamKeywords = [
      "free",
      "winner",
      "congratulations",
      "prize",
      "cash",
      "lottery",
      "selected",
      "winner",
      "claim",
      "urgent",
      "important",
      "limited",
      "offer",
      "discount",
      "deal",
      "buy now",
      "click here",
      "subscribe",
      "money",
      "profit",
      "income",
      "earn",
      "rich",
      "million",
      "billion",
      "guaranteed",
      "risk-free",
      "no cost",
      "trial",
      "subscription",
      "credit",
      "loan",
      "mortgage",
      "insurance",
      "investment",
      "viagra",
      "cialis",
      "medication",
      "prescription",
      "drug",
      "password",
      "account",
      "verify",
      "update",
      "security",
      "dear friend",
      "dear customer",
      "valued customer",
    ];

    this.suspiciousPatterns = [
      /[A-Z]{4,}/g, // Multiple uppercase words
      /!\s*!/g, // Multiple exclamation marks
      /\$\d+/g, // Money amounts
      /http[s]?:\/\/[^\s]+/g, // URLs
      /[0-9]{10,}/g, // Long number sequences
    ];
  }

  preprocessText(text) {
    return text.toLowerCase().replace(/[^\w\s]/g, "");
  }

  calculateSpamScore(text) {
    let score = 0;
    const processedText = this.preprocessText(text);
    const words = processedText.split(/\s+/);

    // Check for spam keywords
    this.spamKeywords.forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, "gi");
      const matches = text.match(regex);
      if (matches) {
        score += matches.length * 2;
      }
    });

    // Check for suspicious patterns
    this.suspiciousPatterns.forEach((pattern) => {
      const matches = text.match(pattern);
      if (matches) {
        score += matches.length * 3;
      }
    });

    // Check for excessive punctuation
    const exclamationCount = (text.match(/!/g) || []).length;
    const questionCount = (text.match(/\?/g) || []).length;
    if (exclamationCount > 3) score += exclamationCount;
    if (questionCount > 5) score += questionCount;

    // Check for urgency words
    const urgencyWords = ["urgent", "immediately", "asap", "instant", "now"];
    urgencyWords.forEach((word) => {
      if (processedText.includes(word)) score += 3;
    });

    return score;
  }

  isSpam(text) {
    if (!text || text.trim().length < 10) {
      return { isSpam: false, confidence: 0, reason: "Text too short" };
    }

    const score = this.calculateSpamScore(text);
    const maxPossibleScore = 50;
    const confidence = Math.min((score / maxPossibleScore) * 100, 100);

    let reasons = [];
    if (score > 30) reasons.push("High spam keyword frequency");
    if (score > 20) reasons.push("Suspicious patterns detected");
    if (score > 10) reasons.push("Urgent language used");

    return {
      isSpam: score > 15,
      confidence: Math.round(confidence),
      reasons: reasons.slice(0, 2),
      score: score,
    };
  }
}

// Initialize the detector
const spamDetector = new SpamDetector();

// DOM elements
const emailText = document.getElementById("emailText");
const analyzeBtn = document.getElementById("analyzeBtn");
const result = document.getElementById("result");
const resultContent = document.getElementById("resultContent");
const confidenceValue = document.getElementById("confidenceValue");

// Event listeners
analyzeBtn.addEventListener("click", analyzeEmail);
emailText.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && e.ctrlKey) {
    analyzeEmail();
  }
});

function analyzeEmail() {
  const text = emailText.value.trim();

  if (!text) {
    alert("Please enter some email content to analyze.");
    return;
  }

  if (text.length < 20) {
    alert("Please enter a longer email content for accurate analysis.");
    return;
  }

  // Show loading state
  analyzeBtn.textContent = "Analyzing...";
  analyzeBtn.disabled = true;

  // Simulate processing time
  setTimeout(() => {
    const analysis = spamDetector.isSpam(text);

    // Display results
    result.className = `result ${analysis.isSpam ? "spam" : "ham"}`;
    resultContent.innerHTML = analysis.isSpam
      ? "🚨 This email appears to be SPAM!"
      : "✅ This email appears to be LEGITIMATE!";

    confidenceValue.textContent = `${analysis.confidence}%`;

    // Add reasons if available
    if (analysis.reasons && analysis.reasons.length > 0) {
      const reasonsHtml = `<div style="margin-top: 10px; font-size: 14px; font-weight: normal;">
                <strong>Reasons:</strong> ${analysis.reasons.join(", ")}
            </div>`;
      resultContent.innerHTML += reasonsHtml;
    }

    result.classList.remove("hidden");

    // Reset button
    analyzeBtn.textContent = "Analyze Email";
    analyzeBtn.disabled = false;
  }, 1000);
}

// Sample emails for testing
const sampleEmails = {
  spam: `Congratulations! You've been selected as the winner of our $1,000,000 prize! 
    Click here to claim your reward now: http://bit.ly/fakeprize
    This is a LIMITED TIME OFFER!!! Don't miss out!!!`,

  ham: `Hi John, 

I hope this email finds you well. I wanted to follow up on our conversation yesterday about the project timeline.

Could you please send me the updated documents when you get a chance?

Best regards,
Sarah`,
};

// Optional: Add sample email buttons for testing
function addSampleButtons() {
  const buttonContainer = document.createElement("div");
  buttonContainer.style.marginBottom = "15px";
  buttonContainer.innerHTML = `
        <button onclick="loadSample('spam')" class="sample-btn" style="background: #e74c3c; color: white; border: none; padding: 8px 15px; border-radius: 5px; margin-right: 10px; cursor: pointer;">Load Spam Sample</button>
        <button onclick="loadSample('ham')" class="sample-btn" style="background: #27ae60; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;">Load Legitimate Sample</button>
    `;
  emailText.parentNode.insertBefore(buttonContainer, emailText);
}

function loadSample(type) {
  emailText.value = sampleEmails[type];
  result.classList.add("hidden");
}

// Initialize sample buttons
addSampleButtons();
