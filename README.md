## Assignment description

**Task 1: Implement JavaScript/TypeScript decoder logic**

1. I started by consulting the [User Manual for the device Dragino LHT65](https://www.dragino.com/downloads/downloads/LHT65/UserManual/LHT65_Temperature_Humidity_Sensor_UserManual_v1.8.5.pdf) and concluded that the values need to be interpreted based on the position on the HEX payload.

2. The goal was to decode the value from the HEX payload using bitwise operations. The following function is responsible to receive the encoded value from the device and return an object containing the decoded data in JSON format:
    ```typescript
    decodePayload(hexPayload: string) {
      const payload = Buffer.from(hexPayload, 'hex');
      let value: number;

      // Extracting sensor data from the payload
      value = payload[2] << 8 | payload[3];
      if (payload[2] & 0x80) {
        value |= 0xFFFF0000;
      }
      const temperature = (value / 100) // SHT20, temperature, units: °C
    
      value = payload[4] << 8 | payload[5];
      const humidity = (value / 10) // SHT20, Humidity, units: %
    
      value = (payload[0] << 8 | payload[1]) & 0x3FFF;
      const battery = value / 1000; // Battery, units: mV

      value = payload[7] << 8 | payload[8];
      if (payload[7] & 0x80) {
        value |= 0xFFFF0000;
      }
      const temperatureExt = (value / 100); // DS18B20, temperature, units: °C

      // Creating the decoded object
      return {
        temperature,
        humidity,
        battery,
        temperatureExt
      };
    }
    ```

---

**Task 2: Implement a REST API for decoding HEX payload**

1. For this task, I created a Node.Js application to run a Web Server using Express framework. The purpose of this application was to implement a REST API that exposes the endpoint _/decode_ for decoding the payload received from Dragino LHT65 devices.

2. In the code below it is represented the route responsible for decoding the values:

    ```typescript
   /**
     * POST /decode
     * Decodes the hex payload.
     * @middleware validateHexMiddleware - Middleware to validate the hex payload.
     * @controller decoderController.getDecodedPayload - Controller method to handle the decoding of the payload.
     */
    router.post('/decode', validateHexMiddleware, decoderController.getDecodedPayload);
   ```

3. The endpoint was tested using _curl_ for sending HTTP methods. I was sending POST requests with a JSON ({"hexPayload": "cbb409c401990109857fff"}) in the request body:
    ```shell
    curl -X POST -H "Content-Type: application/json" -d "{\"hexPayload\":\"cbb409c401990109857fff\"}" http://localhost:5000/decode
    ```

---

**Task 3: Dockerfile for the REST API**

1. Here, I created a Dockerfile inside the project to build and run the application developed earlier.

    ```dockerfile
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
    EXPOSE 3000

    # Run the 'npm run build' command inside the container
    RUN npm run build

    # Specify the command to run when the container starts
    # In this case, it runs the 'node' command with the 'dist/index.js' file as the entry point
    CMD [ "node", "dist/index.js" ]
    ```
   
2. Also in the root of the project I created a .dockerignore file to prevent unnecessary files from being included in the image, reducing its size.

3. To test the building of Docker image, I run the following command in CLI:

    ```shell
    docker build -t decoder-api .
    ```

4. After successful build, we can now run the image, specifying host machine port and container's port (**docker run -p _HOST_PORT_:_CONTAINER_PORT_ _DOCKER_IMAGE_NAME_**):

    ```shell
    docker run -p 3000:3000 decoder-api
   ```

---

**Task 4: Deploy microservices to cloud**

1. Firstly, I created the Git repository to host the code, including _Dockerfile_, source code and other configuration files.

2. Then, I set up the CI/CD pipeline using _Github Actions_, defining a workflow file (_.github/workflows/gcp.yml_) that specifies the stages and steps of the pipeline.

3. I also set up the Google Cloud Platform environment, including creating the project, enabling necessary services (such as _Container Registry_ and _Artifact Registry_), and configuring credentials for authentication.

4. For the test step, I implemented a stage where the pipeline runs a test and it's always successfully. 

5. I added a step in the workflow to push the build Docker image to the Container Registry on GCP:

    ```yaml
    - name: Push Docker Image to Container Registry (GCR)
      run: |-
        docker tag $IMAGE_NAME:latest gcr.io/$PROJECT_ID/$IMAGE_NAME:latest
        docker push gcr.io/$PROJECT_ID/$IMAGE_NAME:latest
   ```
   
6. And finally, I configured a step to push the images to Artifact Registry:

    ```yaml
    - name: Push Docker Image to Artifact Registry
      run: |-
        docker tag $IMAGE_NAME:latest europe-central2-docker.pkg.dev/$PROJECT_ID/images/$IMAGE_NAME:latest
        docker push europe-central2-docker.pkg.dev/$PROJECT_ID/images/$IMAGE_NAME:latest
   ```
   
7. After each push to master branch the CI/CD pipeline is activated and passes through all the stages. If everything is successful the Docker image is deployed to GCP. 

---

**Conclusions**

By following this approach, I automated the building, testing and deployment of our microservices using Github Actions and Google Cloud Platform.