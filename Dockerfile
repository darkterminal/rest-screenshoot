FROM debian:latest

# Create app directory
WORKDIR /usr/src/app

RUN apt update -y

RUN apt install nano wget curl openssh-server git -y

RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash - \
    && apt install -y nodejs

RUN apt install -y gconf-service libgbm-dev libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the src directory to the container
COPY src/ ./src/

# Expose port 3000
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
