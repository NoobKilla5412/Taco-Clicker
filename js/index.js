let version = '1.2'
document.getElementById('version').innerHTML = 'Version: ' + version
document.querySelector('title').innerHTML = 'Taco Clicker v' + version
let multiplier = 10
let keys = []

let frameNo = 0
let money = 0
let diamonds = 0
let displayMoneyRate = 100
let moneyValue = 5
let idleMoneyValue = 0
let diamondValue = 0.0005
let evolveNum = 0
let moneyPerSecNextEvolve
let musicActive = false
let gameRunning = false

let keyChocolate = '1'
let keyLettuce = '2'
let keySourCream = '3'
let keyMeat = '4'
let keyAvocadoes = '5'
let keySalsa = '6'
let keyTacoYumminess = 'n'
let keyTomatoes = 'm'
let keyEvolve = 'e'


let clickSound = new Audio('sound/click.wav')
let clickUpgrade = new Audio('sound/upgradeClick.wav')
let backgroundMusic


let chocolate = new Upgrade({
  name: 'chocolate',
  type: 'money',
  max: 10,
  cost: 20,
  num: 0,
  total: 0,
  totalUp: 10,
  costUp: 1.5
})
let lettuce = new Upgrade({
  name: 'lettuce',
  type: 'money',
  max: 30,
  cost: 30,
  num: 0,
  total: 0,
  totalUp: 15,
  costUp: 1.4
})
let sourCream = new Upgrade({
  name: 'sourCream',
  type: 'money',
  max: 50,
  cost: 10,
  num: 0,
  total: 0,
  totalUp: 0.01,
  costUp: 1.3
})
let meat = new Upgrade({
  name: 'meat',
  type: 'money',
  action: '*',
  max: 2,
  cost: 2500,
  num: 0,
  total: 1,
  totalUp: 2,
  costUp: 3
})
let avocados = new Upgrade({
  name: 'avocados',
  type: 'money',
  max: 20,
  cost: 25,
  num: 0,
  total: 0,
  totalUp: 8,
  costUp: 1.4
})
let salsa = new Upgrade({
  name: 'salsa',
  type: 'money',
  action: '*',
  max: 2,
  cost: 250000,
  num: 0,
  total: 1,
  totalUp: 10,
  costUp: 2.5
})
let tacoYumminess = new Upgrade({
  name: 'tacoYumminess',
  type: 'diamond',
  max: 100,
  cost: 1000,
  num: 0,
  total: 0,
  totalUp: 5,
  costUp: 1.3
})
let tomatoes = new Upgrade({
  name: 'tomatoes',
  type: 'diamond',
  max: 100,
  cost: 600,
  num: 0,
  total: 0,
  totalUp: 10,
  costUp: 1.3
})
let buttons = {}
if (evolveNum == 0) multiplier = 7 * (2 ** evolveNum + 1)
else if (evolveNum > 0) multiplier = 7 * (2 ** evolveNum)

resetValues()

let upgrades = [chocolate, lettuce, sourCream, meat, avocados, salsa]
let diamondUpgrades = [tacoYumminess, tomatoes]
upgrades.forEach((upgrade) => {
  document.getElementById('upgradeButtons').innerHTML += '<button onclick="' + upgrade.name + '.upgrade()" id="' + upgrade.name + '" class="upgrades"></button>'
  document.getElementById('keyBindsDiv').innerHTML += '<button id="keybinds" onclick="keybinds(\'' + upgrade.name + '\',prompt(\'Rebind ' + capitalizeFirstLetter(upgrade.name) + ' to:\').toLowerCase())" class="gray">Change Key Bind for ' + capitalizeFirstLetter(upgrade.name) + '</button><br>'
})
diamondUpgrades.forEach((upgrade) => {
  document.getElementById('diamondUpgrades').innerHTML += '<button onclick="' + upgrade.name + '.upgrade()" id="' + upgrade.name + '" class="upgrades"></button>'
  document.getElementById('keyBindsDiv').innerHTML += '<button id="keybinds" onclick="keybinds(\'' + upgrade.name + '\',prompt(\'Rebind ' + capitalizeFirstLetter(upgrade.name) + ' to:\').toLowerCase())" class="gray">Change Key Bind for ' + capitalizeFirstLetter(upgrade.name) + '</button><br>'
})
document.getElementById('keyBindsDiv').innerHTML += '<button id="keybinds" onclick="keybinds(\'evolve\',prompt(\'Rebind Evolve to:\').toLowerCase())" class="gray">Change Key Bind for Evolve</button>'


