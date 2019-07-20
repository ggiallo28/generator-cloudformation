'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const providers = require('./templates/providers.json');
const backends = require('./templates/backends.json');

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        'Welcome to the ' + chalk.green('generator-terraform-init') + ' generator!'
      )
    );

    const prompts = [
      {
        type: 'input',
        name: 'appDescription',
        message:
          'Please provide a project description: ',
        validate: input => input.length > 0
      },
      {
        type: 'input',
        name: 'subgroups',
        message:
          'What are the logical group names for your project (separate multiple responses by comma)? ',
        default: 'fontend,application,data,network',
        store: true,
        validate: input => input.length > 0
      },
      {
        type: 'input',
        name: 'environments',
        message:
          'What logical environments will you be running (separate multiple responses by comma)? ',
        default: 'dev,stg,prd',
        store: true,
        validate: input => input.length > 0
      },
      {
        type: 'input',
        name: 'regions',
        message:
          'What regions will you be running in (separate multiple responses by comma)? ',
        default: 'eu-west-1,eu-central-1',
        store: true
      },
      {
        type: 'input',
        name: 'components',
        message:
          'What components will you be running (separate multiple responses by comma)? ',
        default: 'ec2,vpc,lambda,s3',
        store: true
      },
      {
        type: 'list',
        name: 'provider',
        message:
          'What Terraform provider will you be using? (Full list of providers here: https://www.terraform.io/docs/providers) ',
        choices: Object.keys(providers)
      },
      {
        type: 'input',
        name: 'providerVersion',
        message: 'What is the provider version? ',
        default: '1.7',
        store: true
      },
      {
        type: 'input',
        name: 'project',
        message: 'What the project name? (optional) ',
        default: 'search',
        store: true
      },
      {
        type: 'input',
        name: 'costcenter',
        message: 'What is the Cost Center? (optional) ',
        default: 'search',
        store: true
      },
      {
        type: 'input',
        name: 'owner',
        message: 'Who is the business owner or customer? (optional) ',
        store: true
      },
      {
        type: 'list',
        name: 'backend',
        message:
          'What state backend will you be using? (Full list of backends here: https://www.terraform.io/docs/backend/types/index.html) ',
        choices: Object.keys(backends)
      },
      {
        when: props => props.backend === 's3',
        type: 'input',
        name: 'backendBucketName',
        message: 'Name of the S3 Bucket for remote terraform state: ',
        default: 'my-bucket',
        store: true,
        validate: input => input.length > 0
      },
      {
        when: props => props.backend === 's3',
        type: 'input',
        name: 'backendDynamoDBtableName',
        message: 'Name of the DynamoDB Table for remote terraform state lock: ',
        default: 'my-table',
        validate: input => input.length > 0
      },
      {
        when: props => props.backend === 's3',
        type: 'input',
        name: 'backendBucketKeyPrefix',
        message: 'The key prefix for the remote terraform state files: ',
        default: 'terraform-remote-state',
        validate: input => input.length > 0
      },
      {
        when: props => props.backend === 's3',
        type: 'input',
        name: 'backendBucketRegion',
        message: 'The AWS region for the S3 Bucket',
        default: 'us-west-2',
        validate: input => input.length > 0
      },
      {
        when: props => props.backend === 's3',
        type: 'input',
        name: 'backendRoleArn',
        message: 'The default role arn to use when reading/writing the terraform state: ',
        default: 'arn:aws:iam::ENTER_AN_ACCOUNT_NUMBER:role/ENTER_A_ROLE_NAME',
        validate: input => input.length > 0
      },
      {
        when: props => props.backend === 's3',
        type: 'input',
        name: 'backendEncrypt',
        message: 'Do you want to Encrypt Remote State?',
        default: 'true',
        validate: input => input.length > 0
      },
      {
        when: props => props.backend === 'local',
        type: 'input',
        name: 'backendLocalPathPrefix',
        message: 'The path prefix for the local terraform state: ',
        default: 'terraform-local-state',
        validate: input => input.length > 0
      }
    ];

    return this.prompt(prompts).then(props => {
      this.props = props;
    });
  }

  writingSubGroups() {
    var subgroups = this.props.subgroups.split(',');
    var environments = this.props.environments.split(',');
    var regions = this.props.regions.split(',');
    var components = this.props.components.split(',');

    // create subgroup folders
    for (let environment of environments) {
      for (let subgroup of subgroups) {
        for (let region of regions) {
          this.fs.copyTpl(
            this.templatePath('environments/subgroups/regions/backend.tf'),
            this.destinationPath(
              `${environment}/${subgroup}/${region}/backend.tf`
            ),
            {
              provider: this.props.provider,
              providerVersion: this.props.providerVersion,
              providerAttributes: providers[this.props.provider],
              backend: this.props.backend,
              region: region,
              environment: environment,
              backendBucketRegion: this.props.backendBucketRegion,
              backendBucketName: this.props.backendBucketName,
              backendBucketKeyPrefix: this.props.backendBucketKeyPrefix,
              backendRoleArn: this.props.backendRoleArn,
              backendLocalPathPrefix: this.props.backendLocalPathPrefix,
              backendEncrypt: this.props.backendEncrypt,
              backendDynamoDBtableName : this.props.backendDynamoDBtableName,
              components: components
            }
          );           
          this.fs.copyTpl(
            this.templatePath('environments/subgroups/regions/inputs.tf'),
            this.destinationPath(
              `${environment}/${subgroup}/${region}/inputs.tf`
            )
          );
          this.fs.copyTpl(
            this.templatePath('environments/subgroups/regions/main.tf'),
            this.destinationPath(
              `${environment}/${subgroup}/${region}/main.tf`
            ),
            {
              provider: this.props.provider,
              providerAttributes: providers[this.props.provider],
              appName: this.props.appName,
              backend: this.props.backend,
              components: components
            }
          );
          this.fs.copyTpl(
            this.templatePath('environments/subgroups/regions/outputs.tf'),
            this.destinationPath(
              `${environment}/${subgroup}/${region}/outputs.tf`
            ),
            {
              components: components,
              region: region
            }
          );
          this.fs.copyTpl(
            this.templatePath('environments/subgroups/regions/terraform.tfvars'),
            this.destinationPath(
              `${environment}/${subgroup}/${region}/terraform.tfvars`
            ),
            {
              region: region
            }
          );
          this.fs.copyTpl(
            this.templatePath('environments/vars/backend.tf'),
            this.destinationPath(
              `${environment}/vars/backend.tf`
            ),
            {
              provider: this.props.provider,
              providerVersion: this.props.providerVersion,
              providerAttributes: providers[this.props.provider],
              backend: this.props.backend,
              region: region,
              environment: environment,
              backendBucketRegion: this.props.backendBucketRegion,
              backendBucketName: this.props.backendBucketName,
              backendBucketKeyPrefix: this.props.backendBucketKeyPrefix,
              backendRoleArn: this.props.backendRoleArn,
              backendLocalPathPrefix: this.props.backendLocalPathPrefix,
              backendEncrypt: this.props.backendEncrypt,
              backendDynamoDBtableName : this.props.backendDynamoDBtableName,
              components: components
            }
          );
          this.fs.copyTpl(
            this.templatePath('environments/vars/inputs.tf'),
            this.destinationPath(
              `${environment}/vars/inputs.tf`
            )
          );
          this.fs.copyTpl(
            this.templatePath('environments/vars/outputs.tf'),
            this.destinationPath(
              `${environment}/vars/outputs.tf`
            )
          );
          this.fs.copyTpl(
            this.templatePath('environments/vars/terraform.tfvars'),
            this.destinationPath(
              `${environment}/vars/terraform.tfvars`
            ),
            {
              environment: environment,
              project: this.props.project,
              environment: `${environment}`,
              owner: this.props.owner,
              costcenter: this.props.costcenter
            }
          );
          this.fs.copyTpl(
            this.templatePath('README.tp'),
            this.destinationPath(`README.md`),
            {
              appName: this.appname,
              appDescription: this.props.appDescription,
              components: components,
              regions: regions,
              environments: environments
            }
          );
          this.fs.copy(this.templatePath('gitignore'), this.destinationPath('.gitignore'));
        }
      }
    }

  }


  writingModules() {
    var components = this.props.components.split(',');
    for (let component of components) {
      // Creates module folders
      this.fs.copy(
        this.templatePath('modules/inputs.tf'),
        this.destinationPath(`modules/${component}/inputs.tf`)
      );
      this.fs.copy(
        this.templatePath('modules/outputs.tf'),
        this.destinationPath(`modules/${component}/outputs.tf`)
      );
      this.fs.copy(
        this.templatePath('modules/README.md'),
        this.destinationPath(`modules/${component}/README.md`)
      );
      this.fs.copyTpl(
        this.templatePath('modules/module.tf'),
        this.destinationPath(`modules/${component}/${component}.tf`),
        { component: component }
      );
    }
  }

  install() {}
};
