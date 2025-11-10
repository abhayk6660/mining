// === Auto Mining AFK Bot (Improved Warp System) ===

const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals: { GoalBlock } } = require('mineflayer-pathfinder');
const mineflayerTool = require('mineflayer-tool').plugin;

function createBot() {
  const bot = mineflayer.createBot({
    host: 'mc.leftypvp.net', // 🌐 Server IP
    port: 25565,             // 🔌 Port
    username: 'AssassinPlayZ', // 🤖 Username
    version: '1.21.1'        // ⚙️ Version
  });

  bot.loadPlugin(pathfinder);
  bot.loadPlugin(mineflayerTool);

  bot.once('spawn', () => {
    console.log('✅ Bot joined the server.');

    // Login first
    setTimeout(() => {
      bot.chat('/login KillerAadi1');
      console.log('🔐 Sent login command.');
    }, 2000);

    // Delay before warping
    setTimeout(() => {
      tryWarp();
    }, 8000);
  });

  // Try warping until success
  function tryWarp(attempt = 1) {
    if (attempt > 5) {
      console.log('⚠️ Warp failed after 5 tries.');
      startMining();
      return;
    }

    console.log(`🚀 Attempting warp (${attempt}/5)...`);
    bot.chat('/is warp abhay6660 afk');

    setTimeout(() => {
      if (!bot.entity.position || bot.entity.position.y < 5) {
        console.log('⏳ Warp not successful yet, retrying...');
        tryWarp(attempt + 1);
      } else {
        console.log('✅ Warp successful! Starting mining soon...');
        setTimeout(startMining, 5000);
      }
    }, 5000);
  }

  async function startMining() {
    const blockType = ['stone', 'deepslate', 'iron_ore', 'coal_ore', 'diamond_ore'];
    console.log('⛏️ Searching for mineable blocks...');

    const target = bot.findBlock({
      matching: block => blockType.includes(block.name),
      maxDistance: 6
    });

    if (!target) {
      console.log('❌ No block nearby. Waiting...');
      setTimeout(startMining, 3000);
      return;
    }

    try {
      console.log('🔨 Mining:', target.name);
      await bot.tool.equipForBlock(target, { requireHarvest: false });
      await bot.dig(target);
      console.log('✅ Mined:', target.name);
      setTimeout(startMining, 1000);
    } catch (err) {
      console.log('⚠️ Mining error:', err.message);
      setTimeout(startMining, 2000);
    }
  }

  bot.on('end', () => {
    console.log('🔄 Bot disconnected. Reconnecting in 5s...');
    setTimeout(createBot, 5000);
  });

  bot.on('kicked', console.log);
  bot.on('error', console.log);
}

createBot();
