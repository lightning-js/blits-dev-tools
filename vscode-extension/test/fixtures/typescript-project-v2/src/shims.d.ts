declare module '@lightningjs/blits' {
  const Blits: {
    Component: <Props = {}, State = {}>(name: string, config: any) => any
    Application: <Props = {}, State = {}>(config: any) => any
    [key: string]: any
  }
  export default Blits
}

declare module '*.blits' {
  const component: any
  export default component
}