function animate() {
  // if(!musicActive){
  //   backgroundMusic.pause();
  //   backgroundMusic.currentTime = 0;
  // }
  moneyPerSecNextEvolve = (2 ** (evolveNum + 2)) * 1000 * 1.5
  if (evolveNum == 0) multiplier = 7 * (2 ** evolveNum + 1)
  else if (evolveNum > 0) multiplier = 7 * (2 ** evolveNum)
  buttons = {
    'chocolate': 'Chocolate (' + keyChocolate.toUpperCase() + '): Increase Size by 10% <span title="Size upgrades are the same as Earnings upgrades in their effect.">[ ? ]</span><br><img src="img/money.svg" height="12pt" /><b>' + toValues(chocolate.cost) + '</b><br>Total: +' + chocolate.total + '%<br>Level: ' + chocolate.num + '/' + chocolate.max,
    'chocolateMax': 'Chocolate (' + keyChocolate.toUpperCase() + '): Increase Size by 10%<br>✅<br>Total: +' + chocolate.total + '%<br>Level: MAX',
    'lettuce': 'Lettuce (' + keyLettuce.toUpperCase() + '): Increase Tastiness by 15% <span title="Tastiness upgrades are the same as Earnings upgrades in their effect.">[ ? ]</span><br><img src="img/money.svg" height="12pt" /><b>' + toValues(lettuce.cost) + '</b><br>Total: +' + lettuce.total + '%<br>Level: ' + lettuce.num + '/' + lettuce.max,
    'lettuceMax': 'Lettuce (' + keyLettuce.toUpperCase() + '): Increase Tastiness by 15% <span title="Tastiness upgrades are the same as Earnings upgrades in their effect.">[ ? ]</span><br>✅<br>Total: +' + lettuce.total + '%<br>Level: MAX',
    'sourCream': 'Sour Cream (' + keySourCream.toUpperCase() + '): Increase Idle Earnings by 1/sec<br><img src="img/money.svg" height="12pt" /><b>' + toValues(sourCream.cost) + '</b><br>Total: +' + sourCream.total * 100 + '/sec<br>Level: ' + sourCream.num + '/' + sourCream.max,
    'sourCreamMax': 'Sour Cream (' + keySourCream.toUpperCase() + '): Increase Idle Earnings by 1/sec<br>✅<br>Total: +' + sourCream.total * 100 + '/sec<br>Level: MAX',
    'meat': 'Taco Meat (' + keyMeat.toUpperCase() + '): Double Meat <span title="Meat upgrades are the same as Earnings upgrades in their effect.">[ ? ]</span><br><img src="img/money.svg" height="12pt" /><b>' + toValues(meat.cost) + '</b><br>Total: ' + meat.total + 'x<br>Level: ' + meat.num + '/' + meat.max,
    'meatMax': 'Taco Meat (' + keyMeat.toUpperCase() + '): Double Meat <span title="Meat upgrades are the same as Earnings upgrades in their effect.">[ ? ]</span><br>✅<br>Total: ' + meat.total + 'x<br>Level: MAX',
    'avocados': 'Avocados (' + keyAvocadoes.toUpperCase() + '): Increase Earnings by 8%<br><img src="img/money.svg" height="12pt" /><b>' + toValues(avocados.cost) + '</b><br>Total: +' + avocados.total + '%<br>Level: ' + avocados.num + '/' + avocados.max,
    'avocadosMax': 'Avocados (' + keyAvocadoes.toUpperCase() + '): Increase Earnings by 8%<br>✅<br>Total: +' + avocados.total + '%<br>Level: MAX',
    'salsa': 'Salsa (' + keySalsa.toUpperCase() + '): 10x Salsa <span title = "Salsa upgrades are the same as Earnings upgrades in their effect.">[ ? ]</span> <br><img src="img/money.svg" height="12pt" /><b>' + toValues(salsa.cost) + '</b><br>Total: ' + salsa.total + 'x<br>Level: ' + salsa.num + '/' + salsa.max,
    'salsaMax': 'Salsa (' + keySalsa.toUpperCase() + '): 10x Salsa <span title="Salsa upgrades are the same as Earnings upgrades in their effect.">[ ? ]</span><br>✅<br>Total: ' + salsa.total + 'x<br>Level: MAX',
    'tacoYumminess': 'Taco Yumminess (' + keyTacoYumminess.toUpperCase() + '): Increase Diamond Speed by 5%<br>💎<b>' + toValues(tacoYumminess.cost) + '</b><br>Total: +' + tacoYumminess.total + '%<br>Level: ' + tacoYumminess.num + '/' + tacoYumminess.max,
    'tacoYumminessMax': 'Taco Yumminess (' + keyTacoYumminess.toUpperCase() + '): Increase Diamond Speed by 5%<br>✅<br>Total: +' + tacoYumminess.total + '%<br>Level: MAX',
    'tomatoes': 'Tomatoes (' + keyTomatoes.toUpperCase() + '): Increase Flavor by 10% <span title="Flavor upgrades are the same as Earnings upgrades in their effect.">[ ? ]</span><br>💎<b>' + toValues(tomatoes.cost) + '</b><br>Total: +' + tomatoes.total + '%<br>Level: ' + tomatoes.num + '/' + tomatoes.max,
    'tomatoesMax': 'Tomatoes (' + keyTomatoes.toUpperCase() + '): Increase Flavor by 10% <span title="Flavor upgrades are the same as Earnings upgrades in their effect.">[ ? ]</span><br>✅<br>Total: +' + tomatoes.total + '%<br>Level: MAX'
  }
  document.getElementById('evolveButton').innerHTML = 'Evolve (' + keyEvolve.toUpperCase() + ')'
  frameNo += 1

  // if (displayMoneyRate >= moneyPerSecNextEvolve && evolveNum <= 100) {
  //   document.getElementById('evolveButton').classList = 'green'
  // } else {
  //   document.getElementById('evolveButton').classList = 'gray'
  // }
  if (evolveNum == 0) {
    moneyValue = 5 * (chocolate.total / 100 + 1) * (lettuce.total / 100 + 1) * meat.total * (tomatoes.total / 100 + 1) * (avocados.total / 100 + 1) * salsa.total
    diamondValue = (tacoYumminess.total / 100 + 1) - 0.7
  } else {
    moneyValue = 5 * (2 ** evolveNum + 2) * (chocolate.total / 100 + 1) * (lettuce.total / 100 + 1) * meat.total * (tomatoes.total / 100 + 1) * (avocados.total / 100 + 1) * salsa.total
    diamondValue = (2 ** evolveNum + 2) * (tacoYumminess.total / 100 + 1)
  }
  idleMoneyValue = Math.round(10 * (10000 * (sourCream.total / 100))) / 1000
  upgrades.forEach((upgrade) => {
    upgrade.color()
    upgrade.message()
  })
  diamondUpgrades.forEach((upgrade) => {
    upgrade.color()
    upgrade.message()
  })

  document.getElementById('money').innerHTML = '<img src="img/money.svg" height="12pt" />: <b class="large-money">' + toValuesExt(money) + '</b>'

  displayMoneyRate = Math.round(10 * (10000 * idleMoneyValue)) / 1000

  document.getElementById('moneyPerSec').innerHTML = '<img src="img/money.svg" height="12pt" />/sec: <b>' + toValues(displayMoneyRate) + '</b>'// + '/' + toValues(moneyPerSecNextEvolve) + '</b>'
  document.getElementById('value').innerHTML = '<img src="img/money.svg" height="12pt" />Value: <b>' + toValues(Math.round((1000 * moneyValue)) / 1000)


  document.getElementById('diamonds').innerHTML = '💎: <b>' + toValues(diamonds) + '</b>'


  document.getElementById('evolve').innerHTML = 'Evolve: <b>' + toValues(evolveNum) + '</b>'

  money += idleMoneyValue

  diamonds += diamondValue

  if (keys && keys[keyChocolate]) {
    chocolate.upgrade()
  }
  if (keys && keys[keyLettuce]) {
    lettuce.upgrade()
  }
  if (keys && keys[keySourCream]) {
    sourCream.upgrade()
  }
  if (keys && keys[keyMeat]) {
    meat.upgrade()
  }
  if (keys && keys[keyAvocadoes]) {
    avocados.upgrade()
  }
  if (keys && keys[keySalsa]) {
    salsa.upgrade()
  }
  if (keys && keys[keyTacoYumminess]) {
    tacoYumminess.upgrade()
  }
  if (keys && keys[keyTomatoes]) {
    tomatoes.upgrade()
  }
  if (keys && keys[keyEvolve]) {
    evolve()
  }
}

