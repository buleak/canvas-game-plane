let canvas = document.getElementById('canvas'),
	statuss = document.getElementById('status'),
	begin = document.getElementById('begin'),
	ctx = document.getElementById('flyGame').getContext('2d');

let score, air, airs, enemys, bullets, setEnemy, setBullet,
	enemyArr = [],
	bulletArr = [],
	boomArr = [],
	scores = document.getElementById('score'),
	bloods = document.getElementById('blood'),
	rages = document.getElementById('rage'),
	foes = document.getElementById('foe');

let CONFIG = {
	x: 225,
	y: 550,
	arr: [],
	obj: {},
	gamestatus: 'gameStart', //游戏开始
	status: 'normal', //飞机状态
	level: 1, //游戏等级
	totalLevel: 5, //游戏关卡
	enemyNum: 20, //敌人数量
	bulletNum: 1000, //子弹数量
	canvasPadding: 30, //画布间隔
	bulletSize: 3, //子弹尺寸
	bulletSpeed: 10, //子弹射速 
	enemGap: 10, //敌人间距
	enemyIcon: '', //敌人图像
	size: 75, //飞机尺寸
	boomIcon: 'img/images/boom_03.png', //爆炸图像
	boomTime: 60, //爆炸时间
	speed: 5, //移速
	airIcon: 'img/images/air1.png', //英雄图像
	rage: 0, //怒气
	blood: 50, //血量
	maxBlood: 50, //最大血量
	shield: 0, //护盾  
	attack: 10, //攻击力
}

class Parent {
	constructor(opts) {
		this.size = opts.size;
		this.bulletSpeed = opts.bulletSpeed;
		this.bulletSize = opts.bulletSize;
		this.speed = opts.speed;
		this.boomIcon = opts.boomIcon;
		this.boomTime = opts.boomTime;
		this.blood = opts.blood;
		this.maxBlood = opts.maxBlood;
		this.attack = opts.attack;
	}

	move(x = 0, y = 0) {
		this.x += x;
		this.y += y;
	}
}

class Enemy extends Parent {
	constructor(opts) {
		super(opts);
		this.x = Math.ceil(Math.random() * 400) + 40;
		this.y = -(Math.ceil(Math.random() * 300) + 100);
		this.status = 'normal';
		this.enemyIcon = 'img/images/foe' + Math.ceil(Math.random() * 5) + '.png';
		this.boomIcon = opts.boomIcon;
		this.boomCount = 0;
	}

	draw() {
		if (this.enemyIcon && this.boomIcon) {
			switch (this.status) {
				case 'normal':
					var enemyImg = new Image();
					enemyImg.src = this.enemyIcon;
					ctx.drawImage(enemyImg, this.x, this.y);
					break;
				case 'booming':
				    var boomImg = new Image();
				    boomImg.src = this.boomIcon;
				    this.speed = 0;
					boomArr.push(this);
				    ctx.drawImage(boomImg, this.x - 60, this.y - 60);			    
					break;
				case 'boomed':
				    enemyArr.splice(this)
					ctx.clearRect(this.x-5, this.y-5, this.size+10, this.size+10);
					break;
				default:
					break;
			}
		}
	}

	moveFoe() {
		this.move(0, this.speed);
		return this;
	}

// 	booming() {
// 		this.status = 'booming';
//  		this.boomCount += 1;
//  		if (this.booming > 4) {
// 			this.status = 'boomed';
// 			return this;
// 		}
// 		super.booming();
// 	}
}

class Bullet extends Parent {
	constructor(opts) {
		super(opts);
		this.x = opts.x + 25;
		this.y = opts.y - 5;
	}

	fly() {
		this.move(0, -this.bulletSpeed);
		return this;
	}

	draw() {
		ctx.save();
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.bulletSize, 0, 2 * Math.PI);
		ctx.shadowBlur = 4;
		ctx.shadowColor = '#ffff00';
		ctx.fillStyle = '#fff';
		ctx.fill();
		ctx.restore();
		return this;
	}
}

class Air extends Parent {
	constructor(opts) {
		super(opts);

		this.x = opts.x;
		this.y = opts.y;

		this.status = 'normal';
		this.airIcon = opts.airIcon;
		this.minX = opts.minX;
		this.maxX = opts.maxX;
		this.bulletSpeed = opts.bulletSpeed || CONFIG.bulletSpeed;
		this.bulletSize = opts.bulletSize || CONFIG.bulletSize;
	}



