# Installation

Yeoman requires Node.js and npm. You can install that from [here](https://nodejs.org/en/download/).

Once you have Node.js installed, then [install Yeoman](https://yeoman.io).

```shell
npm install -g yo
```

Now you can install generator-tf-init.

```shell
npm install ggiallo28/terraform-generator#master
```

**Note**: You can also clone the project from github, and then use `npm link` in the project's root directory. The link will make it so that the terraform project generator will act like you installed it using `npm install -g generator-tf-init`.

```shell
npm link
```

# Yo - Go generate your project

Generate your new project using the yeoman command:

```shell
mkdir -p ~/my-projects/my-cool-project
cd ~/my-projects/my-cool-project
yo tf-init
```

# Details

Please find more detail about this project [here](https://github.com/leewallen/generator-tf-proj)
