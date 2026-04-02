import Blits from '@lightningjs/blits';
import ButtonComponent from './components/Button.blits';
import { MathUtils, type Point } from '@/utils/math';

interface AppState {
  currentButton: string;
  buttonPosition: Point;
  mathResult: number;
  bgColor: string;
}

const App = Blits.Component<{}, AppState>('AppV2', {
  template: `
    <Element
      w="1920"
      h="1080"
      :color="$bgColor"
    >
      <ButtonComponent label="TypeScript v2 Button" :width="200" :height="80" :position="$buttonPosition" />
      <Text :content="'Math result: ' + $mathResult" x="100" y="200" />
    </Element>
  `,

  components: {
    ButtonComponent,
  },

  state(): AppState {
    return {
      currentButton: 'main',
      buttonPosition: MathUtils.createPoint(100, 100),
      mathResult: 0,
      bgColor: '#1a1a1a',
    };
  },

  async ready(): Promise<void> {
    try {
      this.mathResult = await MathUtils.calculateAsync(42);

      const now = new Date();
      console.log(`App ready at ${now.getTime()}`);
    } catch (error: unknown) {
      console.error('App initialization failed:', error);
    }
  },
});

const Background = Blits.Component('Background', {
  template: `<Element b`,
})

const BackgroundReactive = Blits.Component('BackgroundReactive', {
  template: `<Element :b`,
})

export default App;
