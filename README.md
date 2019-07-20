# Installation

Yeoman requires Node.js and npm. You can install that from [here](https://nodejs.org/en/download/).

Once you have Node.js installed, then [install Yeoman](https://yeoman.io).

```shell
npm install -g yo
```

Now you can install generator-cf-init.

```shell
npm install -g ggiallo28/generator-cloudformation#master
```

**Note**: You can also clone the project from github, and then use `npm link` in the project's root directory. The link will make it so that the terraform project generator will act like you installed it using `npm install -g ggiallo28/generator-cloudformation#master`.

```shell
npm link
```

# Yo - Go generate your project

Generate your new project using the yeoman command:

```shell
mkdir -p ~/my-projects/my-cool-project
cd ~/my-projects/my-cool-project
yo cf-init
```
