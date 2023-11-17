import chalk from "chalk";
import dedent from "dedent";

import { ask, end, inspect, say } from "../shared/cli.js";
import { gpt } from "../shared/openai.js";

/////////////////////////////////////////////////////////////////
// GAME CODE

const game_data = {
  player_hp: 10,
  player_mp: 1,
  enemy_hp: 10,
};

function attack() {
  const damage = randomInt(1, 3);
  game_data.enemy_hp -= damage;
  let summary = `Player attacks for ${damage} of possible 3 damage. `;
  summary += counter();
  summary += sitRep();
  return summary;
}

function magic() {
  if (game_data.player_mp < 1) {
    return "Player does not have enough mana. ";
  }
  const damage = randomInt(3, 5);
  game_data.enemy_hp -= damage;
  game_data.player_mp -= 1;
  let summary = `Player casts spell for ${damage} of possible 5 damage. `;
  summary += counter();
  summary += sitRep();
  return summary;
}

function counter() {
  if (game_data.enemy_hp <= 0) {
    return "Enemy is killed!";
  }
  const damage = randomInt(1, 3);
  game_data.player_hp -= damage;
  let summary = `Enemy attacks for ${damage} of possible 3 damage. `;
  return summary;
}

function sitRep() {
  let summary = "";
  if (game_data.player_hp > 0) {
    summary += `Player has ${game_data.player_hp} of 10 HP. `;
  } else {
    summary += "Player is dead. ";
  }
  if (game_data.enemy_hp > 0) {
    summary += `Enemy has ${game_data.enemy_hp} of 10 HP. `;
  } else {
    summary += "Enemy is dead. ";
  }

  return summary;
}

/////////////////////////////////////////////////////////////////
// GPT CONFIG

const tools = [
  {
    type: "function",
    function: {
      name: "attack",
      description: "Attack the enemy with a weapon",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "magic",
      description: "Attack the enemy with magic",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  },
];

const availableFunctions = {
  attack,
  magic,
};

const messages = [
  {
    role: "system",
    content: dedent`
      You assist in running a role-playing text adventure game. You take user commands, call functions to update the game state, and narrate the results.
      
      The player is engaged in battle and can't pursue other activities until it concludes. 
      
      - Narrate only the latest turn.
      - Avoid using numbers in your narration. 
      - Be brief. 
      
      When calling functions, choose only the best single function. Never call more than one function at a time.
      
      If a tool returns "unknown function" let the player know they can't do the thing they tried.
      `,
  },
];

/////////////////////////////////////////////////////////////////
// GAME LOOP

async function game() {
  // start with some introductory text
  const introText = "A wild slime appears!";
  messages.push({ role: "assistant", content: introText });
  say(`\n${introText}`);

  // the main game loop
  while (game_data.player_hp > 0 && game_data.enemy_hp > 0) {
    // show the current game state
    inspect(game_data);

    // ask the user for their next command
    let command = await ask();
    messages.push({ role: "user", content: command });

    // use GPT to respond to command
    let responseMessage = await gpt({
      messages,
      tools,
      max_tokens: 256,
    });
    messages.push(responseMessage);

    // if GPT calls tools, handle them
    if (responseMessage.tool_calls) {
      handleToolCalls(responseMessage.tool_calls);
      responseMessage = await gpt({
        messages,
        max_tokens: 256,
      });
      messages.push(responseMessage);
    }

    // show user response
    say(responseMessage.content);
  }
}

function handleToolCalls(tool_calls) {
  for (const tool_call of tool_calls) {
    const functionName = tool_call.function.name;
    const response = availableFunctions[functionName]?.() || "unknown function";
    say(chalk.blue(`${functionName}()`));
    messages.push({
      tool_call_id: tool_call.id,
      role: "tool",
      name: functionName,
      content: response,
    });
  }
}

try {
  await game();
} catch (e) {
  console.error(chalk.red("\nWell, something went wrong."));
  console.error(e);
} finally {
  const shouldLog = await ask("\nLog messages? (y/n) ");
  if (shouldLog === "y") {
    inspect(messages);
  }
  console.log("\n--end--\n");
  end();
}

/////////////////////////////////////////////////////////////////
// UTIL

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}