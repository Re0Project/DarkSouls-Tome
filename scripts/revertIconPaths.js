import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 反向路径映射规则
const pathMapping = {
  '/icons/ring1/': '/icons/ds1/rings/',
  '/icons/weapon1/': '/icons/ds1/weapons/',
  '/icons/armor1/': '/icons/ds1/armors/',
  '/icons/item1/': '/icons/ds1/items/',
  '/icons/magic1/': '/icons/ds1/magics/',
  '/icons/dialogue1/': '/icons/ds1/dialogues/',
  
  '/icons/ring2/': '/icons/ds2/rings/',
  '/icons/weapon2/': '/icons/ds2/weapons/',
  '/icons/armor2/': '/icons/ds2/armors/',
  '/icons/item2/': '/icons/ds2/items/',
  '/icons/magic2/': '/icons/ds2/magics/',
  '/icons/dialogue2/': '/icons/ds2/dialogues/',
  
  '/icons/ring3/': '/icons/ds3/rings/',
  '/icons/weapon3/': '/icons/ds3/weapons/',
  '/icons/armor3/': '/icons/ds3/armors/',
  '/icons/item3/': '/icons/ds3/items/',
  '/icons/magic3/': '/icons/ds3/magics/',
  '/icons/dialogue3/': '/icons/ds3/dialogues/',
};

function revertIconPath(iconPath) {
  for (const [oldPath, newPath] of Object.entries(pathMapping)) {
    if (iconPath.startsWith(oldPath)) {
      return iconPath.replace(oldPath, newPath);
    }
  }
  return iconPath;
}

function processJsonFile(filePath) {
  console.log(`Processing: ${filePath}`);
  
  const content = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(content);
  
  let modified = false;
  
  // 回滚每个物品的 icon 路径
  data.forEach(item => {
    if (item.icon) {
      const oldIcon = item.icon;
      const newIcon = revertIconPath(oldIcon);
      if (oldIcon !== newIcon) {
        item.icon = newIcon;
        modified = true;
      }
    }
  });
  
  if (modified) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`✓ Reverted: ${filePath}`);
  } else {
    console.log(`- No changes: ${filePath}`);
  }
}

// 处理所有数据文件
const dataDir = path.join(__dirname, '../src/data');
const games = ['ds1', 'ds2', 'ds3'];
const types = ['rings', 'weapons', 'armors', 'items', 'magics', 'dialogues'];

games.forEach(game => {
  types.forEach(type => {
    const filePath = path.join(dataDir, game, `${type}.json`);
    if (fs.existsSync(filePath)) {
      processJsonFile(filePath);
    }
  });
});

console.log('\n✓ All icon paths reverted to original format!');
