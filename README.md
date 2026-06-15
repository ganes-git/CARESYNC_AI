# CareSync AI: ICU Command Center
> **"From alarm noise to clinical clarity."**

CareSync AI is a dark-themed clinical command center dashboard designed to combat hospital alert fatigue. By combining multi-vital trends, scoring real-time crisis probabilities, and generating clinical plain-English briefs, CareSync AI helps ICU shift nurses identify and prioritize deteriorating patients before critical adverse events occur.

---

## 🏥 The Problem: Alert Fatigue
In modern intensive care units (ICUs), nurses are bombarded by a continuous stream of audible alerts. Up to **87% of these alarms are false positives** or clinically insignificant fluctuations. Static thresholds (e.g., triggering a loud alarm the moment Heart Rate crosses 100) fail to capture:
1. **Trend Velocity:** Is the heart rate rising slowly over hours, or spiking suddenly within minutes?
2. **Physiologic Baseline Deviation:** How far is the patient trending from their individual or standard targets?
3. **Cross-Vital Correlation:** Is a drop in oxygen saturation ($SpO_2$) accompanied by tachycardia and a crash in blood pressure?

Command monitors display numbers, not reasoning. Nurses are left to decode who is actually in distress.

---

## ⚡ The Solution: CareSync AI Command Center
CareSync AI addresses these challenges with a single, cohesive clinical interface that combines:

1. **Crisis Probability Score Engine:** A real-time scoring algorithm that evaluates trend velocity, baseline deviation, and multi-system abnormalities.
2. **Live Telemetry & SVG Sparklines:** Live-updating patient cards displaying key vitals with trend arrows and mini sparkline charts tracking historical vital vectors.
3. **Claude AI Nurse Briefings:** A slide-out panel that translates raw physiological data into a 2-to-3 sentence plain-English clinical summary detailing key clinical concerns.
4. **Cascade Crisis Simulator:** A demonstration trigger that simulates sudden, severe patient deterioration to showcase live re-sorting, visual alarming, and narrative generation.

---

## 🔬 Core Innovation: Crisis Probability Score Engine
The Crisis Score is calculated every 2 seconds for each patient using a weighted formula:

$$\text{Crisis Score} = (\text{Baseline Deviation} \times 0.3) + (\text{Trend Velocity} \times 0.4) + (\text{Multi-Vital Penalty} \times 0.3)$$

- **Baseline Deviation ($30\%$ weight):** Measures how far current vitals deviate from WHO targets (e.g., tachycardia, hypotension, hypoxemia). It takes the maximum deviation across all vitals to identify single-system collapse.
- **Trend Velocity ($40\%$ weight):** Analyzes the rate of change over the last 5 readings. A rapid drop in $SpO_2$ or collapse in blood pressure yields a high trend velocity score.
- **Multi-Vital Penalty ($30\%$ weight):** Adds a compounding penalty when multiple systems show abnormal deviations (up to 4+ abnormal vitals), identifying systemic shock.

The resulting score ranges from `0` (physiologically stable) to `100` (imminent clinical code).

---

## 🚀 Key Features

* **Ward Command Center Grid:** Real-time patient grid dynamically sorted by highest Crisis Score.
* **Inline SVG Sparkline Charts:** Custom, zero-dependency sparklines that draw physiological historical paths for Heart Rate, $SpO_2$, Blood Pressure, Resp. Rate, and Temperature.
* **Slide-out Sidebar Panel:** Displays a detailed vital breakdown compared against WHO normal targets, a checklist of bedside protocols, and the AI briefing.
* **Anthropic Claude Integration:** Fetch actual shift summaries via Claude 3.5 Sonnet.
* **Clinical Rules Fallback Engine:** If an API Key is not configured or fails due to network/CORS restrictions, a localized clinical rules engine takes over to construct dynamic shift reports.
* **Cascade Crisis Simulator:** An interactive mock event demonstrating a multi-vital collapse of Patient 4, illustrating real-time telemetry updates, card reordering, and alert warnings.

---

## 🛠 Tech Stack & Setup
* **Frontend:** HTML5, Vanilla CSS3, React 18, Babel Standalone (Dynamic browser-side compilation)
* **Design Guidelines:** Deep Navy palette (`#0A0F1E`), Monospace typography metrics (`JetBrains Mono`), Clinical color coding (Teal/Green/Orange/Red)
* **Hosting:** GitHub Pages

### Running Locally
To run the project locally:
1. Clone this repository or download the files.
2. Open `index.html` directly in any web browser.
3. (Optional) Click **Settings** in the header to enter your Anthropic API Key for actual Claude-generated briefings.

---

## 🌐 Live Deployment
The CareSync AI command center is deployed and running live on GitHub Pages:
👉 **[CareSync AI Live Dashboard](https://ganes-git.github.io/CARESYNC_AI/)**
