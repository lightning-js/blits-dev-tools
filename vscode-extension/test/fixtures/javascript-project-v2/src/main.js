import Blits from '@lightningjs/blits'
import PanelComponent from './components/Panel.blits'
import { Helpers } from '@/utils/helpers'

const App = Blits.Component('JSAppV2', {
  template: `
    <Element
      w="1920"
      h="1080"
      :color="$bgColor"
    >
      <PanelComponent title="JavaScript v2 Panel" :width="500" :height="400" />
      <Text content="JavaScript + Blits v2 Integration" x="100" y="500" color="#ffffff" />
    </Element>
  `,

  components: {
    PanelComponent,
  },

  state() {
    return {
      appName: 'JS Blits v2 App',
      startTime: 0,
      bgColor: '#1a1a1a',
    }
  },

  async ready() {
    try {
      this.startTime = Date.now()

      const message = await Helpers.wait(10)
      console.log('Async result:', message)

      const numbers = [10, 20, 30, 40, 50]
      const processed = Helpers.processNumbers(numbers)
      console.log('Processed numbers:', processed)
    } catch (error) {
      console.error('App initialization error:', error)
    }
  },
})

const Background = Blits.Component('Background', {
  template: `<Element b`,
})

const BackgroundReactive = Blits.Component('BackgroundReactive', {
  template: `<Element :b`,
})

export default App
