const chalk = require('chalk')
const { ValidationError } = require('jest-validate')

class JestWatchTogglePlugin {
  constructor({ config } = {}) {
    if (!config) {
      errorOut(
        `Missing plugin configuration. Are you sure you’re using ${chalk.bold.red(
          'Jest 23.3+'
        )}?`
      )
    }

    this.setting = getConfigValue(config, 'setting')

    if (!this.setting) {
      errorOut(
        `${this.constructor.name} needs at least a ${chalk.bold.red(
          'setting'
        )} configuration parameter`
      )
    }

    const defaults = DEFAULT_CONFIG[this.setting] || {}
    this.key =
      getConfigValue(config, 'key', defaults) || this.setting[0].toLowerCase()
    this.prompt =
      getConfigValue(config, 'prompt', defaults) ||
      `turn %ONOFF% ${this.setting}`
  }

  getUsageInfo(globalConfig) {
    const targetMode = globalConfig[this.setting] ? 'off' : 'on'
    return {
      key: this.key,
      prompt: this.prompt.replace(/%ONOFF%/g, targetMode),
    }
  }

  run(globalConfig, updateConfigAndRun) {
    updateConfigAndRun({ [this.setting]: !globalConfig[this.setting] })
    return Promise.resolve()
  }
}

function errorOut(message) {
  const comment = `${chalk.bold.red(
    'Configuration documentation'
  )}: ${chalk.underline(
    'https://github.com/jest-community/jest-watch-toggle-config#readme'
  )}
  `.trim()
  throw new ValidationError('Watch Toggle Config Error', message, comment)
}

const DEFAULT_CONFIG = {
  bail: { key: 'b', prompt: 'turn %ONOFF% bailing at first error' },
  collectCoverage: {
    key: 'e',
    prompt: 'turn %ONOFF% code coverage collection',
  },
  notify: { key: 'n', prompt: 'turn %ONOFF% desktop notifications' },
  verbose: { key: 'v', prompt: 'turn %ONOFF% test verbosity' },
}

function getConfigValue(config, setting, defaults = {}) {
  return (
    String(config[setting] || '').trim() ||
    String(defaults[setting] || '').trim()
  )
}

module.exports = JestWatchTogglePlugin
