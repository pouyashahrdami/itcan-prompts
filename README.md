# itcan-prompts

Community-submitted AI prompts for [PromptHood](https://github.com/pouyashahrdami/itcan).

## Structure

Each prompt is a folder inside `prompts/`:

```
prompts/
├── alexchen-futuristic-saas-dashboard/
│   ├── detail.json          ← Metadata (title, category, author, etc.)
│   ├── prompt.txt           ← The actual AI prompt text
│   └── screenshot.png       ← Result screenshot (optional, can use URL in detail.json)
├── sarahkim-ai-startup-landing/
│   ├── detail.json
│   ├── prompt.txt
│   └── screenshot.png
└── ...
```

## detail.json format

```json
{
  "title": "Futuristic SaaS Dashboard",
  "description": "A sleek, dark-themed analytics dashboard...",
  "category": "Dashboard",
  "tags": ["dark-theme", "analytics"],
  "resultType": "image",
  "resultImage": "https://...",
  "authorGithub": "alexchen",
  "authorName": "Alex Chen",
  "createdAt": "2026-02-28T10:00:00Z"
}
```

**Categories:** UI Design, Landing Page, Dashboard, Mobile App, Logo, Illustration, Icon Set, Web App

## How to submit

1. Fork this repo
2. Create a folder: `prompts/yourusername-prompt-title/`
3. Add `detail.json`, `prompt.txt`, and optionally a screenshot
4. Open a PR

Or submit via the [PromptHood website](https://itcan.vercel.app) — it creates the PR for you!

## Auto-build

A GitHub Action rebuilds `data/prompts.json` whenever PRs merge or every 12 hours.
