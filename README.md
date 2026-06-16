# Antigravity Event Talks App & AI News Tracker

A modern multi-functional hub created inside the workspace for tracking key AI/ML advancements, daily news summaries, and Google BigQuery release notes with built-in social sharing functionality.

---

## 📂 Repository Structure

The workspace is organized as follows:
```
agy-cli-projects/
├── bq_release_viewer/          # Flask Web Application
│   ├── templates/
│   │   └── index.html          # Web UI layout
│   ├── static/
│   │   ├── css/
│   │   │   └── styles.css      # Dark mode & glassmorphism styling
│   │   └── js/
│   │       └── main.js         # API integration & Tweet builder logic
│   ├── app.py                  # Flask application & XML feed parser
│   ├── requirements.txt        # Backend dependencies
│   └── .gitignore              # Project-level git ignore rules
├── ai_ml_advancements_week_june16_2026.txt  # AI/ML Weekly Report
├── news.txt                    # Global news reports for June 16, 2026
├── news_summary.txt            # Bulleted summary of the news report
└── .gitignore                  # Workspace-level git ignore rules
```

---

## 🚀 1. Google BigQuery Release Hub (Web App)

An interactive, responsive dashboard built with **Python Flask** on the backend and **vanilla HTML, JS, and CSS** on the frontend. It fetches the live BigQuery Release Notes RSS/Atom XML feed and provides tools to preview, structure, and Tweet updates.

### 🌟 Key Features
* **Live RSS Parsing:** Dynamically fetches and cleans HTML tags from Google Cloud's official feed.
* **Modern Premium Styling:** Built with a dark mode theme, custom gradients, interactive card hover effects, and glassmorphic panels.
* **Color-Coded Classification Badges:** Instantly identifies updates:
  * <span style="color:#34d399">■</span> **Feature** (Emerald)
  * <span style="color:#fbbf24">■</span> **Issue / Fixed** (Amber)
  * <span style="color:#f87171">■</span> **Breaking Change** (Rose)
  * <span style="color:#c084fc">■</span> **Announcement** (Purple)
  * <span style="color:#22d3ee">■</span> **Change** (Cyan)
* **Dual Tweet Integration:**
  * **Quick Tweet:** A dedicated Tweet icon next to each card to immediately share that specific update.
  * **Multi-Select Composer:** Choose multiple updates using checkboxes on the left, and watch the Tweet Composer compile a neat bulleted summary, check character limits (280 limit), and generate a Twitter/X intent URL.

### 🛠️ Local Setup and Execution

1. **Navigate to the web app directory:**
   ```bash
   cd bq_release_viewer
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Start the Flask server:**
   ```bash
   python app.py
   ```

4. **Access the application in your browser:**
   Open [http://127.0.0.1:5000/](http://127.0.0.1:5000/)

---

## 📝 2. AI/ML Advancements Report (June 9 - 16, 2026)
Contains documented research on the latest breakthroughs and papers, located in:
📄 [ai_ml_advancements_week_june16_2026.txt](file:///C:/Users/abhir/Desktop/1234567890/agy-cli-projects/ai_ml_advancements_week_june16_2026.txt)

### Highlights:
* **Model Releases:** Anthropic Fable 5, Google DiffusionGemma 26B-A4B, Microsoft MAI-Code-1-Flash, and MAI-Thinking-1.
* **Key Papers:** Research on reasoning trace privacy in LLMs (*Hidden Thoughts Are Not Secret*), modular coordination (*MOSAIC*), and neuro-symbolic mathematics (*AXIOM*).
* **Industry Integration:** Apple's Siri rebuild powered by Google Gemini, and OpenAI's "Dreaming V3" memory architectures with 5x compute efficiency.

---

## 📰 3. Global News Tracker (June 16, 2026)
Consists of two primary text files documenting the day's global events:
* **Full News File:** 📄 [news.txt](file:///C:/Users/abhir/Desktop/1234567890/agy-cli-projects/news.txt)
* **Summary File:** 📄 [news_summary.txt](file:///C:/Users/abhir/Desktop/1234567890/agy-cli-projects/news_summary.txt)

### Quick Summary:
* **US-Iran Ceasefire:** Drafted 60-day ceasefire and plans to open the Strait of Hormuz.
* **US Air Force Crash:** A B-52 Stratofortress crashed in California during a test flight.
* **UK Social Media Ban:** Ban announced for children under the age of 16.
* **EU Sanctions:** Targets 34 individuals and 47 entities targeting Russia's shadow fleet.
* **Media Shifts:** Social media/video officially overtook TV and print as the world's primary news source.
