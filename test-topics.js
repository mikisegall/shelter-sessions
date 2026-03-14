// Simple Node.js test to verify topics load correctly
const fs = require('fs');
const path = require('path');

console.log('Testing topic loading...\n');

const topicFiles = [
  'crispr-gene-editing.json',
  'lab-grown-meat.json',
  'quantum-computing-debate.json',
  'microplastics-health.json',
  'ai-alignment-problem.json',
];

topicFiles.forEach((filename) => {
  const filepath = path.join(__dirname, 'content', 'topics', filename);
  console.log(`\n--- ${filename} ---`);

  try {
    const topic = JSON.parse(fs.readFileSync(filepath, 'utf8'));

    console.log('✓ Title:', topic.title);
    console.log('✓ Content blocks:', topic.contentBlocks?.length || 0);
    console.log('✓ Quiz questions:', topic.quiz?.length || 0);

    if (topic.contentBlocks && topic.contentBlocks.length > 0) {
      console.log('✓ First block type:', topic.contentBlocks[0].type);
      console.log('✓ First block has text:', topic.contentBlocks[0].text ? 'YES' : 'NO');
      console.log('✓ First block text length:', topic.contentBlocks[0].text?.length || 0);

      console.log('\nBlock types:');
      topic.contentBlocks.forEach((block, i) => {
        console.log(`  ${i}: ${block.type} (${block.text?.length || 0} chars)`);
      });
    }

    if (topic.quiz && topic.quiz.length > 0) {
      console.log('\n✓ First quiz question has:', topic.quiz[0].question ? 'question' : 'NO QUESTION');
      console.log('✓ First quiz has options:', topic.quiz[0].options?.length || 0);
    }

  } catch (error) {
    console.error('✗ Error loading:', error.message);
  }
});

console.log('\n\nNow testing ES module import simulation...\n');

// Test what happens when importing
topicFiles.forEach((filename) => {
  const filepath = path.join(__dirname, 'content', 'topics', filename);
  const topic = require(filepath);
  console.log(`${filename}: ${topic.title} - ${topic.contentBlocks?.length} blocks`);
});
