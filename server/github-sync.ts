
import fs from 'fs/promises';
import { storage } from './storage';

export async function syncContentToGithub() {
  try {
    const doc = await storage.getDocument(1);
    const content = {
      lastUpdated: new Date().toISOString(),
      content: doc?.content || ''
    };
    
    await fs.writeFile('editor_content.json', JSON.stringify(content, null, 2));
    
    // Git commands to update the file
    const { execSync } = require('child_process');
    
    // Configure git with credentials
    execSync(`git config user.name "${process.env.GITHUB_USERNAME}"`);
    execSync(`git config user.email "${process.env.GITHUB_EMAIL}"`);
    execSync(`git config credential.helper 'store --file=.git/credentials'`);
    execSync(`echo "https://${process.env.GITHUB_TOKEN}@github.com" > .git/credentials`);
    
    execSync('git add editor_content.json');
    execSync('git commit -m "Update editor content"');
    execSync('git push');
  } catch (error) {
    console.error('Failed to sync content:', error);
  }
}