	movement() {
		for (let i of codeArr) {
			if (i == 37 && this.x > 20) { //左移 最小20
				this.x -= this.speed
			}
			if (i == 38 && this.y > 10) { //上移 最小10
				this.y -= this.speed
			}
			if (i == 39 && this.x < 430) { //右移 最大470
				this.x += this.speed
			}
			if (i == 40 && this.y < 530) { //下移 最大930
				this.y += this.speed
			}
		}
	}

	skill() {
		for (let i of codeArr) {
			if (i == 81 && skillObj.q.cd <= 0) { //Q 加攻击
				skillQ(10, 5, 'red', 5);
				skillCd(skillObj.q, 5);
			}
			if (i == 87 && skillObj.w.cd == 0) { //W 加护盾
				skillW(1);
				skillCd(skillObj.w, 7);
			}
			if (i == 69 && skillObj.e.cd == 0) { //E 加血加速
				skillE(30, 10)
				skillCd(skillObj.e, 10);
			}
			if (i == 82 && skillObj.r.cd == 0 && airs.age >= 10) { //R 全屏大招
				skillR(2);
				skillCd(skillObj.r, 30);
			}
		}
	}
}

// function booming() {
// 	for (let j of enemyArr) {
// 		if (j.status == 'booming') {
// 			boomArr.push(j);
// 			score += 5;
// 			airs.rage++;
// 			scores.innerHTML = score;
// 			bloods.innerHTML = j.blood;
// 			rages.innerHTML = airs.rage;
// 			foes.innerHTML = enemyArr.length;
// 		}
// 	}
// }

function boomed() {
	for (let j of boomArr) {
		if (j.boomTime > 0) {
			j.boomTime--;
		} else {
			j.status = 'boomed';
		}
	}
}

function init() {
	score = 0;
	air = new Image();
	airs = new Air(CONFIG);
	air.src = airs.airIcon;
	window.requestAnimationFrame(drawInit);
}

function drawInit() {
	if (CONFIG.gameStatus == 'gameStart') {
		ctx.globalCompositeOperation = 'destination-over';
		ctx.clearRect(0, 0, 500, 600);

		ctx.save();
		ctx.beginPath();
		ctx.drawImage(air, airs.x, airs.y);
		ctx.restore();
		enemyDraw();
		bulletDraw();
		fire();
		//booming();
		boomed();
		if (airs.status == 'boom') {
			game('gameOver')
		}
		if (score >= 100) {
			game('gameUp')
		}
	}
	window.requestAnimationFrame(drawInit);
}

init();


 
// 控制飞机方向   
// 按下按键，code存入[]中，松开按键，code从[]中删除
// 遍历[]，若其中有按键x，则触发移动事件X
let code, codeup, codeArr = [];
document.addEventListener('keydown', (event) => {
	event.preventDefault();
	code = event.keyCode;
	codeArr = [...new Set(codeArr)];
	if (codeArr.length < 2) {
		codeArr.push(code);
	}
	codeArr = [...new Set(codeArr)];
	console.log(code + ' ' + codeArr)
	airs.movement();
	airs.skill();
	CONFIG.x = airs.x;
	CONFIG.y = airs.y;
});

document.addEventListener('keyup', (event) => {
	codeup = event.keyCode
	for (let i in codeArr) {
		if (codeArr[i] == codeup) {
			codeArr.splice(i, 1)
		}
	}
	console.log(codeup + ' ' + codeArr)
});

//创造和绘画出敌人和子弹的飞行轨迹
function createFoe() {
	if (CONFIG.enemyNum > 0) {
		setEnemy = setInterval(() => {
			enemys = new Enemy(CONFIG);
			CONFIG.enemyNum--;
			enemyArr.push(enemys);
		}, Math.ceil(Math.random() * 4 + 1) * 1000)
	}
}

function createBullet() {
	if (CONFIG.bulletNum > 0) {
		setBullet = setInterval(() => {
			bullets = new Bullet(CONFIG);
			CONFIG.bulletNum--;
			bulletArr.push(bullets);
		}, 150)
	}
}

