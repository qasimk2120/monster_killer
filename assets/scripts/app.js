const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE = 14;
const HEAL_VALUE = 20;
const MODE_ATTACK = 'ATTACK'; //ATTACK DAMAGE = 1
const MODE_STRONG_ATTACK = 'STRONG_ATTACK'; //ATTACK DAMAGE = 2

const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK';
const LOG_EVENT_PLAYER__STRONG_ATTACK = 'PLAYER_STRONG_ATTACK';
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK';
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL';
const LOG_EVENT_GAME_OVER = 'GAME_OVER';

function getMaxLifeValues(){
    const enteredValue = prompt('Maximum life for you and the monster.', '100');
    const parsedValue = parseInt(enteredValue);
    if (isNaN(parsedValue) || parsedValue<= 0) {
        throw{message: 'Invalid User Input not a number!'};
      }
    return parsedValue;
}
let chosenMaxLife;
try {
  let chosenMaxLife = getMaxLifeValues();
} catch(error){
  console.log(error);
  // chosenMaxLife = 100;
  // alert('Default value of 100 used due to wrong entry');
  throw error;
}

let currentMonsterHealth = chosenMaxLife;
let currenPlayerHealth = chosenMaxLife;
let hasBonusLife = true;
let battleLog = [];
let lastLoggedEntry;
adjustHealthBars(chosenMaxLife);

function attackMonster(mode) {
  const maxDamage = mode === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
  let logEvent =
    mode === MODE_ATTACK
      ? LOG_EVENT_PLAYER_ATTACK
      : LOG_EVENT_PLAYER__STRONG_ATTACK;
  // if (mode === MODE_ATTACK) {
  //   maxDamage = ATTACK_VALUE;
  //   logEvent = LOG_EVENT_PLAYER_ATTACK;
  // } else if (mode === MODE_STRONG_ATTACK) {
  //   maxDamage = STRONG_ATTACK_VALUE;
  //   logEvent = LOG_EVENT_PLAYER__STRONG_ATTACK;
  // }
  const damage = dealMonsterDamage(maxDamage);
  currentMonsterHealth -= damage;
  writeToLog(logEvent, damage, currentMonsterHealth, currenPlayerHealth);
  endRound();
}

function attackHandler() {
  attackMonster(MODE_ATTACK);
}

function strongAttackHandler() {
  attackMonster(MODE_STRONG_ATTACK);
}

function healPlayerHandler() {
  let healValue;
  if (currenPlayerHealth >= chosenMaxLife - HEAL_VALUE) {
    alert('You cant heal more then max life');
    healValue = chosenMaxLife - currenPlayerHealth;
  } else {
    healValue = HEAL_VALUE;
  }
  increasePlayerHealth(healValue);
  currenPlayerHealth += healValue;
  writeToLog(
    LOG_EVENT_PLAYER_HEAL,
    healValue,
    currentMonsterHealth,
    currenPlayerHealth
  );
  endRound();
}

function endRound() {
  const initialPlayerHealth = currenPlayerHealth;
  const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
  currenPlayerHealth -= playerDamage;
  writeToLog(
    LOG_EVENT_MONSTER_ATTACK,
    playerDamage,
    currentMonsterHealth,
    currenPlayerHealth
  );

  if (currenPlayerHealth <= 0 && hasBonusLife) {
    hasBonusLife = false;
    removeBonusLife();
    currenPlayerHealth = initialPlayerHealth;
    alert('You have one bonus life left');
    setPlayerHealth(initialPlayerHealth);
  }
  if (currentMonsterHealth <= 0 && currenPlayerHealth > 0) {
    alert('You Won');
    writeToLog(
      LOG_EVENT_MONSTER_ATTACK,
      'Player Won',
      currentMonsterHealth,
      currenPlayerHealth
    );
  } else if (currenPlayerHealth <= 0 && currentMonsterHealth > 0) {
    alert('You Lost');
    writeToLog(
      LOG_EVENT_MONSTER_ATTACK,
      'Monster Won',
      currentMonsterHealth,
      currenPlayerHealth
    );
  } else if (currenPlayerHealth <= 0 && currentMonsterHealth <= 0) {
    alert('You have a draw');
    writeToLog(
      LOG_EVENT_MONSTER_ATTACK,
      'Match was Draw',
      currentMonsterHealth,
      currenPlayerHealth
    );
  }
  if (currentMonsterHealth <= 0 || currenPlayerHealth <= 0) {
    reset();
  }
}

function reset() {
  currentMonsterHealth = chosenMaxLife;
  currenPlayerHealth = chosenMaxLife;
  hasBonusLife = true;
  resetGame(chosenMaxLife);
}
function writeToLog(ev, val, monsterHealth, playerHealth) {
  let logEntry = {
    event: ev,
    value: val,
    finalMonsterHealth: monsterHealth,
    finalPlayerHealth: playerHealth,
  };
  switch (ev){
    case  LOG_EVENT_PLAYER_ATTACK:
      logEntry.target = 'Monster';
      break;
    case LOG_EVENT_PLAYER__STRONG_ATTACK:
      logEntry.target = 'MONSTER';
      break;
    case LOG_EVENT_MONSTER_ATTACK:
      logEntry.target = 'PLAYER';
      break;
    case LOG_EVENT_PLAYER_HEAL:
      logEntry.target = 'PLAYER';
      break;
    case LOG_EVENT_GAME_OVER:
      logEntry = {
        event: ev,
        value: val,
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth,
      };
      break;
    default:
      logEntry ={};
  }

  battleLog.push(logEntry);
}
function printLogHandler() {
  // for (let i =0; i<3; i++){
  //   console.log('-------');
  // }
  let j = 0;
  outerWhile: do{
    console.log('Outer', j);
    innerFor: for(k=0; k<5; k++ ){
      if(k ===3){
        break outerWhile;
      }
      console.log('inner',k);
    }
    j++;
  }
  while(j<3)

  // for(let i = 0; i <battleLog.length; i++){
  //   console.log(j);
  // }
    let i = 0;
    for(const logEntry of battleLog){
      if(!lastLoggedEntry &&lastLoggedEntry !== 0 || lastLoggedEntry <i){
        console.log(`#${i}`);
        for (const key in logEntry){
          console.log(`${key} => ${logEntry[key]} `);
        }
        lastLoggedEntry = i;
        break;

      }
      i++;
      
    }
}
attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strongAttackHandler);
healBtn.addEventListener('click', healPlayerHandler);
logBtn.addEventListener('click', printLogHandler);
