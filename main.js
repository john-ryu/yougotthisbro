import kaboom from "kaboom"

kaboom()

scene("battleSetupScene", () => {
	add([
		text("BOSS SETUP SCENE", { size: 160 }),
		pos(width() / 2, height() / 2),
		anchor("center"),
		lifespan(10),
		fixed(),
	])

	const bossStats = add([
		"bossStats",
		{
			health : 10,
			attack : 3,
			reward : 0,
		}
	])

	onKeyPress("q", () => {
		bossStats.health += 1
		bossStats.reward += 1
		debug.log(bossStats.health)
	})

	onKeyPress("w", () => {
		bossStats.health -= 1
		debug.log(bossStats.health)
	})

	onKeyPress("e", () => {
		go("battleScene", { bossHealth : bossStats.health, })
	})
})

scene("battleScene", ( {bossHealth} ) => {
	add([
		text("BATTLESCENE", { size: 160 }),
		pos(width() / 2, height() / 2),
		anchor("center"),
		lifespan(10),
		fixed(),
	])

	const battleManager = add([
		"heatMeter",
		{ 
			overHeated : false,
			heatMeter : 0,
			turnsLeft : 50
		}
	])

	const boss = add([
		"boss",
		health(bossHealth),
	])
	debug.log("Boss starting health: " + boss.hp())

	boss.onDeath(() => {
		go("winScene")
	})

	onKeyPress("a", () => {
		actionMiddleWare(3)
		boss.hurt(5)
		
	})

	onKeyPress("s", () => {
		actionMiddleWare(-1)
		
	})

	function actionMiddleWare(heatDelta){
		battleManager.turnsLeft -= 1
		battleManager.heatMeter += heatDelta
		debug.log(boss.hp())
		debug.log(battleManager.heatMeter)
		if (battleManager.turnsLeft <= 0){
			go("loseScene")
			return
		}
		if (battleManager.heatMeter >= 10){
			battleManager.overHeated = true
			battleManager.turnsLeft = Math.min(2, battleManager.turnsLeft)
		}
		if (battleManager.overHeated){
			debug.log("Overheated! You have " + battleManager.turnsLeft + " turns left!" )
		}
	} 
})

scene("winScene", () => {
	add([
		text("YOU WIN", { size: 160 }),
		pos(width() / 2, height() / 2),
		anchor("center"),
		lifespan(10),
		fixed(),
	])
})

scene("loseScene", () => {
	add([
		text("YOU LOSE", { size: 160 }),
		pos(width() / 2, height() / 2),
		anchor("center"),
		lifespan(10),
		fixed(),
	])
})


function start() {
	go("battleSetupScene")
}

start()