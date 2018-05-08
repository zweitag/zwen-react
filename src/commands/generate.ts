import {Command} from '@oclif/command'
import {createEnv} from 'yeoman-environment'

export default class Generate extends Command {
  static description = 'generate scaffolds like: actions, components, constants, helpers, middlewares, reducers'
  static args = [
    {name: 'scaffold', options: ['reducer', 'action']},
    {name: 'scaffoldName'}
  ]
  static aliases = ['g']

  async run() {
    const {args} = this.parse(Generate)
    const env = createEnv()
    let pathToGenerator = '../generators/'
    let namespace = 'zwen:'

    switch (args.scaffold) {
      case 'reducer':
        pathToGenerator += 'reducer'
        namespace += 'reducer'
        break
      default:
        this.log('scaffold not supported: ' + args)
    }

    env.register(require.resolve(pathToGenerator), namespace)
    env.run(namespace, () => {})
  }
}
