// Mock Blits object for testing
const Blits = {
  Component: (name: string, config: any) => config
}

interface ComponentState {
  title: string
  backgroundColor: string
  buttonColor: string
  buttonLabel: string
  isDisabled: boolean
}

interface ComponentProps {
  testProp: string
  optionalProp?: number
}

module.exports = Blits.Component<ComponentProps, ComponentState>('TestComponentTS', {
  template: `
    <Element w="1920" h="1080" :color="$backgroundColor">
      <Text :content="$title" x="100" y="50" />
      <Layout direction="row" gap="20">
        <Element w="200" h="100" :color="$buttonColor" @click="$handleClick">
          <Text content="Button 1" />
        </Element>
        <CustomButton :label="$buttonLabel" :disabled="$isDisabled" />
      </Layout>
      <RouterView />
    </Element>
  `,
  state(): ComponentState {
    return {
      title: 'Test Component TS',
      backgroundColor: '#000000',
      buttonColor: '#ff0000',
      buttonLabel: 'Click me',
      isDisabled: false
    }
  },
  props: ['testProp', 'optionalProp'],
  computed: {
    computedValue(): string {
      return this.title + ' - computed'
    }
  },
  methods: {
    handleClick(): void {
      this.isDisabled = !this.isDisabled
    }
  }
})