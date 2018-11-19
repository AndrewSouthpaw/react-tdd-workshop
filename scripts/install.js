const shell = require("shelljs");

[
  "01_wrapper"
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
