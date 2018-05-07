import {Command} from '@oclif/command'
import {createEnv} from 'yeoman-environment'

export default class Hello extends Command {
  static description = 'describe the command here'

  async run() {
    const env = createEnv()
    env.register(require.resolve('../../templates/generators/app'), 'zwen:app')
    env.run('zwen:app', () => {})
  }
}
