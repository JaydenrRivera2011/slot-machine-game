// ==================== CONFIGURATION ====================
const GAME_CONFIG = {
    // Symbols with their values and weights
    symbols: {
        '🍎': { value: 10, weight: 15 },
        '🍊': { value: 15, weight: 14 },
        '🍋': { value: 20, weight: 13 },
        '🍌': { value: 25, weight: 12 },
        '🍇': { value: 30, weight: 11 },
        '🍓': { value: 35, weight: 10 },
        '🍑': { value: 40, weight: 9 },
        '🍒': { value: 50, weight: 8 },
        '🍍': { value: 60, weight: 7 },
        '🥝': { value: 70, weight: 6 },
    },
};

// ==================== GAME STATE ====================
let gameState = {
    currentUser: null,
    users: [],
    coins: 5000,
    gems: 100,
    totalSpins: 0,
    totalWins: 0,
    consecutiveWins: 0,
    sessionStart: new Date(),
    lastDailyReward: null,
    cosmetics: {
        activeReel: 'classic',
        owned: ['classic'],
    },
    achievements: {},
    level: 1,
    settings: {
        sound: true,
        music: true,
        notifications: true,
        autoSpin: false,
        reelTheme: 'classic',
        animationSpeed: 3,
    },
    // ACTIVE BOOSTS & UPGRADES
    activeBoosts: {
        doubleCoinMultiplier: 0, // expiry timestamp
        luckySpinsRemaining: 0,
        multiplierActive: 1, // base 1x
        luckBonus: 0, // bonus percentage
        magnetActive: false,
        goldTouchActive: false,
        spinMasterActive: false,
        fortuneWheelActive: false,
        jackpotBoosted: false,
        speedBoostActive: false,
        comboMeterCount: 0,
        vipActive: false,
        interestRate: 0.01,
        bonusHunterActive: false,
        streakGuardianActive: false,
        superSpinActive: false,
        minerActive: false,
    },
    itemsOwned: {}, // Track which items are owned
    dailyChallengeProgress: {},
    dailyChallengeDate: new Date().toDateString(),
};

// ==================== SHOP ITEMS (50 UNIQUE ITEMS) ====================
const SHOP_ITEMS = {
    upgrades: [
        { id: 1, name: 'Double Coins', icon: '💰', description: '2x coins for next 10 spins', price: 100, currency: 'coins', effect: 'doubleCoins', duration: 10 },
        { id: 2, name: 'Lucky Spin', icon: '🍀', description: '+10% win chance permanently', price: 150, currency: 'coins', effect: 'luckySpinPermanent' },
        { id: 3, name: 'Coin Magnet', icon: '🧲', description: '+30% extra coins per spin', price: 200, currency: 'coins', effect: 'magnetActive' },
        { id: 4, name: 'Golden Touch', icon: '✨', description: 'All symbols worth +50%', price: 250, currency: 'coins', effect: 'goldTouchActive' },
        { id: 5, name: 'Spin Master', icon: '🎯', description: 'Bet limit increased to 5000', price: 300, currency: 'coins', effect: 'spinMasterActive' },
        { id: 6, name: 'Fortune Wheel', icon: '🎡', description: 'Random 50-200 bonus on spins', price: 350, currency: 'coins', effect: 'fortuneWheelActive' },
        { id: 7, name: 'Jackpot Seeker', icon: '💎', description: '2x jackpot payouts', price: 400, currency: 'coins', effect: 'jackpotBoosted' },
        { id: 8, name: 'Speed Boost', icon: '⚡', description: 'Faster spin animations', price: 150, currency: 'coins', effect: 'speedBoostActive' },
        { id: 9, name: 'Combo Master', icon: '🔗', description: '+100 coins per win combo', price: 200, currency: 'coins', effect: 'comboMasterActive' },
        { id: 10, name: 'Premium Player', icon: '👑', description: 'All VIP features', price: 500, currency: 'coins', effect: 'vipActive' },
        { id: 11, name: 'Wealth Builder', icon: '🏦', description: '+1% daily interest on coins', price: 300, currency: 'coins', effect: 'wealthBuilder' },
        { id: 12, name: 'Bonus Hunter', icon: '🎁', description: '+500 coins daily bonus', price: 250, currency: 'coins', effect: 'bonusHunterActive' },
        { id: 13, name: 'Streak Guardian', icon: '🛡️', description: 'Protect 50% of bet on loss', price: 200, currency: 'coins', effect: 'streakGuardianActive' },
        { id: 14, name: 'Super Spin', icon: '🌟', description: '3x multiplier for next spin', price: 400, currency: 'coins', effect: 'superSpinNext' },
        { id: 15, name: 'Crypto Miner', icon: '⛏️', description: '+1 gem per 100 spins', price: 350, currency: 'coins', effect: 'minerActive' },
    ],
    cosmetics: [
        { id: 101, name: 'Rainbow Reels', icon: '🌈', description: 'Colorful spinning reels', price: 50, currency: 'gems', type: 'reel', theme: 'rainbow' },
        { id: 102, name: 'Fire Theme', icon: '🔥', description: 'Hot flames on spin', price: 75, currency: 'gems', type: 'reel', theme: 'fire' },
        { id: 103, name: 'Ice Theme', icon: '❄️', description: 'Frosty cool theme', price: 75, currency: 'gems', type: 'reel', theme: 'ice' },
        { id: 104, name: 'Galaxy Stars', icon: '⭐', description: 'Space theme reels', price: 100, currency: 'gems', type: 'reel', theme: 'galaxy' },
        { id: 105, name: 'Ocean Waves', icon: '🌊', description: 'Water animation theme', price: 80, currency: 'gems', type: 'reel', theme: 'ocean' },
        { id: 106, name: 'Forest Green', icon: '🌲', description: 'Nature inspired', price: 60, currency: 'gems', type: 'reel', theme: 'forest' },
        { id: 107, name: 'Sunset Gold', icon: '🌅', description: 'Golden sunset colors', price: 70, currency: 'gems', type: 'reel', theme: 'sunset' },
        { id: 108, name: 'Cherry Blossom', icon: '🌸', description: 'Springtime theme', price: 65, currency: 'gems', type: 'reel', theme: 'cherry' },
        { id: 109, name: 'Neon Lights', icon: '💡', description: 'Cyberpunk neon', price: 90, currency: 'gems', type: 'reel', theme: 'neon' },
        { id: 110, name: 'Matrix Code', icon: '👾', description: 'Digital matrix theme', price: 85, currency: 'gems', type: 'reel', theme: 'matrix' },
        { id: 111, name: 'Chrome Shine', icon: '💍', description: 'Metallic chrome look', price: 95, currency: 'gems', type: 'reel', theme: 'chrome' },
        { id: 112, name: 'Royal Purple', icon: '👑', description: 'Luxurious purple', price: 80, currency: 'gems', type: 'reel', theme: 'purple' },
        { id: 113, name: 'Cosmic Black', icon: '⚫', description: 'Dark space black', price: 70, currency: 'gems', type: 'reel', theme: 'cosmic' },
        { id: 114, name: 'Cotton Candy', icon: '🍭', description: 'Sweet pastel colors', price: 75, currency: 'gems', type: 'reel', theme: 'candy' },
        { id: 115, name: 'Electric Purple', icon: '⚡', description: 'Purple lightning', price: 85, currency: 'gems', type: 'reel', theme: 'electric' },
    ],
    boosters: [
        { id: 201, name: '1 Hour Multiplier', icon: '⏰', description: '2x coin rewards for 60 min', price: 50, currency: 'gems', effect: 'hourMultiplier', duration: 3600 },
        { id: 202, name: 'Daily Bonus Pack', icon: '📦', description: '+1000 coins & 50 gems NOW', price: 100, currency: 'gems', effect: 'bonusPackNow' },
        { id: 203, name: 'Lucky Spins x5', icon: '🍀', description: '5 guaranteed winning spins', price: 75, currency: 'gems', effect: 'luckySpins', uses: 5 },
        { id: 204, name: 'Gem Converter', icon: '💎', description: 'Convert 500 coins to 10 gems', price: 0, currency: 'special', effect: 'gemConverter', ratio: 500 },
        { id: 205, name: 'Reset Cooldown', icon: '🔄', description: 'Instant daily reward claim', price: 20, currency: 'gems', effect: 'resetCooldown' },
        { id: 206, name: 'Super Luck Potion', icon: '🧪', description: '+50% win rate for 60 min', price: 150, currency: 'gems', effect: 'luckPotion', duration: 3600 },
        { id: 207, name: 'Instant Wealth', icon: '💸', description: '+2000 coins instantly', price: 200, currency: 'gems', effect: 'instantWealth' },
        { id: 208, name: 'Gem Rain', icon: '🌧️', description: '+100 gems instantly', price: 500, currency: 'coins', effect: 'gemRain' },
        { id: 209, name: 'Level Up Boost', icon: '📈', description: 'Gain 1 level instantly', price: 75, currency: 'gems', effect: 'levelUpBoost' },
        { id: 210, name: 'Mystery Box', icon: '📭', description: 'Win 100-1000 random coins', price: 50, currency: 'gems', effect: 'mysteryBox' },
    ],
    special: [
        { id: 301, name: 'Starter Pack', icon: '🎁', description: '+5000 coins & 500 gems (1x ONLY)', price: 0, currency: 'special', effect: 'starterPack', oneTime: true },
        { id: 302, name: 'Weekly Pass', icon: '📅', description: '7 days +500 coins daily', price: 100, currency: 'gems', effect: 'weeklyPass', days: 7 },
        { id: 303, name: 'Monthly VIP', icon: '🎫', description: '30 days all features + 10k coins', price: 300, currency: 'gems', effect: 'monthlyVIP', days: 30 },
        { id: 304, name: 'Name Change', icon: '✏️', description: 'Change username (1x ONLY)', price: 150, currency: 'gems', effect: 'nameChange', oneTime: true },
        { id: 305, name: 'Avatar Frame', icon: '🖼️', description: 'Special leaderboard badge', price: 80, currency: 'gems', effect: 'avatarFrame' },
    ],
};

