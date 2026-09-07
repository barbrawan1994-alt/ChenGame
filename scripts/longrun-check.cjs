async function main() {
  for (const suite of ['marriage', 'story', 'infinity', 'infinity-combat', 'kingdom', 'progression', 'combat']) {
    const started = Date.now();
    await require(`./longrun-${suite}-check.cjs`).run();
    console.log(JSON.stringify({ passed: suite, durationMs: Date.now() - started }));
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