// let creditsActive = false
// function credits() {
//   if (!creditsActive) {
//     document.getElementById('credits').style.display = 'block'
//     creditsActive = true
//   } else if (creditsActive) {
//     document.getElementById('credits').style.display = 'none'
//     creditsActive = false
//   }
// }
let infoActive = false

let optionsActive = false


// function toggleMusic() {
//   if (!musicActive) {
//     if (typeof backgroundMusic.loop == 'boolean') {
//       backgroundMusic.loop = true;
//     }
//     else {
//       backgroundMusic.addEventListener('ended', function () {
//         this.currentTime = 0;
//         this.play();
//       }, false);
//     }
//     backgroundMusic.play();
//   } else if (musicActive) {
// backgroundMusic.pause();
// backgroundMusic.currentTime = 0;
//   }
// }


// function openChest() {
//   clickSound.play()
//   document.getElementById('chestScreen').style.display = 'block'
//   document.getElementById('chestScreen').innerHTML = chests[(Math.floor(Math.random() * (5 - 0)) + 0)] + `<span onclick="document.getElementById('chestScreen').style.display = 'none'" id="closeChestScreen">X&nbsp</span>`
// }
// function diamondToMoney() {
//   if (diamonds * .1 >= 0) {
//     diamonds -= diamonds * .1
//     money += (diamonds * .1) * 5
//   }
// }