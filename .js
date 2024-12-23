class Weapon {
  constructor(name, attack, durability, range) {
    this.name = name;
    this.attack = Math.trunc(attack); // Округление атаки до целого числа
    this.durability = durability;
    this.initDurability = durability;
    this.range = range;
  }

  takeDamage(damage) {
    this.durability = Math.max(
      this.durability - Math.trunc(damage),
      0
    ); // Свойство durability не ниже 0
  }

  getDamage() {
    if (this.durability <= 0) return 0;
    return this.durability >= this.initDurability * 0.3
      ? Math.trunc(this.attack)
      : Math.trunc(this.attack / 2);
  }

  isBroken() {
    return this.durability === 0;
  }
}

class Arm extends Weapon {
  constructor() {
    super("Рука", 1, Infinity, 1);
  }
}

class Bow extends Weapon {
  constructor() {
    super("Лук", 10, 200, 3);
  }
}

class Sword extends Weapon {
  constructor() {
    super("Меч", 25, 500, 1);
  }
}

class Knife extends Weapon {
  constructor() {
    super("Нож", 5, 300, 1);
  }
}

class Staff extends Weapon {
  constructor() {
    super("Посох", 8, 300, 2);
  }
}

class LongBow extends Weapon {
  constructor() {
    super("Длинный лук", 15, 200, 4);
  }
}

class Axe extends Weapon {
  constructor() {
    super("Секира", 27, 800, 1);
  }
}

class StormStaff extends Weapon {
  constructor() {
    super("Посох Бури", 10, 300, 3);
  }
}

class Player {
  constructor(position, name) {
    this.position = position;
    this.name = name || "Игрок";
    this.life = 100;
    this.magic = 20;
    this.speed = 1;
    this.attack = 10;
    this.agility = 5;
    this.luck = 10;
    this.weapon = new Arm();
  }

  getLuck() {
    const randomNumber = Math.random() * 100;
    return (randomNumber + this.luck) / 100;
  }

  getDamage(distance) {
    if (distance > this.weapon.range) return 0;
    const weaponDamage = this.weapon.getDamage();
    const totalDamage = Math.trunc(
      (this.attack + weaponDamage) * this.getLuck() / distance
    );
    return isFinite(totalDamage) ? totalDamage : 0; // Проверка на реалистичность totalDamage
  }

  takeDamage(damage) {
    this.life = Math.max(this.life - Math.trunc(damage), 0); // Урон округляется и вычитается из жизни
  }

  isDead() {
    return this.life === 0;
  }

  tryAttack(enemy) {
    if (this.isDead() || enemy.isDead()) return;
    const distance = Math.abs(this.position - enemy.position);
    if (distance <= this.weapon.range) {
      const wear = 10 * this.getLuck();
      this.weapon.takeDamage(wear);
      const damage = this.getDamage(distance);
      const logDamage = Math.trunc(damage + wear);
      if (this.weapon.isBroken()) {
        console.log(`Оружие ${this.weapon.name} сломалось`);
        this.checkWeapon();
      }
      if (this.position === enemy.position) {
        enemy.position += 1;
        const totalDamage = logDamage * 2;
        enemy.takeDamage(totalDamage > 0 ? totalDamage : 0);
        console.log(
          `${this.name} атакует ${enemy.name} с удвоенной силой и наносит ${totalDamage} урона.`
        );
      } else {
        enemy.takeDamage(logDamage);
        console.log(`${this.name} атакует ${enemy.name} и наносит ${logDamage} урона.`);
      }
    } else {
      this.moveToEnemy(enemy.position); // Перемещение к врагу, если не достаёт
    }
  }

  moveLeft(distance) {
    const movement = Math.min(distance, this.speed);
    this.position = Math.max(this.position - movement, 0);
    console.log(`${this.name} Перемещается влево в позицию ${this.position}.`);
  }

  moveRight(distance) {
    const movement = Math.min(distance, this.speed);
    this.position += movement;
    console.log(`${this.name} Перемещается вправо в позицию ${this.position}.`);
  }

  move(distance) {
    if (distance < 0) {
      this.moveLeft(-distance);
    } else {
      this.moveRight(distance);
    }
  }

  moveToEnemy(targetPosition) {
    const distance = targetPosition - this.position;
    this.move(distance);
  }

  isAttackBlocked() {
    return this.getLuck() > (100 - this.luck) / 100;
  }

  dodged() {
    return this.getLuck() > (100 - this.agility - this.speed * 3) / 100;
  }

