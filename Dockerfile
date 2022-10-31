FROM node:16-alpine3.14

# Create app directory
WORKDIR /app

# Install app dependencies
COPY ["package.json", "package-lock.json", "./"]

RUN npm install

# Bundle app source
COPY . .

# EXPOSE 3000

# CMD ["npm", "start"]
CMD npm start