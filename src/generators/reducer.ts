import * as Generator from 'yeoman-generator'

class ReducerGenerator extends Generator {
  constructor(args: any, options: any) {
    super(args, options)
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('reducer.ejs'),
      this.destinationPath(`src/reducer/${this.options.path}/${this.options.filename}.js`),
      {}
    );

    this.fs.copyTpl(
      this.templatePath('reducerIndex.ejs'),
      this.destinationPath(`src/reducer/${this.options.path}/index.js`),
      { REDUCER_NAME: this.options.filename }
    );
  }

  logging() {
    this.log('Destination Root: ' + this.destinationRoot());
    this.log('Template Root: ' + this.sourceRoot());
  }
}

export = ReducerGenerator;
