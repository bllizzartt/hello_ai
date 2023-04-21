/**
 * This program prompts the user to enter their name and hometown
 * and then uses GPT-3 language model to generate a limerick about the user.
 */

import { ask, gpt, end } from "./shared.js";

main();

async function main() {
  console.log("Hello, GPT!");

  let name = await ask("What is your name?");
  let town = await ask("Where are you from?");

  console.log("");

  let prompt = `My name is ${name} and I am from ${town}. Create a limerick about me.`;

  let limerick = await gpt(prompt, { temperature: 0.3 });
  console.log(`"""\n${limerick}\n"""`);

  end();
}
