import * as Generator from 'yeoman-generator'

class ReducerGenerator extends Generator {
  constructor(args: any, options: any) {
    super(args, options)
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('reducer.ejs'),
      this.destinationPath('public/test_reducer.js'),
      {REDUCER_NAME: 'test123'}
    )
  }

  logging() {
    this.log('Destination Root: ' + this.destinationRoot())
    this.log('Template Root: ' + this.sourceRoot())
  }
}

export = ReducerGenerator
