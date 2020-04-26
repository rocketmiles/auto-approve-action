import * as core from "@actions/core";
import * as github from "@actions/github";

async function run() {
  try {
    const tokenOne = core.getInput("github-token-one", { required: true });
    const tokenTwo = core.getInput("github-token-two", { required: false });

    const { pull_request: pr } = github.context.payload;
    if (!pr) {
      throw new Error("Event payload missing `pull_request`");
    }

    let client = new github.GitHub(tokenOne);
    core.debug(`Creating approving review for pull request #${pr.number}`);
    await client.pulls.createReview({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      pull_number: pr.number,
      event: "APPROVE",
    });
    core.debug(`Approved pull request #${pr.number}`);

    if (tokenTwo) {
      client = new github.GitHub(tokenTwo);
      await client.pulls.createReview({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        pull_number: pr.number,
        event: "APPROVE",
      });
      core.debug(`Approved pull request #${pr.number} again`);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