// ==================== ACHIEVEMENTS ====================
const ACHIEVEMENTS = {
    daily: [
        { id: 'd1', name: '5 Spins', icon: '🎰', goal: 5, type: 'spins', reward: 100, description: 'Spin the reels 5 times' },
        { id: 'd2', name: 'First Win', icon: '🎉', goal: 1, type: 'wins', reward: 250, description: 'Get your first win' },
        { id: 'd3', name: '50 Coins', icon: '💰', goal: 50, type: 'coins_earned', reward: 50, description: 'Earn 50 coins' },
        { id: 'd4', name: 'Quick Spins', icon: '⚡', goal: 20, type: 'spins', reward: 200, description: 'Complete 20 spins' },
        { id: 'd5', name: 'Lucky Day', icon: '🍀', goal: 5, type: 'wins', reward: 500, description: 'Get 5 wins in one day' },
    ],
    goals: [
        { id: 'g1', name: 'Millionaire', icon: '💎', goal: 1000000, type: 'total_coins', reward: 1000, description: 'Reach 1 million coins' },
        { id: 'g2', name: 'Spin Master', icon: '🎯', goal: 1000, type: 'spins', reward: 500, description: 'Complete 1000 spins' },
        { id: 'g3', name: 'Lucky Streak', icon: '🔥', goal: 10, type: 'consecutive_wins', reward: 750, description: 'Get 10 wins in a row' },
        { id: 'g4', name: 'Collector', icon: '🎨', goal: 20, type: 'cosmetics_owned', reward: 250, description: 'Own 20 cosmetics' },
        { id: 'g5', name: 'Shop Master', icon: '🛍️', goal: 25, type: 'items_bought', reward: 600, description: 'Buy 25 shop items' },
        { id: 'g6', name: 'Rich & Famous', icon: '🏆', goal: 100, type: 'leaderboard_rank', reward: 800, description: 'Reach top 100 leaderboard' },
        { id: 'g7', name: 'Triple Crown', icon: '👑', goal: 3, type: 'triple_match', reward: 1000, description: 'Get 3 matching symbols' },
    ],
    badges: [
        { id: 'b1', name: 'Beginner', icon: '🌟', goal: 1, type: 'milestone', reward: 100, description: 'Play your first spin' },
        { id: 'b2', name: 'Regular', icon: '⭐', goal: 10, type: 'milestone_spins', reward: 200, description: 'Play 10 spins' },
        { id: 'b3', name: 'Enthusiast', icon: '✨', goal: 100, type: 'milestone_spins', reward: 300, description: 'Play 100 spins' },
        { id: 'b4', name: 'Expert', icon: '💫', goal: 500, type: 'milestone_spins', reward: 500, description: 'Play 500 spins' },
        { id: 'b5', name: 'Legend', icon: '🌠', goal: 2000, type: 'milestone_spins', reward: 1000, description: 'Play 2000 spins' },
    ],
};

