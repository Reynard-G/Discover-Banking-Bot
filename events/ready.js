const { ActivityType } = require("discord.js");
const client = require("..");
const chalk = require("chalk");

client.on("ready", () => {
	const activities = [
		{ name: `a podcast`, type: ActivityType.Listening },
		{ name: `with money`, type: ActivityType.Playing },
		{ name: `a movie`, type: ActivityType.Watching },
		{ name: `a tournament`, type: ActivityType.Competing }
	];

	let i = 0;
	setInterval(() => {
		if (i >= activities.length) i = 0;
		client.user.setActivity(activities[i]);
		i++;
	}, 5000);

	client.user.setStatus("dnd");

	console.log(chalk.red(`Logged in as ${client.user.tag}!`));
});
