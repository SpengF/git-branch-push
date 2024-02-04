const fs = require("fs");
const chalk = require("chalk");
const DATAJSON = require("./data.json");
const {
  Add,
  Update,
  Del,
  Use,
  AnswerKey,
  DefaultSure,
} = require("./constants");
const inquirer = require("inquirer");
const { exec } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec);

function handleFile(data) {
  return JSON.parse(data);
}

async function readFile(url) {
  return new Promise((resolve, reject) => {
    fs.readFile(url, "utf8", (error, data) => {
      if (error) reject(error);
      resolve(handleFile(data));
    });
  });
}

function checkNamesInfo(names) {
  let hasNames = false;
  let = false;
  let namesLength = 1;
  if (DATAJSON.data[names]) {
    hasNames = true;
  }
  const namesKeys = Object.keys(DATAJSON.data);

  namesLength = namesKeys.length;
  return { namesLength, hasNames };
}

async function writeFile(names, content, url, type) {
  return new Promise((resoleve, reject) => {
    const copyDataJson = { ...DATAJSON };
    const { hasNames, namesLength } = checkNamesInfo(names);

    if (type == Add) {
      if (hasNames) {
        printError("The branch has already in List");
        return;
      }
      copyDataJson.data[names] = content.split(",");
      fs.writeFileSync(url, JSON.stringify(copyDataJson));
      resoleve();
    }
    if (type == Update) {
      if (!hasNames) {
        printError("The branch not in List");
        return;
      }
      copyDataJson.data[names] = content.split(",");
      fs.writeFileSync(url, JSON.stringify(copyDataJson));
      resoleve();
    }
    if (type == Use) {
      if (!hasNames) {
        printError("The branch not in List");
        return;
      }
      copyDataJson.current = names;
      fs.writeFileSync(url, JSON.stringify(copyDataJson));
      resoleve();
    }
    if (type == Del) {
      if (!hasNames) {
        printError("The branch not in List");
        return;
      }
      if (namesLength == 1) {
        printError("The branch cannot be less than one");
        return;
      }
      delete copyDataJson.data[names];
      fs.writeFileSync(url, JSON.stringify(copyDataJson));
      resoleve();
    }
  });
}

function printMessage(message) {
  Object.entries(message).forEach(([key, val]) => {
    const showKey =
      key == DATAJSON.current ? `${chalk.green("*")} ${key}` : key;
    console.log(showKey, chalk.grey("---------- "), val.join(","));
  });
}
function printSuccess(message) {
  console.log(chalk.bgGreenBright("SUCCESS") + " " + chalk.green(message));
}
function printError(error) {
  console.error(chalk.bgRed("ERROR") + " " + chalk.red(error));
}

function pushAnswer() {
  const currentBranch = DATAJSON.data[DATAJSON.current];
  let answer = inquirer.prompt({
    name: AnswerKey,
    message: `Sure to push  ${chalk.green(
      currentBranch
    )} ( ${DefaultSure} / n)`,
    default: DefaultSure,
  });
  return answer;
}

async function getCurrentBranch() {
  const res = await execPromise("git rev-parse --abbrev-ref HEAD");
  return res.stdout.trim();
}

async function getCurrentPushCommit() {
  let commit = "";

  try {
    const commands = ["git pull", "git rev-parse HEAD"];
    for (let index = 0; index < commands.length; index++) {
      const res = await execPromise(commands[index]);
      if (~commands[index].indexOf("HEAD")) {
        commit = res.stdout;
      }
    }
  } catch (error) {
    console.log(error);
  }

  return commit;
}

async function gitPush() {
  const commit = await getCurrentPushCommit();
  const currentBranch = await getCurrentBranch();

  if (commit) {
    console.log("git push " + chalk.green(currentBranch) + " success");
    gitPushCommit(commit);
  }
}

async function gitPushCommit(commit) {
  const currentBranch = await getCurrentBranch();
  const filterCurrentBranchs = DATAJSON.data[DATAJSON.current].filter(
    (item) => item !== currentBranch
  );

  for (let index = 0; index < filterCurrentBranchs.length; index++) {
    const branch = filterCurrentBranchs[index];
    await execPromise(`git checkout ${branch}`);
    await execPromise(`git pull`);
    await execPromise(`git cherry-pick ${commit}`);
    const res = await execPromise(`git push`);
    if (res.stdout) {
      console.log("git push " + chalk.green(branch) + " success");
    }
  }
}

module.exports = {
  readFile,
  writeFile,
  printMessage,
  printSuccess,
  pushAnswer,
  gitPush,
};
