import * as fs from 'fs';
import * as path from 'path';

// Build script: scans prompts/[folder]/detail.json + prompt.txt
// Generates data/prompts.json for the website to consume
// Run with: npx tsx scripts/build-prompts.ts

const PROMPTS_DIR = path.join(process.cwd(), 'prompts');
const DATA_DIR = path.join(process.cwd(), 'data');
const OUTPUT_FILE = path.join(DATA_DIR, 'prompts.json');

interface PromptEntry {
  id: string;
  title: string;
  description: string;
  promptText: string;
  resultType: 'image' | 'url';
  resultImage?: string;
  resultUrl?: string;
  category: string;
  tags: string[];
  authorGithub: string;
  authorName: string;
  authorAvatar: string;
  createdAt: string;
}

function main() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(PROMPTS_DIR)) {
    console.log('No prompts directory found. Creating empty data file.');
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify([], null, 2));
    return;
  }

  const dirs = fs.readdirSync(PROMPTS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  const prompts: PromptEntry[] = [];
  const warnings: string[] = [];

  for (const dir of dirs) {
    const detailFile = path.join(PROMPTS_DIR, dir, 'detail.json');
    const promptFile = path.join(PROMPTS_DIR, dir, 'prompt.txt');

    if (!fs.existsSync(detailFile)) {
      warnings.push(`${dir}: missing detail.json, skipped`);
      continue;
    }

    try {
      const detail = JSON.parse(fs.readFileSync(detailFile, 'utf-8'));

      // Read prompt text from prompt.txt if it exists
      let promptText = detail.promptText || '';
      if (fs.existsSync(promptFile)) {
        promptText = fs.readFileSync(promptFile, 'utf-8').trim();
      }

      if (!detail.title || !detail.category) {
        warnings.push(`${dir}: missing title or category, skipped`);
        continue;
      }

      // Use folder name as ID
      const entry: PromptEntry = {
        id: dir,
        title: detail.title,
        description: detail.description || '',
        promptText,
        resultType: detail.resultType || 'image',
        resultImage: detail.resultImage,
        resultUrl: detail.resultUrl,
        category: detail.category,
        tags: detail.tags || [],
        authorGithub: detail.authorGithub || 'unknown',
        authorName: detail.authorName || detail.authorGithub || 'Unknown',
        authorAvatar: detail.authorAvatar || `https://avatars.githubusercontent.com/${detail.authorGithub || 'ghost'}`,
        createdAt: detail.createdAt || new Date().toISOString(),
      };

      // Check if there's a local screenshot
      const screenshotExts = ['png', 'jpg', 'jpeg', 'webp', 'gif'];
      for (const ext of screenshotExts) {
        const screenshotPath = path.join(PROMPTS_DIR, dir, `screenshot.${ext}`);
        if (fs.existsSync(screenshotPath) && entry.resultType === 'image' && !entry.resultImage) {
          // In the GitHub raw URL, the screenshot will be accessible
          entry.resultImage = `https://raw.githubusercontent.com/${process.env.GITHUB_REPOSITORY || 'OWNER/REPO'}/main/prompts/${dir}/screenshot.${ext}`;
          break;
        }
      }

      prompts.push(entry);
    } catch (err) {
      warnings.push(`${dir}: invalid JSON — ${err}`);
    }
  }

  // Sort newest first
  prompts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(prompts, null, 2));

  console.log(`✓ Built data/prompts.json — ${prompts.length} prompts`);
  if (warnings.length > 0) {
    console.log(`  Warnings:`);
    warnings.forEach(w => console.log(`    - ${w}`));
  }
}

main();
