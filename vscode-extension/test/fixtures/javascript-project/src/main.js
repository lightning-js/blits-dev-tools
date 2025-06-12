import Blits from '@lightningjs/blits'
import PanelComponent from './components/Panel.blits'
import { Helpers } from '@/utils/helpers'

/**
 * @typedef {Object} AppConfig
 * @property {string} name
 * @property {number} version
 */

const App = Blits.Component('JSApp', {
  template: `
    <Element w="1920" h="1080" color="#1a1a1a">
      <PanelComponent 
        title="JavaScript Panel"
        :width="500"
        :height="400"
      />
      <Text 
        content="JavaScript + Blits Integration"
        x="100"
        y="500"
        color="#ffffff"
      />
    </Element>
  `,

  components: {
    PanelComponent,
  },

  state() {
    return {
      appName: 'JS Blits App',
      startTime: 0,
      config: null,
    }
  },

  async ready() {
    try {
      this.startTime = Date.now()

      // Test standard library objects in JS
      console.log('App starting...')
      console.log('Math.random():', Math.random())
      console.log('Math.floor(Math.PI):', Math.floor(Math.PI))

      // Test Promise and async features
      const message = await Helpers.wait(10)
      console.log('Async result:', message)

      // Test Object, Array, and JSON
      const numbers = [10, 20, 30, 40, 50]
      const processed = Helpers.processNumbers(numbers)

      /** @type {AppConfig} */
      this.config = {
        name: this.appName,
        version: 1.0,
      }

      const configJson = JSON.stringify(this.config)
      console.log('App config:', configJson)

      // Test Array methods
      const doubled = numbers.map((n) => n * 2)
      const sum = doubled.reduce((acc, n) => acc + n, 0)

      console.log('Processed numbers:', processed)
      console.log('Sum of doubled:', sum)

      // Test setTimeout (should be available)
      setTimeout(() => {
        console.log('Delayed execution works')
      }, 100)
    } catch (error) {
      console.error('App initialization error:', error)
    }
  },
})

export default App
