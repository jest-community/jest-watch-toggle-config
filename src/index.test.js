const Plugin = require('./index')

describe('Jest Watch Toggle Plugin', () => {
  describe('at construction time', () => {
    it('requires a configuration object', () => {
      // No param at all (older Jest)
      expect(() => new Plugin()).toThrow(/Missing plugin configuration/)
      // No config at all (older Jest)
      expect(() => new Plugin({})).toThrow(/Missing plugin configuration/)
    })

    it('requires all three mandatory parameters', () => {
      const config = { key: 'v', prompt: 'V', setting: 'v' }

      // A single param missing is enough
      for (const param of ['key', 'prompt', 'setting']) {
        expect(
          () => new Plugin({ config: { ...config, [param]: '  ' } }),
        ).toThrow(`Missing configuration parameter: ${param}`)
      }

      // Single exception for all missing params
      expect(() => new Plugin({ config: {} })).toThrow(
        /Missing.*key.*prompt.*setting/s,
      )
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
