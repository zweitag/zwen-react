import * as Generator from 'yeoman-generator';

class CommandGenerator extends Generator {
  constructor(args: any, options: any) {
    super(args, options)
  }

  logging() {
    this.log('Hallo Wurstsalat')
  }
}

export = CommandGenerator
