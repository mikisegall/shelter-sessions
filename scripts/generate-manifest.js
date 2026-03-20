#!/usr/bin/env node
/**
 * Generate manifest.json from all topic files in public/topics
 *
 * This script scans the public/topics directory, reads all JSON files,
 * and generates a manifest.json file with metadata about each topic.
 */

const fs = require('fs');
const path = require('path');

const TOPICS_DIR = path.join(__dirname, '..', 'public', 'topics');
const MANIFEST_PATH = path.join(TOPICS_DIR, 'manifest.json');

function generateManifest() {
  console.log('🔍 Scanning public/topics directory...');

  // Read all files in the topics directory
  const files = fs.readdirSync(TOPICS_DIR);

  // Filter for JSON files (excluding manifest.json itself)
  const topicFiles = files.filter(
    file => file.endsWith('.json') && file !== 'manifest.json'
  );

  console.log(`📚 Found ${topicFiles.length} topic files`);

  // Read each topic file and extract metadata
  const topics = [];
  for (const filename of topicFiles) {
    try {
      const filePath = path.join(TOPICS_DIR, filename);
      const content = fs.readFileSync(filePath, 'utf8');
      const topic = JSON.parse(content);

      // Extract metadata for manifest
      topics.push({
        id: topic.id,
        filename: filename,
        title: topic.title,
        category: topic.category,
        addedDate: topic.createdAt || new Date().toISOString()
      });

      console.log(`  ✓ ${topic.id}`);
    } catch (error) {
      console.error(`  ✗ Failed to process ${filename}:`, error.message);
    }
  }

  // Sort topics by addedDate (newest first)
  topics.sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate));

  // Create manifest object
  const manifest = {
    version: "2.0.0",
    lastUpdated: new Date().toISOString(),
    topics: topics
  };

  // Write manifest file
  fs.writeFileSync(
    MANIFEST_PATH,
    JSON.stringify(manifest, null, 2),
    'utf8'
  );

  console.log(`\n✅ Generated manifest.json with ${topics.length} topics`);
  console.log(`📍 Location: ${MANIFEST_PATH}`);
}

// Run the script
try {
  generateManifest();
} catch (error) {
  console.error('❌ Failed to generate manifest:', error);
  process.exit(1);
}
