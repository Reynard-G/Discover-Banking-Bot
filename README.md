# 🟠 Discover Banking Bot 🟠

> A Discord Bot that keeps track and handles transactions, credit cards, and loans for DC's Discover Banking.

## 🚩 Requirements

1. Discord Bot Token **[Guide](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot)**  
   1.1. Enable 'Message Content Intent' in Discord Developer Portal
2. Node.js 16.14.0 or newer

## 🚀 Getting Started

```bash
git clone https://github.com/Reynard-G/Discover-Banking-Bot
cd Discover-Banking-Bot
npm install
```

After installation finishes, follow the configuration instructions below and then run `node .` to start the bot.

## ⚙️ Configuration

Rename the file `example.env` to `.env` in the root directory and fill out the values:

```
TOKEN=
CLIENT_ID=
GUILD_ID=(Leave blank for global slash commands)
DB_HOST=
DB_PORT=
DB_DATABASE=
DB_USER=
DB_PASS=
```

Customize the configuration of the bot by renaming `config.example.json` to `config.json` and fill out the values. There are multiple examples of fees using ranges, requests channel ID, etc.

## 📝 Features & Commands

### Slashcommands

* `/dashboard` - Display the user's account number, balance, and active loans.
* `/register` - Registers the user according to their discord ID after they have accepted the T.O.S.
* `/transactions` - Displays the user's transactions from newest to oldest.
* `/deposit` - Sends a deposit request in the channel described in `REQUESTS_CHANNEL_ID` along with a fee as described in `DEPOSIT_FEE`.
* `/withdraw` - Sends a withdrawal request in the channel described in `REQUESTS_CHANNEL_ID` along with a fee as described in `WITHDRAW_FEE`.
* `/transfer` - Transfers funds from the user executing the command to another registered user with a fee as described in `TRANSFER_FEE`.

### Subcommands

#### 🛠️ Admin ⚠️ **Admin Only** ⚠️

* `/admin dashboard` - Displays analytical information such as the number of customers and transactions, the total amount of loans and credit card money loaned, and revenue from fees.
* `/admin depositors` - Displays a list of depositors along with their account ID & balance.

#### 📋 Apply ⚠️ **Admin Only** ⚠️

* `/apply creditcard` - Applies a credit card to the user specified and gives the user the following limit to their credit card balance. **Note: Seperate from the user's actual balance and cannot be accessed using the original `/transfer` slashcommand** 
* `/apply loan` - Applies a loan to the user specified and gives the loan amount to the user's balance able to be withdrawed.

#### 💳 Credit Card

* `/creditcard dashboard` - Displays the user's credit card ID, limit, and balance. Seperate from the user's actual balance from `/dashboard`.
* `/creditcard pay` - Sends a payment to the user specified using the user's credit card balance.
* `/creditcard transactions` - Displays the user's credit card transaction history.
* `/creditcard payback` ⚠️ **Admin Only** ⚠️ - Pays back the used credit card balance with a fee specified in `CREDITCARD_PAYBACK_FEE`.

#### 🤝 Loan

* `/loan details` - Displays a users loan details including loan ID, amount, interest rate, term, term period, and repayment schedule.
* `/loan pay` ⚠️ **Admin Only** ⚠️ - Pays back the latest repayment scheduled for the loan without needed to specify.
