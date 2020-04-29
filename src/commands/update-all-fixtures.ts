import createFixture from "./create-fixture";
import * as path from "path";
import * as fs from "fs";

async function main() {
  const overwriteInfo = process.argv.slice(2).includes('--overwrite-info');
  const fixturesDir = path.join(__dirname, "../../src/_tests/fixtures");
  const fixtures = await fs.promises.readdir(fixturesDir, { withFileTypes: true });
  for (const dir of fixtures) {
    if (!dir.isDirectory) continue;
    const prNumber = parseInt(dir.name, 10);
    if (isNaN(prNumber)) throw new Error(`Expected ${dir.name} to be parseable as a PR number`);

    console.log(`Updating #${prNumber}, ${overwriteInfo ? 'overwriting' : 'preserving'} the existing PR info...`);
    await createFixture(prNumber, overwriteInfo);
  }
}

main().then(() => {
  console.log("Done!");
  process.exit(0);
}, err => {
  if (err?.stack) {
      console.error(err.stack);
  } else {
      console.error(err);
  }
  process.exit(1);
});
