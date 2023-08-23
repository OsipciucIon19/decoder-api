# Set the base image to use for subsequent instructions.
FROM node:lts-alpine

# Set the working directory inside the container to /app
WORKDIR /app

# Copy the package.json file from the host into the container's current working directory
COPY package.json ./

# Run the 'npm install' command inside the container to install the dependencies specified in package.json
# The '--verbose' flag is used to display detailed output during the installation process
RUN npm install --verbose

# Copy all files and directories from the host into the container's current working directory
COPY . .

# Inform Docker that the container will listen on port 3000 at runtime
EXPOSE 8080

# Run the 'npm run build' command inside the container
RUN npm run build

# Specify the command to run when the container starts
# In this case, it runs the 'node' command with the 'dist/index.js' file as the entry point
CMD [ "node", "dist/index.js" ]
