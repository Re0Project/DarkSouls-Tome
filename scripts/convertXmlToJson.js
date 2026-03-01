import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import xml2js from 'xml2js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const parser = new xml2js.Parser();

// 游戏版本
const games = [1, 2, 3];
// 语言
const languages = ['chn', 'jap', 'eng'];
// 物品类型
const types = ['weapon', 'armor', 'ring', 'item', 'magic'];

async function parseXml(filePath) {
  try {
    const xmlData = fs.readFileSync(filePath, 'utf-8');
    const result = await parser.parseStringPromise(xmlData);
    return result.entries.text.map(item => ({
      id: item.$?.id,
      text: item._ || item
    }));
  } catch (error) {
    console.error(`Error parsing ${filePath}:`, error.message);
    return [];
  }
}

async function parseDialogueXml(filePath) {
  try {
    const xmlData = fs.readFileSync(filePath, 'utf-8');
    const result = await parser.parseStringPromise(xmlData);
    return result.entries.text.map((item, index) => {
      const text = typeof item === 'string' ? item : (item._ || item);
      const id = item.$?.id;
      return {
        index,
        id,
        text
      };
    });
  } catch (error) {
    console.error(`Error parsing ${filePath}:`, error.message);
    return [];
  }
}

async function convertGameData(game) {
  console.log(`\n转换 DS${game} 数据...`);
  
  for (const type of types) {
    const items = {};
    
    // 读取名称
    for (const lang of languages) {
      const namePath = path.join(__dirname, `../reference/text/${lang}${game}/${type}_name.xml`);
      if (fs.existsSync(namePath)) {
        const names = await parseXml(namePath);
        names.forEach(item => {
          if (!items[item.id]) {
            items[item.id] = { 
              id: item.id, 
              name: { chn: '', jap: '', eng: '' }, 
              description: { chn: '', jap: '', eng: '' } 
            };
          }
          items[item.id].name[lang] = item.text;
        });
      }
    }
    
    // 读取描述
    for (const lang of languages) {
      const descPath = path.join(__dirname, `../reference/text/${lang}${game}/${type}_desc.xml`);
      if (fs.existsSync(descPath)) {
        const descs = await parseXml(descPath);
        descs.forEach(item => {
          if (!items[item.id]) {
            items[item.id] = { 
              id: item.id, 
              name: { chn: '', jap: '', eng: '' }, 
              description: { chn: '', jap: '', eng: '' } 
            };
          }
          items[item.id].description[lang] = item.text;
        });
      }
    }
    
    // 读取备注（如果有）
    const hasRemark = ['ring', 'item', 'magic'].includes(type);
    if (hasRemark) {
      for (const lang of languages) {
        const remarkPath = path.join(__dirname, `../reference/text/${lang}${game}/${type}_remk.xml`);
        if (fs.existsSync(remarkPath)) {
          const remarks = await parseXml(remarkPath);
          remarks.forEach(item => {
            if (items[item.id]) {
              if (!items[item.id].remark) {
                items[item.id].remark = { chn: '', jap: '', eng: '' };
              }
              items[item.id].remark[lang] = item.text;
            }
          });
        }
      }
    }
    
    // 添加元数据
    const itemArray = Object.values(items)
      .filter(item => item.name.chn || item.name.jap || item.name.eng) // 过滤空数据
      .map(item => ({
        ...item,
        type,
        game,
        icon: `/icons/ds${game}/${type}s/${item.id}.webp`
      }));
    
    // 保存JSON
    const outputDir = path.join(__dirname, `../src/data/ds${game}`);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const outputPath = path.join(outputDir, `${type}s.json`);
    fs.writeFileSync(outputPath, JSON.stringify(itemArray, null, 2), 'utf-8');
    
    console.log(`  ✓ ${type}s: ${itemArray.length} 项`);
  }
}

async function convertDialogues(game) {
  console.log(`\n转换 DS${game} 对话...`);
  
  const dialogueDir = path.join(__dirname, `../reference/text/chn${game}/dialogue`);
  if (!fs.existsSync(dialogueDir)) {
    console.log(`  ⚠ 对话目录不存在: ${dialogueDir}`);
    return;
  }
  
  const npcFiles = fs.readdirSync(dialogueDir).filter(f => f.endsWith('.xml'));
  
  const outputDir = path.join(__dirname, `../src/data/ds${game}/dialogues`);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  for (const npcFile of npcFiles) {
    const npcName = path.basename(npcFile, '.xml');
    const dialogue = {
      npc: npcName,
      game,
      avatar: `/icons/ds${game}/dialogues/${npcName}.webp`,
      lines: []
    };
    
    // 读取三种语言的对话
    for (const lang of languages) {
      const dialoguePath = path.join(__dirname, `../reference/text/${lang}${game}/dialogue/${npcFile}`);
      if (fs.existsSync(dialoguePath)) {
        const lines = await parseDialogueXml(dialoguePath);
        lines.forEach((line) => {
          const index = line.index;
          if (!dialogue.lines[index]) {
            dialogue.lines[index] = { 
              index, 
              chn: '', 
              jap: '', 
              eng: '',
              isUnused: false,
              isTitle: false
            };
          }
          dialogue.lines[index][lang] = line.text;
          
          // 检查特殊标记
          if (line.text.includes('##')) {
            dialogue.lines[index].isUnused = true;
          }
          if (line.text.includes('#0')) {
            dialogue.lines[index].isTitle = true;
          }
        });
      }
    }
    
    // 保存JSON
    const outputPath = path.join(outputDir, `${npcName}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(dialogue, null, 2), 'utf-8');
  }
  
  console.log(`  ✓ ${npcFiles.length} 个NPC对话已转换`);
}

async function main() {
  console.log('========================================');
  console.log('开始转换数据...');
  console.log('========================================');
  
  for (const game of games) {
    await convertGameData(game);
    await convertDialogues(game);
  }
  
  console.log('\n========================================');
  console.log('✓ 所有数据转换完成！');
  console.log('========================================\n');
}

main().catch(error => {
  console.error('转换失败:', error);
  process.exit(1);
});
