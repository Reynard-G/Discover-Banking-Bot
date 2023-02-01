const { EmbedBuilder } = require("discord.js");

exports.alreadyHasAccount = async function (interaction) {
    return new EmbedBuilder()
        .setTitle("Registration Failed")
        .setDescription("It appears you already have a bank account with us. If you believe this is a mistake, please contact a staff member by opening a ticker.")
        .setColor("Red")
        .setTimestamp()
        .setFooter({ text: "Discover Banking", iconURL: interaction.guild.iconURL() });
};

exports.doesNotHaveAccount = async function (interaction) {
    return new EmbedBuilder()
        .setTitle("Registration Failed")
        .setDescription("It appears you do not have a bank account with us. Please register with `/register` in order to continue.")
        .setColor("Red")
        .setTimestamp()
        .setFooter({ text: "Discover Banking", iconURL: interaction.guild.iconURL() });
};

exports.invalidUsername = async function (interaction) {
    return new EmbedBuilder()
        .setTitle("Invalid Username")
        .setDescription("Your username must be between 3 and 16 characters long and can only contain letters, numbers and underscores.")
        .setColor("Red")
        .setTimestamp()
        .setFooter({ text: "Discover Banking", iconURL: interaction.guild.iconURL() });
};

exports.forbiddenUserMentioned = async function (interaction) {
    return new EmbedBuilder()
        .setTitle("Transfer Failed")
        .setDescription("You can't send money to this user.")
        .setColor("Red")
        .setTimestamp()
        .setFooter({ text: "Discover Banking", iconURL: interaction.guild.iconURL() });
};

exports.receivingUserDoesNotHaveAccount = async function (interaction) {
    return new EmbedBuilder()
        .setTitle("Transfer Failed")
        .setDescription("This user is not registered with us. Please ask them to register with `/register` in order to continue.")
        .setColor("Red")
        .setTimestamp()
        .setFooter({ text: "Discover Banking", iconURL: interaction.guild.iconURL() });
};

exports.notEnoughMoney = async function (interaction) {
    return new EmbedBuilder()
        .setTitle("Transfer Failed")
        .setDescription("You don't have enough money. You can check your balance with `/dashboard`.")
        .setColor("Red")
        .setTimestamp()
        .setFooter({ text: "Discover Banking", iconURL: interaction.guild.iconURL() });
};

exports.notAnImage = async function (interaction) {
    return new EmbedBuilder()
        .setTitle("Deposit Failed")
        .setDescription("The attachment you sent is not an image. (Accepted Image Formats: .png, .jpg, .jpeg)")
        .setColor("Red")
        .setTimestamp()
        .setFooter({ text: "Discover Banking", iconURL: interaction.guild.iconURL() });
};

exports.imageTooLarge = async function (interaction) {
    return new EmbedBuilder()
        .setTitle("Deposit Failed")
        .setDescription("The attachment you sent is too large. (Max Size: 8MB)")
        .setColor("Red")
        .setTimestamp()
        .setFooter({ text: "Discover Banking", iconURL: interaction.guild.iconURL() });
};

exports.imageDownloadFailed = async function (interaction) {
    return new EmbedBuilder()
        .setTitle("Deposit Failed")
        .setDescription("An error occurred while downloading your attachment. Please try again.")
        .setColor("Red")
        .setTimestamp()
        .setFooter({ text: "Discover Banking", iconURL: interaction.guild.iconURL() });
};