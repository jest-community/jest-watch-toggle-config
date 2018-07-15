class JestWatchTogglePlugin {
  constructor({ config } = {}) {
    if (!config) {
      throw new Error(
        'Missing plugin configuration. Are you sure you’re using Jest 23.3+?'
      )
    }

    this.setting = getConfigValue(config, 'setting')

    if (!this.setting) {
      throw new Error(
        'JestWatchTogglePlugin needs at least a `setting` configuration parameter'
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
