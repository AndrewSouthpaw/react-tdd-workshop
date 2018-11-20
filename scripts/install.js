const shell = require("shelljs");

[
  "01_wrapper",
  "02_interactions",
  "03_async",
].forEach(dir => {
  shell.cd(`${dir}/exercise`);
  shell.echo(`\nInstalling exercise ${dir}:`);
  shell.exec(`yarn`);
  shell.cd("../..");
  shell.cd(`${dir}/lecture`);
  shell.echo(`\nInstalling lecture ${dir}:`);
  shell.exec(`yarn`);
  shell.cd("../..");
});
