# Dockerizing an Application

The following is a brief description of Docker Containers and what they have to offer based on the [getting started page](https://www.docker.com/get-started) of the [docker site](https://www.docker.com).

Building and deploying applications can be made faster with containers. Docker containers wrap up software and its dependencies into a standardized unit for software development that includes everything needed to run: code, runtime, system tools, and libraries. This guarantees that the application will always run the same and makes collaboration much simpler (see [docker's get started page](https://www.docker.com/get-started)). The containers help to ensure that all environments have the exact same setups.

Docker containers whether [Windows](https://www.docker.com/products/windows-containers) or Linux are backed by Docker tools and APIs helping to build consistent environments:

- Onboard faster and stop wasting hours trying to set up development environments, spin up new instances and make copies of production code to run locally.
- Enable polyglot development and use any language, stack or tools without worry of application conflicts.
- Eliminate environment inconsistencies and the "works on my machine" problem by packaging the application, configs and dependencies into an isolated container.
- Alleviate concern over application [security](https://www.docker.com/products/security)

[Try Docker containers](https://www.docker.com/get-started) with free, hosted lab tutorials or download and take a tutorial to start building apps.

## Single Docker Container

We're gonna start by looking at how we setup a single **Docker Container**. This single **Container** will be used to launch and run a React application built using `create-react-app` as the base setup.


### Dockerfile Explained

1. In order to setup a single docker container for your development environment you need to create a file named `Dockerfile` in the root of your project directory.

1. In order to set the base environment we use an existing image from the [Docker Hub](https://hub.docker.com) using the `FROM` setting in the `Dockerfile`. In this case we are setting up a node environment to run `react-scripts` from `create-react-app` and install dependencies.

    ```
    # Base image we are modifying from https://hub.docker.com/
    FROM node:14.15.4-alpine3.10
    ```

1. Make a new directory and set it as the working directory for the Docker image.

    ```
    # Set working directory
    RUN mkdir -p /app
    WORKDIR /app
    ```

1. Copy over the existing `package.json` to the new working directory and install the application dependencies using `npm install`.

    ```
    # Install and cache app dependencies
    COPY ./package.json ./
    RUN npm install
    ```

1. After dependency installation copy over all assets to the working directory.

    ```
    COPY . ./
    ```

1. Ensure that the default `create-react-app` port is exposed to the network created by Docker. Port 3000 is the port that `react-scripts` defaults to in order to run the react application and the 35729 port is the port used for warm reloading in `react-scripts`.

    ```
    # Exposing a specific PORT for viewing the application
    EXPOSE 3000
    EXPOSE 35729
    ```

1. Define the final command(s) that need to be run to kick off the application when the container launches.

    ```
    # Run final command to kick off client build
    CMD ["npm", "start"]
    ```


#### Dockerfile Commands

That's great we have a configuration for **Docker** but how do we actually use it. Because we downloaded the **Docker** desktop application we now have access to the command line tools which we'll be leveraging to build our **Docker Image** and then run the **Docker Container**.

##### Step 1. Build and Tag the Docker Image

```zsh
$ docker build -t dkr-world:dev .
```

> NOTE: `-t [NAME]:[TAG]`

1. `docker build` - is the command used to build our application's Docker image
1. `-t [NAME]:[TAG]` - the tag flag assigns a tag or name to the built docker image so it can be used to run the docker container based on the image
    - `[CONTAINER_NAME]` - is a placeholder and can be whatever you want to use in order to identify the Docker image
1. ` .` - is a required argument showing the location of the Dockerfile to be used for the Docker configuration


##### Step 2. Verify the Image was Created

```zsh
$ docker image ls
```

expected output:
```
REPOSITORY      TAG      IMAGE ID       CREATED         SIZE
dkr-app         dev      6d946e5851b5   3 minutes ago   379MB
```


##### Step 3. Running the Docker Container

```zsh
$ docker run -it --rm -v ${PWD}:/app -v /app/node_modules -p 3001:3000 -e CHOKIDAR_USEPOLLING=true dkr-app:dev
```

or (they're the same)

```zsh
$ docker run -it --rm \
-v ${PWD}:/app \
-v /app/node_modules \
-p 3001:3000 \
-e CHOKIDAR_USEPOLLING=true \
dkr-app:dev
```

- `docker run` - The [docker run command](https://docs.docker.com/engine/reference/commandline/run/) creates a new container instance, from the image we just created, and runs it.
- `-it` - Starts the container in interactive mode.
- `--rm` - Removes the container and volumes after the container exits.
- `-v ${PWD}:/app` - Configure volume to mount the code into the container at "/app".
- `-v /app/node_modules` - Since we want to use the container version of the "node_modules" folder, we configured another volume: `/app/node_modules`.
- `-p 3001:3000` - Exposes port 3000 inside the container to other containers and port 3001 to our host machine.
- `-e CHOKIDAR_USEPOLLING=true` - Enables a polling mechanism via chokidar (which wraps fs.watch, fs.watchFile, and fsevents) so that hot-reloading will work.


#### Docker Command Cheat Sheet

**List Docker CLI commands:**
```zsh
$ docker
$ docker container --help
```

**Display Docker version and info:**
```zsh
$ docker --version
$ docker version
$ docker info
```

**Execute Docker image:**
```zsh
$ docker run hello-world
```

**List Docker images:**
```zsh
$ docker image ls
```

**List Docker containers (running, all, all in quiet mode):**
```zsh
$ docker container ls
$ docker container ls --all
$ docker container ls -aq
```

**Remove image by ID:**
```zsh
$ docker image rm [ID]
```

**Remove all stopped images:**
```zsh
$ docker image prune
```

**Remove all stopped containers:**
*pass the `--volumes` tag if you want all volumes to be removed as well*
```zsh
$ docker system prune
```

**Remove container by ID:**
```zsh
$ docker container rm [ID]
```