function enemyDraw() {
	for (let i of enemyArr) {
		i.moveFoe();
		i.draw();
		if (i.y > 600) {
			i.y = -Math.ceil(Math.random() * 300);
			i.x = Math.ceil(Math.random() * 400 + 40);
			i.enemyIcon = 'img.images/foe' + Math.ceil(Math.random() * 6) + '.png';
		}
	}
}

function bulletDraw() {
	for (let i of bulletArr) {
		i.fly();
		i.draw();
		if (i.y < 0) {
			bulletArr.splice(i, 1)
		}
	}
}
createFoe();
createBullet();



//判断子弹击中目标 
function fire() {
	for (let i of bulletArr) {
		var x = i.x,
			y = i.y;
		for (let j of enemyArr) {
			var x1 = j.x,
				y1 = j.y;
			if (x > x1 && x < x1 + 75 && y > y1 && y < y1 + 75) {
				bulletArr.splice(i, 1);
				//j.blood -= 20;
				//if (j.blood <= 0) {
					j.status = 'booming';
				//}
			}
		}

	}
}



// 	//  敌人移动
// 	function foeFly() {
// 		for (var i of foeArr) {
// 			var foe = new Image();
// 			foe.src = 'img/images/foe' + i.foeType + '.png';
// 			ctx.drawImage(foe, i.foex, i.foey);
// 			i.foey += i.foeSpeed;
// 			if (i.foey > 600) {
// 				foeArr.splice(i, 1);
// 				createEnemy();
// 				airObj.airs.blood -= 50;
// 			}
// 		}
// 	}
// 
// 	//碰撞
// 
// 
// 
// 	// 被动技能
// 	function buff() {
// 
// 	}
// 
//主动技能
var skillObj = {
	q: {
		cd: 0,
		lang: 5
	},
	w: {
		cd: 0,
		lang: 1
	},
	e: {
		cd: 0,
		lang: 1
	},
	r: {
		cd: 0,
		lang: 10
	}
};

function skillCd(sk, cd) {
	sk.cd = cd;
	var st = setInterval(() => {
		sk.cd--;
		sk.lang--;
		if (sk.lang <= 0) {
			if (sk == skillObj.q) {
				skillQ(0, 3, '#fff', 5);
			}
			if (sk == skillObj.w) {
				skillW(1);
			}
			if (sk == skillObj.e) {
				skillE(30, 5);
			}
			if (sk == skillObj.r) {
				skillR(10);
			}
		}
		if (sk.cd <= 0) {
			clearInterval(st)
		}
	}, 1000)
}

function skillQ(attack, cirR, bulletColor, bulletBlur) {
	for (let i of bulletArr) {
		i.bulletSize = cirR;
		i.bulletColor = bulletColor;
		i.bulletBlur = bulletBlur;
	}
	airs.attack += attack;
}

function skillW(shield) {
	airs.shield += shield;
}

function skillE(blood, speed) {
	airs.blood = airs.blood + blood > 100 ? 100 : airs.blood + blood;
	airs.speed += speed;
}

function skillR(speed) {
	enemys.speed = speed;
	airs.rage = 0;
}


// 
// 	// 分数
// 
// 
// 	// 血量
// 
// 	// 音乐
// 	// 开始界面 介绍 选择战机
// 	// 介绍界面
// 	// 暂停界面
// 	// 结束界面
function gameBegin() {
	CONFIG.gameStatus = 'gameStart';
	// 		if (setEnemy) {
	// 			clearInterval(setEnemy)
	// 		}
	// 		if (sb) {
	// 			clearTimeout(sb)
	// 		}
	//		createFoe();
	// 		createBullet();
	statuss.style.display = 'none';
	begin.style.display = 'none';
	canvas.style.display = 'block';
}

function gamePause() {
	game('gamePause');
	//clearInterval(si);
}

function game(status) {
	var txt;
	CONFIG.gameStatus = status;
	switch (CONFIG.gameStatus) {
		case 'gamePause':
			txt = '游戏暂停'
			break;
		case 'gameOver':
			txt = '游戏结束'
			break;
		case 'gameUp':
			txt = '下一关'
			break;
	}
	statuss.innerHTML = '<h1>' + txt + '</h1><h2>分数' + score + '</h2>';
	statuss.style.display = 'block';
	//clearTimeout(sb);
	//clearInterval(si);
}
