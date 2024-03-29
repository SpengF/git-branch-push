const {
  readFile,
  writeFile,
  gitPushCommit,
  printSuccess,
  printMessage,
  pushAnswer,
  gitPush,
} = require("./utils");
const {
  Add,
  Update,
  Del,
  Use,
  FilePath,
  AnswerKey,
  CherryPick,
  Push,
  DefaultSure,
} = require("./constants");

async function onAdd(names, branch) {
  await writeFile(names, branch, FilePath, Add);
  printSuccess(`Add branch ${names} success`);
}

async function onUpdate(names, branch) {
  await writeFile(names, branch, FilePath, Update);
  printSuccess(`The ${names}'s branch has already changed to ${branch}`);
}

async function onDel(names) {
  await writeFile(names, "", FilePath, Del);
  printSuccess(`The ${names} branch has already deleted`);
}

async function onUse(names) {
  await writeFile(names, "", FilePath, Use);
  printSuccess(`The branch has already used "${names}"`);
}

async function onList(names, branch) {
  const file = await readFile(FilePath);
  printMessage(file.data);
}

async function onCherryPick(hash) {
  // 问询
  const answer = await pushAnswer(CherryPick);
  if (answer[AnswerKey] == DefaultSure) {
    // 执行cherry-pick 操作
    gitPushCommit(hash);
  }
}

async function onPush() {
  // 问询
  const answer = await pushAnswer(Push);
  if (answer[AnswerKey] == DefaultSure) {
    // 执行git 操作
    gitPush();
  }
}

module.exports = {
  onAdd,
  onDel,
  onUse,
  onUpdate,
  onList,
  onCherryPick,
  onPush,
};
