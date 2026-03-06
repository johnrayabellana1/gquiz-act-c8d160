// GQuiz State Manager
var GQ = {
    save() { localStorage.setItem('gquiz_state', JSON.stringify(this.s)); },
    load() { var d = localStorage.getItem('gquiz_state'); if (d) this.s = JSON.parse(d); return this.s; },

    cu() { return this.s.cu ? this.s.users[this.s.cu] || null : null; },
    currentUser() { return this.cu(); },
    isLoggedIn() { return !!(this.s.cu && this.s.users[this.s.cu]); },
    requireLogin() { if (!this.isLoggedIn()) { location.href = 'login.html'; return false; } return true; },

    register(u, pw, name) {
        if (this.s.users[u]) return { ok: false, msg: 'Username already taken.' };
        this.s.users[u] = { username: u, password: pw, displayName: name || u, coins: 100, xp: 0,
            rank: '🌱 Beginner', joinDate: new Date().toLocaleDateString(),
            inventory: [], notifications: [], settings: { sound: true, theme: 'dark', language: 'English' }, progress: {} };
        this.save(); return { ok: true };
    },

    login(u, pw) {
        var x = this.s.users[u];
        if (!x) return { ok: false, msg: 'User not found.' };
        if (x.password !== pw) return { ok: false, msg: 'Wrong password.' };
        this.s.cu = u;
        this.addNotification('Welcome back, ' + x.displayName + '!', 'fa-hand-wave');
        this.save(); return { ok: true };
    },

    logout() { this.s.cu = null; this.save(); location.href = 'login.html'; },

    getProgress(s, d, l) {
        var u = this.cu(); if (!u) return null;
        var p = u.progress;
        if (!p[s]) p[s] = {};
        if (!p[s][d]) p[s][d] = {};
        if (!p[s][d][l]) p[s][d][l] = { completed: false, score: 0, stars: 0 };
        return p[s][d][l];
    },

    isLevelUnlocked(s, d, l) {
        if (l === 1) return true;
        var p = this.getProgress(s, d, l - 1);
        return p && p.completed;
    },

    isDifficultyUnlocked(s, d) {
        var o = ['Easy','Medium','Hard','Extreme'], i = o.indexOf(d);
        if (i === 0) return true;
        for (var l = 1; l <= 5; l++) { var p = this.getProgress(s, o[i-1], l); if (!p || !p.completed) return false; }
        return true;
    },

    saveQuizResult(s, d, l, score, total) {
        var u = this.cu(); if (!u) return;
        var p = this.getProgress(s, d, l);
        var stars = score === total ? 3 : score >= Math.ceil(total * .6) ? 2 : score >= 1 ? 1 : 0;
        var isFirst = !p.completed;
        p.completed = stars > 0;
        if (score > p.score) p.score = score;
        if (stars > p.stars) p.stars = stars;
        var coins = score * 10 + (stars === 3 ? 50 : stars === 2 ? 20 : 0) + (isFirst ? 30 : 0);
        var xp = score * 5 + (isFirst ? 20 : 0);
        u.coins += coins; u.xp += xp;
        this._rank(u);
        this._lb(u.username, u.displayName, u.xp);
        this.addNotification('Quiz done! +' + coins + '🪙 +' + xp + 'XP (' + s + ' ' + d + ' Lv.' + l + ')', 'fa-star');
        this.save();
        return { coins, xp, stars, isFirst };
    },

    _rank(u) {
        var r = [[0,'🌱 Beginner'],[100,'📖 Learner'],[300,'🎓 Scholar'],[600,'⭐ Expert'],[1000,'🏆 Master'],[2000,'👑 Legend']];
        for (var i = r.length - 1; i >= 0; i--) { if (u.xp >= r[i][0]) { u.rank = r[i][1]; break; } }
    },

    _lb(u, name, xp) {
        var lb = this.s.lb, found = false;
        for (var i = 0; i < lb.length; i++) { if (lb[i].u === u) { lb[i].xp = xp; lb[i].name = name; found = true; break; } }
        if (!found) lb.push({ u, name, xp });
        lb.sort((a, b) => b.xp - a.xp);
    },

    updateLeaderboard(u, n, xp) { this._lb(u, n, xp); },
    getLeaderboard() { return this.s.lb; },

    buyItem(id) {
        var u = this.cu(); if (!u) return { ok: false };
        var item = SHOP_ITEMS.find(i => i.id === id);
        if (!item) return { ok: false, msg: 'Not found.' };
        if (u.coins < item.price) return { ok: false, msg: 'Not enough coins!' };
        if (u.inventory.includes(id)) return { ok: false, msg: 'Already owned!' };
        u.coins -= item.price; u.inventory.push(id);
        this.addNotification('Purchased: ' + item.name + '!', 'fa-bag-shopping');
        this.save(); return { ok: true };
    },

    addNotification(msg, icon) {
        var u = this.cu(); if (!u) return;
        u.notifications.unshift({ msg, icon: icon || 'fa-bell', time: new Date().toLocaleString(), read: false });
        if (u.notifications.length > 50) u.notifications.pop();
        this.save();
    },

    markAllRead() { var u = this.cu(); if (!u) return; u.notifications.forEach(n => n.read = true); this.save(); },
    unreadCount() { var u = this.cu(); if (!u) return 0; return u.notifications.filter(n => !n.read).length; },

    s: { cu: null, users: {}, lb: [] }
};

GQ.load();

var SHOP_ITEMS = [
    { id: 'shield',      name: 'Shield',       desc: 'Skip one wrong answer',    price: 100, icon: '🛡️', category: 'power'  },
    { id: 'hint',        name: 'Hint Pack',     desc: '5 hints for hard levels',  price: 150, icon: '💡', category: 'power'  },
    { id: 'timeboost',   name: 'Time Boost',    desc: '+15 seconds per question', price: 200, icon: '⏱️', category: 'power'  },
    { id: 'doublecoins', name: 'Double Coins',  desc: '2x coins for 1 game',      price: 250, icon: '💰', category: 'power'  },
    { id: 'xpboost',     name: 'XP Boost',      desc: '2x XP for 1 game',         price: 300, icon: '✨', category: 'power'  },
    { id: 'avatar1',     name: 'Star Avatar',   desc: 'Shiny star avatar',        price: 300, icon: '⭐', category: 'avatar' },
    { id: 'avatar2',     name: 'Crown Avatar',  desc: 'Royal crown avatar',       price: 500, icon: '👑', category: 'avatar' },
    { id: 'avatar3',     name: 'Rocket Avatar', desc: 'Rocket avatar',            price: 400, icon: '🚀', category: 'avatar' },
    { id: 'theme_blue',  name: 'Ocean Theme',   desc: 'Blue ocean background',    price: 350, icon: '🌊', category: 'theme'  },
    { id: 'theme_red',   name: 'Fire Theme',    desc: 'Red fire background',      price: 350, icon: '🔥', category: 'theme'  },
];