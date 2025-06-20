// Mock Blits object for testing
const Blits = {
  Component: (name, config) => config,
}

module.exports = Blits.Component('TestComponent', {
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
  state() {
    return {
      title: 'Test Component',
      backgroundColor: '#000000',
      buttonColor: '#ff0000',
      buttonLabel: 'Click me',
      isDisabled: false,
    }
  },
  props: ['testProp', 'optionalProp'],
  computed: {
    computedValue() {
      return this.title + ' - computed'
    },
  },
  methods: {
    handleClick() {
      this.isDisabled = !this.isDisabled
    },
  },
})
