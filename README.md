 To run the TypeScript program that monitors your inbox for new emails and performs sentiment analysis, follow these steps:

Step 1: Install Node.js and npm
Download and install Node.js from the official website. Node.js comes with npm (Node Package Manager), which you’ll use to manage dependencies. After installation, open a terminal and verify the installation with the following commands:

node -v
npm -v
Step 2: Install TypeScript
Install TypeScript globally to compile .ts files into JavaScript. Run the following command in the terminal:

npm install -g typescript
Verify the installation:

tsc -v
Step 3: Set Up Your Project
Navigate to your project directory or create a new one:

mkdir email-monitor
cd email-monitor
Step 4: Initialize the Project
Initialize the project with npm to create a package.json file:

npm init -y
Step 5: Install Dependencies
Install the required libraries for your project:

npm install nodemailer sentiment imap-simple dotenv
Step 6: Create and Configure Environment Variables
Create a .env file in the root of your project directory. This file will store sensitive information such as your email credentials. Add the following content to the .env file:

EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
Replace your-email@gmail.com with your email and your-app-password with your secure app password (you can generate one in your email provider’s settings).

Step 7: Write the TypeScript Code
Save your TypeScript code in a file named monitorEmails.ts. Make sure the code is complete and contains all necessary functionality.

Step 8: Add a .gitignore File
Create a .gitignore file to exclude unnecessary files from being tracked. Add the following content:

node_modules/
.env
*.js
*.js.map
Step 9: Compile TypeScript Code
Compile the TypeScript code into JavaScript using the TypeScript compiler:

tsc monitorEmails.ts
This will generate a file named monitorEmails.js.

Step 10: Run the Program
Run the compiled JavaScript file using Node.js:

node monitorEmails.js
The program will monitor your inbox for new emails every 60 seconds and perform sentiment analysis on the email content.

Debugging and Watching for Changes
For continuous development, you can enable watch mode to recompile your TypeScript files automatically whenever you make changes. Run the following command:

tsc --watch
In a separate terminal, rerun the program when the compilation is complete.

PM2 for Continuous Execution
To keep the program running even after you close the terminal, install PM2, a process manager for Node.js:

npm install -g pm2
Start the program using PM2:

pm2 start monitorEmails.js
pm2 save
pm2 startup
This will ensure the program restarts automatically in case of a system reboot.

