// Mock Blits object for testing
const Blits = {
  Component: (name, config) => config,
}

module.exports = Blits.Component('TestComponentWithErrors', {
  template: `
    <Element w="1920" h="1080" :color="$backgroundColor">
      <Text :content="$title" x="100" y="50" />
      <Layout direction="row" gap="20">
        <Element w="200" h="100" :color="$buttonColor" @click="$handleClick">
          <Text content="Button 1" />
        </Element>
        <!-- This should trigger error checking -->
        <Element for="item in $items" :key="$index">
          <Text :content="$item.name" />
        </Element>
      </Layout>
    </Element>
  `,
  state() {
    return {
      title: 'Test Component',
      backgroundColor: '#000000',
      buttonColor: '#ff0000',
      items: [{ name: 'Item 1' }, { name: 'Item 2' }],
    }
  },
  // Incomplete syntax for testing fallback parsing
  methods: {
    handleClick() {
      // Missing closing brace intentionally
      console.log('test')
    },
  },
})
