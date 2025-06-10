import Blits from '@lightningjs/blits';
import ButtonComponent from './components/Button.blits';
import { MathUtils, type Point } from '@/utils/math';

interface AppState {
  currentButton: string;
  buttonPosition: Point;
  mathResult: number;
}

const App = Blits.Component<{}, AppState>('App', {
  template: `
    <Element w="1920" h="1080">
      <ButtonComponent 
        label="TypeScript Button"
        :width="200"
        :height="80"
        :position="$buttonPosition"
      />
      <Text 
        :content="'Math result: ' + $mathResult"
        x="100"
        y="200"
      />
    </Element>
  `,

  components: {
    ButtonComponent
  },

  state(): AppState {
    return {
      currentButton: 'main',
      buttonPosition: MathUtils.createPoint(100, 100),
      mathResult: 0
    };
  },

  async ready(): Promise<void> {
    // Test Promise, Math, and async/await in main file
    try {
      this.mathResult = await MathUtils.calculateAsync(42);
      
      // Test standard library objects
      const now = new Date();
      const timestamp = now.getTime();
      
      console.log(`App ready at ${timestamp}`);
      console.log(`Math.PI = ${Math.PI}`);
      console.log(`Button distance from origin: ${
        MathUtils.distance(this.buttonPosition, { x: 0, y: 0 })
      }`);
      
      // Test JSON object
      const config = JSON.stringify({ 
        version: '1.0', 
        position: this.buttonPosition 
      });
      console.log('Config:', config);
      
    } catch (error: unknown) {
      console.error('App initialization failed:', error);
    }
  }
});

export default App;