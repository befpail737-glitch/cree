/**
 * 图片转换为WebP格式脚本
 * 使用方法: node convert-to-webp.js
 * 前提: npm install sharp
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// 配置
const IMAGE_QUALITY = 85;
const DIRECTORIES = [
  './images',
  '.'
];

// 统计
let converted = 0;
let errors = 0;
let skipped = 0;

async function convertImage(inputPath, outputPath) {
  try {
    await sharp(inputPath)
      .webp({ quality: IMAGE_QUALITY, effort: 6 })
      .toFile(outputPath);
    
    const originalSize = fs.statSync(inputPath).size;
    const webpSize = fs.statSync(outputPath).size;
    const savings = ((originalSize - webpSize) / originalSize * 100).toFixed(1);
    
    console.log(`✓ ${path.basename(inputPath)} → ${path.basename(outputPath)} (${savings}% smaller)`);
    converted++;
  } catch (err) {
    console.error(`✗ Error converting ${path.basename(inputPath)}:`, err.message);
    errors++;
  }
}

async function processDirectory(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`Directory not found: ${dir}`);
    return;
  }

  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    
    // 只处理 jpg, jpeg, png 文件
    if (['.jpg', '.jpeg', '.png'].includes(ext)) {
      const inputPath = path.join(dir, file);
      const outputPath = path.join(dir, file.replace(ext, '.webp'));
      
      // 如果WebP已存在，跳过
      if (fs.existsSync(outputPath)) {
        console.log(`⊘ Skipped (exists): ${file}`);
        skipped++;
        continue;
      }
      
      await convertImage(inputPath, outputPath);
    }
  }
}

async function main() {
  console.log('========================================');
  console.log('  Image to WebP Converter');
  console.log('========================================\n');
  
  for (const dir of DIRECTORIES) {
    console.log(`\nProcessing: ${dir}`);
    console.log('-'.repeat(40));
    await processDirectory(dir);
  }
  
  console.log('\n========================================');
  console.log('  Conversion Summary');
  console.log('========================================');
  console.log(`Converted: ${converted}`);
  console.log(`Skipped:   ${skipped}`);
  console.log(`Errors:    ${errors}`);
  console.log('========================================');
}

main().catch(console.error);