// ==================== UTILITY FUNCTIONS ====================

// Save game state to localStorage
function saveGameState() {
    localStorage.setItem('slotGameState', JSON.stringify(gameState));
    localStorage.setItem('users', JSON.stringify(gameState.users));
}

// Load game state from localStorage
function loadGameState() {
    const saved = localStorage.getItem('slotGameState');
    const users = localStorage.getItem('users');
    if (saved) gameState = { ...gameState, ...JSON.parse(saved) };
    if (users) gameState.users = JSON.parse(users);
    
    // Reset daily challenges if new day
    const today = new Date().toDateString();
    if (gameState.dailyChallengeDate !== today) {
        gameState.dailyChallengeProgress = {};
        gameState.dailyChallengeDate = today;
    }
}

// Weighted random symbol selector
function getRandomSymbol() {
    const symbols = Object.entries(GAME_CONFIG.symbols);
    const totalWeight = symbols.reduce((sum, [_, data]) => sum + data.weight, 0);
    let random = Math.random() * totalWeight;

    for (let [symbol, data] of symbols) {
        random -= data.weight;
        if (random <= 0) return symbol;
    }
    return symbols[0][0];
}

// Show notification
function showNotification(message, type = 'success') {
    if (!gameState.settings.notifications) return;
    const toast = document.getElementById('notificationToast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 3000);
}

// Update currency display
function updateCurrencyDisplay() {
    document.getElementById('coinsDisplay').textContent = gameState.coins.toLocaleString();
    document.getElementById('gemsDisplay').textContent = gameState.gems.toLocaleString();
    checkDailyReward();
}

// Check daily reward eligibility
function checkDailyReward() {
    const now = new Date();
    const lastReward = gameState.lastDailyReward ? new Date(gameState.lastDailyReward) : null;
    
    const isEligible = !lastReward || (now - lastReward) > 24 * 60 * 60 * 1000;
    
    const status = document.getElementById('dailyRewardStatus');
    if (isEligible) {
        status.textContent = 'Available ✓';
        status.style.color = 'var(--success)';
        status.style.cursor = 'pointer';
    } else {
        const timeLeft = lastReward ? Math.ceil((24 * 60 * 60 * 1000 - (now - lastReward)) / 1000 / 3600) : 0;
        status.textContent = `${timeLeft}h left`;
        status.style.color = 'var(--warning)';
    }
}

// Claim daily reward
function claimDailyReward() {
    const now = new Date();
    const lastReward = gameState.lastDailyReward ? new Date(gameState.lastDailyReward) : null;
    
    if (lastReward && (now - lastReward) < 24 * 60 * 60 * 1000) {
        showNotification('Daily reward available in ' + Math.ceil((24 * 60 * 60 * 1000 - (now - lastReward)) / 1000 / 3600) + ' hours!', 'warning');
        return;
    }

    let baseReward = Math.floor(Math.random() * (500 - 200 + 1)) + 200;
    
    // Apply bonus hunter
    if (gameState.itemsOwned[12]) {
        baseReward += 500;
    }

    gameState.coins += baseReward;
    gameState.lastDailyReward = new Date().toISOString();
    saveGameState();
    updateCurrencyDisplay();
    showNotification(`🎁 Claimed ${baseReward} coins!`, 'success');
}

// Update stats display
function updateStats() {
    const winRate = gameState.totalSpins > 0 ? ((gameState.totalWins / gameState.totalSpins) * 100).toFixed(1) : 0;
    document.getElementById('totalSpins').textContent = gameState.totalSpins;
    document.getElementById('totalWins').textContent = gameState.totalWins;
    document.getElementById('winRate').textContent = `${winRate}%`;
}

// ==================== SLOT MACHINE LOGIC ====================

async function spin() {
    const betAmount = parseInt(document.getElementById('betAmount').value);
    
    // Get max bet based on upgrades
    let maxBet = 1000;
    if (gameState.itemsOwned[5]) maxBet = 5000;

    // Validation
    if (betAmount > gameState.coins) {
        showNotification('Insufficient coins!', 'error');
        return;
    }

    if (betAmount > maxBet) {
        showNotification(`Max bet is ${maxBet}!`, 'error');
        return;
    }

    // Disable spin button
    const spinBtn = document.getElementById('spinBtn');
    spinBtn.disabled = true;

    let actualBet = betAmount;
    
    // Streak Guardian - protect 50% on loss
    const hasStreakGuardian = gameState.itemsOwned[13];
    const hasLuckySpins = gameState.activeBoosts.luckySpinsRemaining > 0;

    // Deduct bet
    gameState.coins -= betAmount;
    updateCurrencyDisplay();

    // Spin reels with speed boost
    const reels = ['reel1', 'reel2', 'reel3'];
    const spinDuration = gameState.itemsOwned[8] ? 600 : 1000;
    const spinVariance = gameState.itemsOwned[8] ? 250 : 500;

    for (let reel of reels) {
        document.getElementById(reel).classList.add('spinning');
    }

    // Simulate spinning
    await new Promise(resolve => setTimeout(resolve, spinDuration + Math.random() * spinVariance));

    // Get random symbols
    const results = [];
    for (let i = 0; i < 3; i++) {
        results.push(getRandomSymbol());
    }

    // Stop reels and display symbols with theme
    for (let i = 0; i < reels.length; i++) {
        document.getElementById(reels[i]).classList.remove('spinning');
        const reel = document.getElementById(reels[i]);
        reel.innerHTML = `<div class="reel-item">${results[i]}</div>`;
        applyReelTheme(reel);
    }

    // Calculate winnings
    let winAmount = 0;
    const matchCount = getMatchCount(results);
    let baseMultiplier = 1;

    // Apply upgrades
    if (gameState.itemsOwned[4]) baseMultiplier *= 1.5; // Golden Touch
    if (gameState.itemsOwned[3]) baseMultiplier *= 1.3; // Coin Magnet
    
    // Apply active boosts
    baseMultiplier *= gameState.activeBoosts.multiplierActive;
    if (gameState.activeBoosts.doubleCoinMultiplier > Date.now()) {
        baseMultiplier *= 2;
    }

    // Lucky Spins guarantee win
    if (hasLuckySpins) {
        winAmount = betAmount * GAME_CONFIG.symbols[results[0]].value * 5 * baseMultiplier;
        gameState.activeBoosts.luckySpinsRemaining--;
        gameState.totalWins++;
        gameState.consecutiveWins++;
        showNotification('🍀 Lucky Spin Guaranteed!', 'success');
    } else if (matchCount === 3) {
        // Three of a kind jackpot
        let jackpotMultiplier = gameState.itemsOwned[7] ? 2 : 1; // Jackpot Seeker
        winAmount = betAmount * GAME_CONFIG.symbols[results[0]].value * 10 * baseMultiplier * jackpotMultiplier;
        gameState.totalWins++;
        gameState.consecutiveWins++;
        showNotification('🎉 JACKPOT! Three of a kind!', 'success');
    } else if (matchCount === 2) {
        // Two of a kind
        winAmount = betAmount * GAME_CONFIG.symbols[results[0]].value * 3 * baseMultiplier;
        gameState.totalWins++;
        gameState.consecutiveWins++;
        showNotification('🎊 You got a match!', 'success');
        
        // Combo Master bonus
        if (gameState.itemsOwned[9]) {
            winAmount += 100;
        }
    } else {
        // No match but still get base value
        winAmount = Math.floor(betAmount * (GAME_CONFIG.symbols[results[0]].value / 100) * baseMultiplier);
        gameState.consecutiveWins = 0;
        
        // Streak Guardian - refund 50% of bet
        if (hasStreakGuardian) {
            const refund = Math.floor(betAmount * 0.5);
            winAmount += refund;
            showNotification(`🛡️ Streak Guardian refunded ${refund} coins!`, 'success');
        }
    }

    // Fortune Wheel random bonus
    if (gameState.itemsOwned[6] && matchCount > 0) {
        const bonus = Math.floor(Math.random() * (200 - 50 + 1)) + 50;
        winAmount += bonus;
        showNotification(`🎡 Fortune Wheel bonus: +${bonus} coins!`, 'success');
    }

    // Apply active luck potion
    if (gameState.activeBoosts.luckBonus > Date.now()) {
        const luckBonus = Math.floor(winAmount * 0.5);
        winAmount += luckBonus;
    }

    // Ensure minimum payout for no match
    if (matchCount === 0 && winAmount < 1) winAmount = 0;

    gameState.coins += winAmount;
    gameState.totalSpins++;

    // Miner - earn gems
    if (gameState.itemsOwned[15]) {
        if (gameState.totalSpins % 100 === 0) {
            gameState.gems += 1;
        }
    }

    // Update displays
    updateCurrencyDisplay();
    updateStats();
    saveGameState();

    // Display result
    const resultText = document.getElementById('resultText');
    const winAmountText = document.getElementById('winAmount');

    if (matchCount === 3) {
        resultText.textContent = `🎰 ${results.join(' ')} 🎰`;
        resultText.style.color = 'var(--accent)';
    } else if (matchCount === 2) {
        resultText.textContent = `✨ Match Found!`;
        resultText.style.color = 'var(--secondary)';
    } else {
        resultText.textContent = 'Try again!';
        resultText.style.color = 'var(--primary)';
    }

    winAmountText.textContent = `Win: ${winAmount} coins`;
    winAmountText.style.color = winAmount > 0 ? 'var(--success)' : 'var(--danger)';

    // Re-enable spin button
    spinBtn.disabled = false;

    // Check achievements
    checkAchievements();
}

// Apply reel theme styling
function applyReelTheme(reelElement) {
    const theme = gameState.cosmetics.activeReel;
    
    const themes = {
        classic: { bg: 'linear-gradient(135deg, #1a1a2e, #0f3460)', border: '#ff6b9d' },
        101: { bg: 'linear-gradient(135deg, #ff0000, #ffff00)', border: '#00ff00' }, // Rainbow
        102: { bg: 'linear-gradient(135deg, #ff4500, #ffa500)', border: '#ffff00' }, // Fire
        103: { bg: 'linear-gradient(135deg, #00bfff, #87ceeb)', border: '#e0ffff' }, // Ice
        104: { bg: 'linear-gradient(135deg, #191970, #000080)', border: '#00ffff' }, // Galaxy
        105: { bg: 'linear-gradient(135deg, #1e90ff, #00bfff)', border: '#00ddff' }, // Ocean
        106: { bg: 'linear-gradient(135deg, #228b22, #32cd32)', border: '#90ee90' }, // Forest
        107: { bg: 'linear-gradient(135deg, #ff8c00, #ffa500)', border: '#ffd700' }, // Sunset
        108: { bg: 'linear-gradient(135deg, #ffb6c1, #ff69b4)', border: '#ff1493' }, // Cherry
        109: { bg: 'linear-gradient(135deg, #00ff00, #00ffff)', border: '#ff00ff' }, // Neon
        110: { bg: 'linear-gradient(135deg, #00ff00, #000000)', border: '#00ff00' }, // Matrix
        111: { bg: 'linear-gradient(135deg, #c0c0c0, #e8e8e8)', border: '#ffffff' }, // Chrome
        112: { bg: 'linear-gradient(135deg, #800080, #4b0082)', border: '#da70d6' }, // Purple
        113: { bg: 'linear-gradient(135deg, #000000, #1a1a1a)', border: '#666666' }, // Cosmic
        114: { bg: 'linear-gradient(135deg, #ffb6c1, #ffe4e1)', border: '#ffc0cb' }, // Candy
        115: { bg: 'linear-gradient(135deg, #9932cc, #ba55d3)', border: '#00ffff' }, // Electric
    };

    const themeData = themes[theme] || themes.classic;
    reelElement.style.background = themeData.bg;
    reelElement.style.borderColor = themeData.border;
}

// Count matching symbols
function getMatchCount(results) {
    if (results[0] === results[1] && results[1] === results[2]) return 3;
    if (results[0] === results[1] || results[1] === results[2] || results[0] === results[2]) return 2;
    return 0;
}

// ==================== USER MANAGEMENT ====================

function createUser() {
    const username = document.getElementById('usernameInput').value.trim();

    if (!username || username.length < 3) {
        showNotification('Username must be 3-20 characters', 'error');
        return;
    }

    // Check if username exists
    if (gameState.users.some(u => u.name === username)) {
        showNotification('Username already taken!', 'error');
        return;
    }

    // Create new user
    const newUser = {
        id: Date.now(),
        name: username,
        coins: 5000,
        gems: 100,
        level: 1,
        totalSpins: 0,
        totalWins: 0,
        consecutiveWins: 0,
        createdDate: new Date().toISOString(),
        cosmetics: { activeReel: 'classic', owned: ['classic'] },
        achievements: {},
        itemsOwned: {},
        activeBoosts: { ...gameState.activeBoosts },
    };

    gameState.users.push(newUser);
    gameState.currentUser = newUser;
    gameState.coins = 5000;
    gameState.gems = 100;
    gameState.totalSpins = 0;
    gameState.totalWins = 0;
    gameState.consecutiveWins = 0;
    gameState.achievements = {};
    gameState.itemsOwned = {};

    saveGameState();
    document.getElementById('usernameInput').value = '';
    switchToGameScreen();
}

function selectExistingUser(userId) {
    const user = gameState.users.find(u => u.id === userId);
    if (user) {
        gameState.currentUser = user;
        gameState.coins = user.coins;
        gameState.gems = user.gems;
        gameState.totalSpins = user.totalSpins;
        gameState.totalWins = user.totalWins;
        gameState.consecutiveWins = user.consecutiveWins || 0;
        gameState.achievements = user.achievements || {};
        gameState.cosmetics = user.cosmetics || { activeReel: 'classic', owned: ['classic'] };
        gameState.itemsOwned = user.itemsOwned || {};
        gameState.activeBoosts = user.activeBoosts || { ...gameState.activeBoosts };
        saveGameState();
        switchToGameScreen();
    }
}

function logout() {
    if (gameState.currentUser) {
        // Save user data
        const userIndex = gameState.users.findIndex(u => u.id === gameState.currentUser.id);
        if (userIndex !== -1) {
            gameState.users[userIndex] = {
                ...gameState.users[userIndex],
                coins: gameState.coins,
                gems: gameState.gems,
                totalSpins: gameState.totalSpins,
                totalWins: gameState.totalWins,
                consecutiveWins: gameState.consecutiveWins,
                cosmetics: gameState.cosmetics,
                achievements: gameState.achievements,
                itemsOwned: gameState.itemsOwned,
                activeBoosts: gameState.activeBoosts,
            };
        }
        saveGameState();
    }

    gameState.currentUser = null;
    switchToAuthScreen();
}

// ==================== SCREEN MANAGEMENT ====================

function switchToAuthScreen() {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('authScreen').classList.add('active');
    loadExistingUsers();
}

function switchToGameScreen() {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('gameScreen').classList.add('active');
    updateCurrencyDisplay();
    updateStats();
    loadShopItems();
    loadAchievements();
}

function loadExistingUsers() {
    const container = document.getElementById('existingUsers');
    container.innerHTML = '';

    if (gameState.users.length === 0) {
        container.innerHTML = '<p style="color: #999; margin-top: 20px;">No accounts yet. Create one above!</p>';
        return;
    }

    gameState.users.forEach(user => {
        const btn = document.createElement('button');
        btn.className = 'existing-user-btn';
        btn.innerHTML = `👤 ${user.name} <br><small>${user.totalSpins} spins | ${user.coins} coins</small>`;
        btn.onclick = () => selectExistingUser(user.id);
        container.appendChild(btn);
    });
}

// ==================== SHOP SYSTEM ====================

function loadShopItems() {
    const shopItems = document.getElementById('shopItems');
    const activeTab = document.querySelector('.shop-tab.active')?.dataset.tab || 'upgrades';
    
    shopItems.innerHTML = '';
    
    let items = [];
    if (activeTab === 'upgrades') items = SHOP_ITEMS.upgrades;
    else if (activeTab === 'cosmetics') items = SHOP_ITEMS.cosmetics;
    else if (activeTab === 'boosters') items = SHOP_ITEMS.boosters;
    else if (activeTab === 'special') items = SHOP_ITEMS.special;

    items.forEach(item => {
        const owned = gameState.itemsOwned[item.id] || false;
        const itemEl = document.createElement('div');
        itemEl.className = `shop-item ${owned ? 'purchased' : ''}`;
        
        let priceText = '';
        if (item.currency === 'coins') priceText = `🪙 ${item.price}`;
        else if (item.currency === 'gems') priceText = `💎 ${item.price}`;
        else priceText = 'Special';

        itemEl.innerHTML = `
            <div class="shop-item-icon">${item.icon}</div>
            <div class="shop-item-name">${item.name}</div>
            <div class="shop-item-description">${item.description}</div>
            <div class="shop-item-price">${priceText}</div>
            <button class="shop-item-button" ${owned ? 'disabled' : ''}>
                ${owned ? '✓ Owned' : 'Buy'}
            </button>
        `;

        if (!owned) {
            itemEl.querySelector('.shop-item-button').onclick = () => buyItem(item);
        }

        shopItems.appendChild(itemEl);
    });
}

function buyItem(item) {
    // Check if one-time and already owned
    if (item.oneTime && gameState.itemsOwned[item.id]) {
        showNotification('You already own this item!', 'error');
        return;
    }

    // Check currency
    if (item.currency === 'coins') {
        if (gameState.coins < item.price) {
            showNotification('Insufficient coins!', 'error');
            return;
        }
        gameState.coins -= item.price;
    } else if (item.currency === 'gems') {
        if (gameState.gems < item.price) {
            showNotification('Insufficient gems!', 'error');
            return;
        }
        gameState.gems -= item.price;
    }

    // APPLY ITEM EFFECTS
    applyItemEffect(item);

    gameState.itemsOwned[item.id] = true;

    // Save and update
    saveGameState();
    updateCurrencyDisplay();
    loadShopItems();
    showNotification(`🎉 Purchased ${item.name}!`, 'success');
}

function applyItemEffect(item) {
    const now = Date.now();
    
    switch(item.effect) {
        case 'doubleCoins':
            gameState.activeBoosts.doubleCoinMultiplier = now + (item.duration * 1000);
            showNotification('💰 2x coins for next 10 spins activated!', 'success');
            break;
        
        case 'luckySpinPermanent':
            gameState.activeBoosts.luckBonus = 0.1; // +10% permanent
            showNotification('🍀 Luck bonus +10% applied permanently!', 'success');
            break;
        
        case 'magnetActive':
            gameState.itemsOwned[3] = true;
            showNotification('🧲 Coin Magnet always active!', 'success');
            break;
        
        case 'goldTouchActive':
            gameState.itemsOwned[4] = true;
            showNotification('✨ Golden Touch always active!', 'success');
            break;
        
        case 'spinMasterActive':
            gameState.itemsOwned[5] = true;
            showNotification('🎯 Bet limit increased to 5000!', 'success');
            break;
        
        case 'fortuneWheelActive':
            gameState.itemsOwned[6] = true;
            showNotification('🎡 Fortune Wheel always active!', 'success');
            break;
        
        case 'jackpotBoosted':
            gameState.itemsOwned[7] = true;
            showNotification('💎 Jackpots now worth 2x!', 'success');
            break;
        
        case 'speedBoostActive':
            gameState.itemsOwned[8] = true;
            showNotification('⚡ Spins are now faster!', 'success');
            break;
        
        case 'comboMasterActive':
            gameState.itemsOwned[9] = true;
            showNotification('🔗 +100 coins per win combo!', 'success');
            break;
        
        case 'vipActive':
            gameState.itemsOwned[10] = true;
            showNotification('👑 VIP features unlocked!', 'success');
            break;
        
        case 'wealthBuilder':
            gameState.itemsOwned[11] = true;
            const interest = Math.floor(gameState.coins * 0.01);
            gameState.coins += interest;
            showNotification(`🏦 Daily interest: +${interest} coins!`, 'success');
            break;
        
        case 'bonusHunterActive':
            gameState.itemsOwned[12] = true;
            gameState.coins += 500;
            showNotification('🎁 +500 bonus coins received!', 'success');
            break;
        
        case 'streakGuardianActive':
            gameState.itemsOwned[13] = true;
            showNotification('🛡️ Losses now protected 50%!', 'success');
            break;
        
        case 'superSpinNext':
            gameState.activeBoosts.multiplierActive = 3;
            showNotification('🌟 3x multiplier active next spin!', 'success');
            setTimeout(() => {
                gameState.activeBoosts.multiplierActive = 1;
            }, 5000);
            break;
        
        case 'minerActive':
            gameState.itemsOwned[15] = true;
            showNotification('⛏️ Earn +1 gem per 100 spins!', 'success');
            break;
        
        case 'hourMultiplier':
            gameState.activeBoosts.doubleCoinMultiplier = now + (item.duration * 1000);
            showNotification('⏰ 2x multiplier for 1 hour!', 'success');
            break;
        
        case 'bonusPackNow':
            gameState.coins += 1000;
            gameState.gems += 50;
            showNotification('📦 +1000 coins & +50 gems!', 'success');
            break;
        
        case 'luckySpins':
            gameState.activeBoosts.luckySpinsRemaining = item.uses;
            showNotification(`🍀 ${item.uses} lucky spins ready!`, 'success');
            break;
        
        case 'resetCooldown':
            claimDailyReward();
            break;
        
        case 'luckPotion':
            gameState.activeBoosts.luckBonus = now + (item.duration * 1000);
            showNotification('🧪 +50% luck for 1 hour!', 'success');
            break;
        
        case 'instantWealth':
            gameState.coins += 2000;
            showNotification('💸 +2000 coins instantly!', 'success');
            break;
        
        case 'gemRain':
            gameState.gems += 100;
            showNotification('🌧️ +100 gems received!', 'success');
            break;
        
        case 'levelUpBoost':
            gameState.level++;
            showNotification('📈 Level up! New level: ' + gameState.level, 'success');
            break;
        
        case 'mysteryBox':
            const mystery = Math.floor(Math.random() * (1000 - 100 + 1)) + 100;
            gameState.coins += mystery;
            showNotification(`📭 Mystery box: +${mystery} coins!`, 'success');
            break;
        
        case 'starterPack':
            gameState.coins += 5000;
            gameState.gems += 500;
            showNotification('🎁 Starter Pack: +5000 coins & +500 gems!', 'success');
            break;
        
        case 'weeklyPass':
            gameState.coins += 500;
            showNotification('📅 Weekly pass: +500 coins/day for 7 days!', 'success');
            break;
        
        case 'monthlyVIP':
            gameState.coins += 10000;
            showNotification('🎫 Monthly VIP: +10000 coins & all features!', 'success');
            break;
        
        case 'nameChange':
            // Prompt for new name
            const newName = prompt('Enter new username:');
            if (newName && newName.length >= 3) {
                if (!gameState.users.some(u => u.name === newName && u.id !== gameState.currentUser.id)) {
                    gameState.currentUser.name = newName;
                    showNotification(`✏️ Username changed to ${newName}!`, 'success');
                } else {
                    showNotification('Username already taken!', 'error');
                }
            }
            break;
        
        case 'avatarFrame':
            showNotification('🖼️ Avatar frame applied!', 'success');
            break;
    }
}

// ==================== COSMETICS SYSTEM ====================

function updateProfile() {
    const profile = document.getElementById('profileScreen');
    
    document.getElementById('profileUsername').textContent = gameState.currentUser?.name || '-';
    document.getElementById('profileCreatedDate').textContent = gameState.currentUser?.createdDate 
        ? new Date(gameState.currentUser.createdDate).toLocaleDateString() 
        : '-';
    document.getElementById('profileLevel').textContent = gameState.level || 1;

    // Load cosmetics
    const cosmeticsList = document.getElementById('cosmeticsList');
    cosmeticsList.innerHTML = '';
    
    // Add classic first
    const classicDiv = document.createElement('div');
    classicDiv.className = `cosmetic-item ${gameState.cosmetics.activeReel === 'classic' ? 'active' : ''}`;
    classicDiv.innerHTML = `<div style="font-size: 2em;">🎰</div><div style="font-size: 0.8em;">Classic</div>`;
    classicDiv.onclick = () => selectCosmetic('classic');
    cosmeticsList.appendChild(classicDiv);
    
    // Add purchased cosmetics
    SHOP_ITEMS.cosmetics.forEach(cosmetic => {
        const owned = gameState.itemsOwned[cosmetic.id];
        if (owned) {
            const div = document.createElement('div');
            div.className = `cosmetic-item ${gameState.cosmetics.activeReel === cosmetic.id ? 'active' : ''}`;
            div.innerHTML = `<div style="font-size: 2em;">${cosmetic.icon}</div><div style="font-size: 0.8em;">${cosmetic.name}</div>`;
            div.onclick = () => selectCosmetic(cosmetic.id);
            cosmeticsList.appendChild(div);
        }
    });
}

function selectCosmetic(cosmeticId) {
    gameState.cosmetics.activeReel = cosmeticId;
    saveGameState();
    updateProfile();
    showNotification('Cosmetic applied!', 'success');
}

// ==================== LEADERBOARD ====================

function updateLeaderboard() {
    const leaderboardList = document.getElementById('leaderboardList');
    const filter = document.querySelector('.filter-btn.active')?.dataset.filter || 'wealth';

    let sortedUsers = [...gameState.users];

    if (filter === 'wealth') {
        sortedUsers.sort((a, b) => (b.coins || 0) - (a.coins || 0));
    } else if (filter === 'spins') {
        sortedUsers.sort((a, b) => (b.totalSpins || 0) - (a.totalSpins || 0));
    } else if (filter === 'wins') {
        sortedUsers.sort((a, b) => (b.totalWins || 0) - (a.totalWins || 0));
    } else if (filter === 'level') {
        sortedUsers.sort((a, b) => (b.level || 1) - (a.level || 1));
    }

    leaderboardList.innerHTML = '';
    sortedUsers.slice(0, 50).forEach((user, index) => {
        const rank = index + 1;
        let value = 0;
        if (filter === 'wealth') value = user.coins;
        else if (filter === 'spins') value = user.totalSpins;
        else if (filter === 'wins') value = user.totalWins;
        else if (filter === 'level') value = user.level;

        const entry = document.createElement('div');
        entry.className = 'leaderboard-entry';
        entry.innerHTML = `
            <div class="leaderboard-rank rank-${Math.min(rank, 3)}">#${rank}</div>
            <div class="leaderboard-info">
                <div class="leaderboard-name">${user.name}</div>
                <div class="leaderboard-detail">Level ${user.level || 1}</div>
            </div>
            <div class="leaderboard-value">${value.toLocaleString()}</div>
        `;
        leaderboardList.appendChild(entry);
    });

    // Show user's rank
    let userRank = sortedUsers.findIndex(u => u.id === gameState.currentUser?.id) + 1;
    const myRankInfo = document.getElementById('myRankInfo');
    myRankInfo.innerHTML = `
        <div class="rank-stat">
            <div class="rank-stat-label">Your Rank</div>
            <div class="rank-stat-value">#${userRank || '-'}</div>
        </div>
        <div class="rank-stat">
            <div class="rank-stat-label">Total Coins</div>
            <div class="rank-stat-value">${gameState.coins.toLocaleString()}</div>
        </div>
        <div class="rank-stat">
            <div class="rank-stat-label">Total Spins</div>
            <div class="rank-stat-value">${gameState.totalSpins.toLocaleString()}</div>
        </div>
        <div class="rank-stat">
            <div class="rank-stat-label">Win Rate</div>
            <div class="rank-stat-value">${gameState.totalSpins > 0 ? ((gameState.totalWins / gameState.totalSpins) * 100).toFixed(1) : 0}%</div>
        </div>
    `;
}

// ==================== ACHIEVEMENTS ====================

function loadAchievements() {
    const achievementsList = document.getElementById('achievementsList');
    const activeTab = document.querySelector('.ach-tab.active')?.dataset.tab || 'daily';

    achievementsList.innerHTML = '';
    
    let achievements = [];
    if (activeTab === 'daily') achievements = ACHIEVEMENTS.daily;
    else if (activeTab === 'goals') achievements = ACHIEVEMENTS.goals;
    else if (activeTab === 'achievements') achievements = ACHIEVEMENTS.badges;

    achievements.forEach(ach => {
        const progress = gameState.achievements[ach.id] || 0;
        const isCompleted = progress >= ach.goal;
        
        const achEl = document.createElement('div');
        achEl.className = `achievement-item ${isCompleted ? '' : 'locked'}`;
        achEl.innerHTML = `
            <div class="achievement-icon">${ach.icon}</div>
            <div class="achievement-title">${ach.name}</div>
            <div class="achievement-description">${ach.description}</div>
            <div class="achievement-progress">
                <div class="achievement-progress-bar" style="width: ${Math.min((progress / ach.goal) * 100, 100)}%"></div>
            </div>
            <div style="font-size: 0.85em; margin-bottom: 5px;">${progress}/${ach.goal}</div>
            <div class="achievement-reward">+${ach.reward} coins</div>
        `;
        achievementsList.appendChild(achEl);
    });
}

function checkAchievements() {
    const spinsCount = gameState.totalSpins;
    const winsCount = gameState.totalWins;
    const coinsBalance = gameState.coins;

    // Update daily achievements
    ACHIEVEMENTS.daily.forEach(ach => {
        let progress = gameState.achievements[ach.id] || 0;

        if (ach.type === 'spins') {
            progress = spinsCount;
        } else if (ach.type === 'wins') {
            progress = winsCount;
        } else if (ach.type === 'coins_earned') {
            progress = Math.min(coinsBalance, ach.goal);
        }

        const wasCompleted = progress - 1 >= ach.goal;
        gameState.achievements[ach.id] = progress;

        if (progress >= ach.goal && !wasCompleted) {
            gameState.coins += ach.reward;
            showNotification(`🏆 Achievement Unlocked: ${ach.name}! +${ach.reward} coins`, 'success');
        }
    });

    // Update goal achievements
    ACHIEVEMENTS.goals.forEach(ach => {
        let progress = gameState.achievements[ach.id] || 0;

        if (ach.type === 'spins') {
            progress = spinsCount;
        } else if (ach.type === 'wins') {
            progress = winsCount;
        } else if (ach.type === 'consecutive_wins') {
            progress = gameState.consecutiveWins;
        } else if (ach.type === 'cosmetics_owned') {
            progress = Object.keys(gameState.itemsOwned).filter(k => SHOP_ITEMS.cosmetics.some(c => c.id == k)).length + 1; // +1 for classic
        } else if (ach.type === 'items_bought') {
            progress = Object.keys(gameState.itemsOwned).length;
        } else if (ach.type === 'total_coins') {
            progress = coinsBalance;
        }

        const wasCompleted = (gameState.achievements[ach.id] || 0) >= ach.goal;
        gameState.achievements[ach.id] = progress;

        if (progress >= ach.goal && !wasCompleted) {
            gameState.coins += ach.reward;
            showNotification(`🏆 Achievement Unlocked: ${ach.name}! +${ach.reward} coins`, 'success');
        }
    });

    // Update badge achievements
    ACHIEVEMENTS.badges.forEach(ach => {
        let progress = gameState.achievements[ach.id] || 0;

        if (ach.type === 'milestone' && spinsCount >= 1) {
            progress = 1;
        } else if (ach.type === 'milestone_spins') {
            progress = spinsCount;
        }

        const wasCompleted = (gameState.achievements[ach.id] || 0) >= ach.goal;
        gameState.achievements[ach.id] = progress;

        if (progress >= ach.goal && !wasCompleted) {
            gameState.coins += ach.reward;
            showNotification(`🏆 Badge Earned: ${ach.name}! +${ach.reward} coins`, 'success');
        }
    });

    saveGameState();
}

// ==================== EVENT LISTENERS ====================

document.addEventListener('DOMContentLoaded', () => {
    loadGameState();

    // Auth screen
    document.getElementById('createUserBtn').onclick = createUser;
    document.getElementById('usernameInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') createUser();
    });

    // Game controls
    document.getElementById('spinBtn').onclick = spin;
    document.getElementById('betPlusBtn').onclick = () => {
        const bet = document.getElementById('betAmount');
        bet.value = Math.min(parseInt(bet.value) + 10, 5000);
    };
    document.getElementById('betMinusBtn').onclick = () => {
        const bet = document.getElementById('betAmount');
        bet.value = Math.max(parseInt(bet.value) - 10, 1);
    };

    // Preset bets
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.onclick = () => {
            document.getElementById('betAmount').value = btn.dataset.amount;
        };
    });

    // Navigation
    document.getElementById('profileBtn').onclick = () => {
        document.getElementById('profileScreen').classList.add('active');
        updateProfile();
    };
    document.getElementById('shopBtn').onclick = () => {
        document.getElementById('shopScreen').classList.add('active');
        loadShopItems();
    };
    document.getElementById('leaderboardBtn').onclick = () => {
        document.getElementById('leaderboardScreen').classList.add('active');
        updateLeaderboard();
    };
    document.getElementById('achievementsBtn').onclick = () => {
        document.getElementById('achievementsScreen').classList.add('active');
        loadAchievements();
    };
    document.getElementById('logoutBtn').onclick = logout;

    // Daily reward
    document.getElementById('dailyRewardStatus').addEventListener('click', claimDailyReward);

    // Modal close buttons
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.onclick = () => btn.closest('.screen').classList.remove('active');
    });

    // Modal backdrop
    document.querySelectorAll('.screen.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('active');
        });
    });

    // Shop tabs
    document.querySelectorAll('.shop-tab').forEach(tab => {
        tab.onclick = () => {
            document.querySelectorAll('.shop-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            loadShopItems();
        };
    });

    // Leaderboard filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateLeaderboard();
        };
    });

    // Achievement tabs
    document.querySelectorAll('.ach-tab').forEach(tab => {
        tab.onclick = () => {
            document.querySelectorAll('.ach-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            loadAchievements();
        };
    });

    // Settings
    document.getElementById('soundToggle').onchange = (e) => {
        gameState.settings.sound = e.target.checked;
        saveGameState();
    };
    document.getElementById('musicToggle').onchange = (e) => {
        gameState.settings.music = e.target.checked;
        saveGameState();
    };
    document.getElementById('notificationsToggle').onchange = (e) => {
        gameState.settings.notifications = e.target.checked;
        saveGameState();
    };
    document.getElementById('autoSpinToggle').onchange = (e) => {
        gameState.settings.autoSpin = e.target.checked;
        saveGameState();
    };
    document.getElementById('reelTheme').onchange = (e) => {
        gameState.settings.reelTheme = e.target.value;
        document.body.className = `theme-${e.target.value}`;
        saveGameState();
    };
    document.getElementById('animationSpeed').onchange = (e) => {
        gameState.settings.animationSpeed = e.target.value;
        document.body.className = `speed-${e.target.value}`;
        saveGameState();
    };

    // Initial setup
    if (gameState.currentUser) {
        switchToGameScreen();
    } else {
        switchToAuthScreen();
    }

    // Apply saved theme
    if (gameState.settings.reelTheme) {
        document.getElementById('reelTheme').value = gameState.settings.reelTheme;
        document.body.className = `theme-${gameState.settings.reelTheme}`;
    }
});
