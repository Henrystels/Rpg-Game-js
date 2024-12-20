// Функция для генерации случайных имен
function getRandomName() {
    const names = [
        'Таргор', 'Кронос', 'Эридан', 'Зигмир', 'Вальтир', 'Рейнар', 'Дракус', 'Фалькор', 'Локтар', 'Гримвольд',
        'Селина', 'Айрис', 'Лиара', 'Морвенна', 'Эльвира', 'Фейрана', 'Наралия', 'Киралис', 'Астрид', 'Зефира',
        'Лунарис', 'Равир', 'Аркания', 'Шайла', 'Зенмор', 'Вилтар', 'Эскария', 'Фрейдис', 'Нуридар', 'Тария'
    ];
    return names[Math.floor(Math.random() * names.length)];
}

// Классы оружия
class Weapon {
    constructor(name, attack, durability, range) {
        this.name = name;
        this.attack = attack;
        this.durability = durability;
        this.initDurability = durability;
        this.range = range;
    }

    takeDamage(damage) {
        this.durability = Math.max(this.durability - damage, 0);
    }

    getDamage() {
        if (this.durability <= 0) return 0;
        return this.durability >= this.initDurability * 0.3 ? this.attack : Math.floor(this.attack / 2);
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

class Sword extends Weapon {
    constructor() {
        super("Меч", 25, 500, 1);
    }
}

class Bow extends Weapon {
    constructor() {
        super("Лук", 10, 200, 3);
    }
}

// Базовый класс Player
class Player {
    constructor(position, name) {
        this.position = position;
        this.name = name || getRandomName();
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
        return Math.floor((this.attack + weaponDamage) * this.getLuck() / distance);
    }

    takeAttack(damage) {
        if (this.life > 0) {
            this.life = Math.max(Math.round(this.life - damage), 0); // Округляем до целого
            console.log(`${this.name} получил ${damage.toFixed(2)} урона. Осталось жизни: ${this.life}`);
        }
    }

    tryAttack(enemy) {
        const distance = Math.abs(this.position - enemy.position);

        if (distance > this.weapon.range) {
            console.log(`${this.name} не может достать ${enemy.name}.`);
            return;
        }

        const wear = 10 * this.getLuck();
        this.weapon.takeDamage(wear);

        const damage = this.getDamage(distance);
        enemy.takeAttack(damage);
    }

    moveRight(distance) {
        const movement = Math.min(distance, this.speed);
        this.position += movement;
        console.log(`${this.name} перемещается вправо. Позиция: ${this.position}`);
    }

    moveLeft(distance) {
        const movement = Math.min(distance, this.speed);
        this.position = Math.max(this.position - movement, 0);
        console.log(`${this.name} перемещается влево. Позиция: ${this.position}`);
    }
}

// Классы персонажей
class Warrior extends Player {
    constructor(position, name) {
        super(position, name);
        this.life = 120;
        this.magic = 20;
        this.speed = 2;
        this.attack = 10;
        this.weapon = new Sword();
    }
}

class Archer extends Player {
    constructor(position, name) {
        super(position, name);
        this.life = 80;
        this.magic = 35;
        this.agility = 10;
        this.weapon = new Bow();
    }
}

// Функция игры
function play(players) {
    let round = 1;
    while (players.filter(player => player.life > 0).length > 1) {
        console.log(`\n=== Раунд ${round} ===`);
        players.forEach(player => {
            const aliveEnemies = players.filter(p => p !== player && p.life > 0);
            if (aliveEnemies.length > 0) {
                const enemy = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
                player.tryAttack(enemy);
            }
        });
        round++;
    }

    const alivePlayers = players.filter(player => player.life > 0);
    if (alivePlayers.length === 1) {
        console.log(`Победитель: ${alivePlayers[0].name}`);
    } else {
        console.log('Все игроки погибли. Победителя нет.');
    }
}

// Создание персонажей
const players = [
    new Warrior(0),
    new Archer(2),
    new Player(4),
];

// Запуск игры
play(players);