  takeAttack(damage) {
    if (this.isAttackBlocked()) {
      this.weapon.takeDamage(damage);
      console.log("Урон заблокирован, повреждение нанесено оружию");
    } else if (this.dodged()) {
      console.log("Уклонился от атаки");
    } else {
      this.takeDamage(damage);
    }
  }

  checkWeapon() {
    if (this.weapon.isBroken()) {
      if (this.weapon instanceof Sword) this.weapon = new Knife();
      else if (this.weapon instanceof Knife) this.weapon = new Arm();
      else if (this.weapon instanceof Bow) this.weapon = new Knife();
      else if (this.weapon instanceof Staff) this.weapon = new Knife();
      else this.weapon = new Arm();
    }
  }

  chooseEnemy(players) {
    const aliveEnemies = players.filter(
      (player) => !player.isDead() && player !== this
    );
    if (aliveEnemies.length === 0) return null;
    return aliveEnemies.reduce((weakest, player) =>
      player.life < weakest.life ? player : weakest
    );
  }

  turn(players) {
    const enemy = this.chooseEnemy(players);
    if (!enemy) return;
    this.tryAttack(enemy);
  }
}

class Warrior extends Player {
  constructor(position, name) {
    super(position, name);
    this.life = 120;
    this.speed = 2;
    this.weapon = new Sword();
  }

  takeDamage(damage) {
    if (this.life < 60 && this.getLuck() > 0.8) {
      if (this.magic > 0) {
        this.magic = Math.max(this.magic - damage, 0);
      } else super.takeDamage(damage);
    } else super.takeDamage(damage);
  }
}

class Archer extends Player {
  constructor(position, name) {
    super(position, name);
    this.life = 80;
    this.magic = 35;
    this.attack = 5;
    this.agility = 10;
    this.weapon = new Bow();
  }

  getDamage(distance) {
    if (distance > this.weapon.range) return 0;
    return Math.trunc(
      (this.attack + this.weapon.getDamage()) *
        this.getLuck() *
        distance /
        this.weapon.range
    );
  }
}

class Mage extends Player {
  constructor(position, name) {
    super(position, name);
    this.life = 70;
    this.magic = 100;
    this.attack = 5;
    this.agility = 8;
    this.weapon = new Staff();
  }

  takeDamage(damage) {
    if (this.magic > 50) {
      this.life = Math.max(this.life - damage / 2, 0);
      this.magic = Math.max(this.magic - 12, 0);
    } else super.takeDamage(damage);
  }
}

class Dwarf extends Warrior {
  constructor(position, name) {
    super(position, name);
    this.life = 130;
    this.attack = 15;
    this.luck = 20;
    this.weapon = new Axe();
  }

  takeDamage(damage) {
    if (Math.random() < 0.166 && this.getLuck() > 0.5) {
      damage /= 2;
    }
    super.takeDamage(damage);
  }
}

class Crossbowman extends Archer {
  constructor(position, name) {
    super(position, name);
    this.life = 85;
    this.attack = 8;
    this.agility = 20;
    this.luck = 15;
    this.weapon = new LongBow();
  }
}

class Demiurge extends Mage {
  constructor(position, name) {
    super(position, name);
    this.life = 80;
    this.magic = 120;
    this.attack = 6;
    this.luck = 12;
    this.weapon = new StormStaff();
  }

  getDamage(distance) {
    if (this.magic > 0 && this.getLuck() > 0.6) {
      return super.getDamage(distance) * 1.5;
    }
    return super.getDamage(distance);
  }
}

function play(players) {
    let round = 1;
    let alivePlayers;

    while ((alivePlayers = players.filter(player => !player.isDead())).length > 1) {
        console.log(`\n=== Раунд ${round} ===`);

        alivePlayers.forEach(player => player.turn(players));

        round++;
    }

    const finalAlivePlayers = players.filter(player => !player.isDead());
    if (finalAlivePlayers.length === 1) {
        console.log(`Победитель: ${finalAlivePlayers[0].name}`);
    } else if (finalAlivePlayers.length === 0) {
        console.log('Все игроки погибли. Победителя нет.');
    } else {
        console.log(`Остались живы: ${finalAlivePlayers.map(player => player.name).join(", ")}`);
    }
}

// Пример игры:
const players = [
    new Warrior(0, "Алёша Попович"),
    new Archer(2, "Леголас"),
    new Mage(4, "Гендальф"),
    new Dwarf(6, "Гимли"),
    new Crossbowman(8, "Арбалетчик"),
    new Demiurge(10, "Демиург"),
];

play(players);


