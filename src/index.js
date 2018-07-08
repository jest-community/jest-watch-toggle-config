class JestWatchTogglePlugin {
  constructor({ config } = {}) {
    if (!config) {
      throw new Error(
        'Missing plugin configuration. Are you sure you’re using Jest 23.3+?',
      )
    }

    const errors = []
    for (const param of ['key', 'prompt', 'setting']) {
      const value = String(config[param] || '').trim()
      if (!value) {
        errors.push(`Missing configuration parameter: ${param}`)
        continue
      }
      this[param] = value
    }
    if (errors.length > 0) {
      throw new Error(errors.join('\n'))
    }
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

module.exports = JestWatchTogglePlugin
