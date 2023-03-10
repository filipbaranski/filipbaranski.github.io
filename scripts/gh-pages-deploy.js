import { execa } from "execa";
import fs from "fs";
(async () => {
  try {
    await execa("git", ["checkout", "--orphan", "gh-pages"]);
    console.log("Building started...");
    await execa("npm", ["run", "build"]);
    const folderName = fs.existsSync("dist") ? "dist" : "build";
    console.log("Adding to work tree...");
    await execa("git", ["--work-tree", folderName, "add", "--all"]);
    console.log("Committing code...");
    await execa("git", ["--work-tree", folderName, "commit", "-m", "gh-pages"]);
    console.log("Pushing to gh-pages...");
    await execa("git", ["push", "origin", "HEAD:gh-pages", "--force"]);
    await execa("git", ["checkout", "-f", "master"]);
    console.log("Removing local gh-pages...");
    await execa("git", ["branch", "-D", "gh-pages"]);
    console.log("Removing local /dist folder...");
    fs.rmSync('./dist', { recursive: true, force: true });
    console.log("Successfully deployed");
  } catch (e) {
    console.log(e.message);
  }
})();
