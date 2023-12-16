const { EmbedBuilder } = require("discord.js");

exports.noPermission = async function (interaction) {
  return new EmbedBuilder()
    .setTitle("No Permission")
    .setDescription("You do not have permission to use this command.")
    .setColor("Red")
    .setTimestamp()
    .setFooter({ text: "Discover Banking", iconURL: interaction.guild.iconURL() });
};

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

exports.invalidAccountID = async function (interaction) {
  return new EmbedBuilder()
    .setTitle("Transfer Failed")
    .setDescription("The account ID you provided is invalid or does not exist. Please check the account ID and try again.")
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

exports.invalidLoanDetails = async function (interaction) {
  return new EmbedBuilder()
    .setTitle("Loan Application Failed")
    .setDescription("The loan details you provided are invalid. Please make sure you have entered a valid amount within the valid ranges.")
    .setColor("Red")
    .setTimestamp()
    .setFooter({ text: "Discover Banking", iconURL: interaction.guild.iconURL() });
};

exports.loanNotFound = async function (interaction) {
  return new EmbedBuilder()
    .setTitle("Loan Payment Failed")
    .setDescription("The loan ID you provided is invalid. Please make sure you have entered a valid loan ID.")
    .setColor("Red")
    .setTimestamp()
    .setFooter({ text: "Discover Banking", iconURL: interaction.guild.iconURL() });
};

exports.loanPaid = async function (interaction) {
  return new EmbedBuilder()
    .setTitle("Loan Payment Failed")
    .setDescription("It appears that the loan you are trying to pay off has already been paid.")
    .setColor("Red")
    .setTimestamp()
    .setFooter({ text: "Discover Banking", iconURL: interaction.guild.iconURL() });
};

exports.notANumber = async function (interaction) {
  return new EmbedBuilder()
    .setTitle("Invalid Amount")
    .setDescription("You have inputted an invalid number. Please try again.")
    .setColor("Red")
    .setTimestamp()
    .setFooter({ text: "Discover Banking", iconURL: interaction.guild.iconURL() });
};

exports.invalidDate = async function (interaction) {
  return new EmbedBuilder()
    .setTitle("Invalid Date")
    .setDescription("You have inputted an invalid date. Please try again.")
    .setColor("Red")
    .setTimestamp()
    .setFooter({ text: "Discover Banking", iconURL: interaction.guild.iconURL() });
};

exports.noTransactionsFound = async function (interaction) {
  return new EmbedBuilder()
    .setTitle("No Transactions Found")
    .setDescription("It appears you have no transactions with us. Please try again later.")
    .setColor("Red")
    .setTimestamp()
    .setFooter({ text: "Discover Banking", iconURL: interaction.guild.iconURL() });
};

exports.alreadyHasCreditcard = async function (interaction) {
  return new EmbedBuilder()
    .setTitle("Credit Card Application Failed")
    .setDescription("It appears the user already has a credit card with us. If you believe this is a mistake, please contact a staff member by opening a ticket.")
    .setColor("Red")
    .setTimestamp()
    .setFooter({ text: "Discover Banking", iconURL: interaction.guild.iconURL() });
};

exports.insufficientCreditcardBalance = async function (interaction) {
  return new EmbedBuilder()
    .setTitle("Credit Card Payment Failed")
    .setDescription("The credit card balance is insufficient for the requested amount. Please try again.")
    .setColor("Red")
    .setTimestamp()
    .setFooter({ text: "Discover Banking", iconURL: interaction.guild.iconURL() });
};

exports.creditcardNotFound = async function (interaction) {
  return new EmbedBuilder()
    .setTitle("Credit Card Failed")
    .setDescription("It appears you do not have a credit card with us. To continue, please apply for one by opening a ticket.")
    .setColor("Red")
    .setTimestamp()
    .setFooter({ text: "Discover Banking", iconURL: interaction.guild.iconURL() });
};

exports.invalidAmount = async function (interaction) {
  return new EmbedBuilder()
    .setTitle("Invalid Amount")
    .setDescription("You have inputted an invalid amount. Please try again.")
    .setColor("Red")
    .setTimestamp()
    .setFooter({ text: "Discover Banking", iconURL: interaction.guild.iconURL() });
};