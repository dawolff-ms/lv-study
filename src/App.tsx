import { Body1, Button, FluentProvider, webLightTheme } from '@fluentui/react-components';

export default function App() {
  
  return (
    <FluentProvider theme={webLightTheme}>
      <Button appearance='primary'>Button</Button>
      <Body1>The site is working!</Body1>
    </FluentProvider>
  )
}
