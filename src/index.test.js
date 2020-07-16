const chalk = require('chalk')

jest.doMock('chalk', () => new chalk.Instance({ level: 0 }))
const Plugin = require('./index')

describe('Jest Watch Toggle Plugin', () => {
  describe('at construction time', () => {
    it('requires a configuration object', () => {
      // No param at all (older Jest)
      expect(() => new Plugin()).toThrow(/Missing plugin configuration/)
      // No config at all (older Jest)
      expect(() => new Plugin({})).toThrow(/Missing plugin configuration/)
    })

    it('requires the setting parameter', () => {
      expect(() => new Plugin({ config: {} })).toThrow(
        /needs at least a setting configuration parameter/
      )
    })

    it('uses the provided key and prompt configuration, if any', () => {
      const config = { key: 'a', prompt: 'b', setting: 'c' }
      const plugin = new Plugin({ config })
      for (const key of Object.keys(config)) {
        expect(plugin).toHaveProperty(key, config[key])
      }
    })

    describe('when predefined defaults are available, it uses them', () => {
      it('for `bail`', () => {
        const plugin = new Plugin({ config: { setting: 'bail' } })
        expect(plugin).toHaveProperty('key', 'b')
        expect(plugin).toHaveProperty(
          'prompt',
          'turn %ONOFF% bailing at first error'
        )
      })

      it('for `collectCoverage`', () => {
        const plugin = new Plugin({ config: { setting: 'collectCoverage' } })
        expect(plugin).toHaveProperty('key', 'e')
        expect(plugin).toHaveProperty(
          'prompt',
          'turn %ONOFF% code coverage collection'
        )
      })

      it('for `notify`', () => {
        const plugin = new Plugin({ config: { setting: 'notify' } })
        expect(plugin).toHaveProperty('key', 'n')
        expect(plugin).toHaveProperty(
          'prompt',
          'turn %ONOFF% desktop notifications'
        )
      })

      it('for `verbose`', () => {
        const plugin = new Plugin({ config: { setting: 'verbose' } })
        expect(plugin).toHaveProperty('key', 'v')
        expect(plugin).toHaveProperty('prompt', 'turn %ONOFF% test verbosity')
      })
    })

    it('synthetizes defaults when they are not available', () => {
      const plugin = new Plugin({ config: { setting: 'FooBar' } })
      expect(plugin).toHaveProperty('key', 'f')
      expect(plugin).toHaveProperty('prompt', 'turn %ONOFF% FooBar')
    })
  })

  describe('when providing usage info', () => {
    const plugin = new Plugin({
      config: {
        key: 'v',
        prompt: 'turn %ONOFF% tests verbosity',
        setting: 'verbose',
      },
    })

    it('sends the proper info when setting is enabled', () => {
      expect(plugin.getUsageInfo({ verbose: true })).toEqual({
        key: 'v',
        prompt: 'turn off tests verbosity',
      })
    })

    it('sends the proper info when setting is disabled', () => {
      expect(plugin.getUsageInfo({ verbose: false })).toEqual({
        key: 'v',
        prompt: 'turn on tests verbosity',
      })
    })
  })

  describe('when running', () => {
    const plugin = new Plugin({
      config: {
        key: 'e',
        prompt: 'turn %ONOFF% code coverage collection',
        setting: 'collectCoverage',
      },
    })

    it('returns a resolved, falsey promise', () => {
      expect(plugin.run({}, () => {})).toEqual(Promise.resolve())
    })

    it('invokes `updateConfigAndRun()` with the proper option', () => {
      const updateConfigAndRun = jest.fn()
      plugin.run({ collectCoverage: true }, updateConfigAndRun)
      expect(updateConfigAndRun).toHaveBeenCalledWith({
        collectCoverage: false,
      })

      updateConfigAndRun.mockReset()
      plugin.run({ collectCoverage: false }, updateConfigAndRun)
      expect(updateConfigAndRun).toHaveBeenCalledWith({ collectCoverage: true })
    })
  })
})
