import { render } from '@testing-library/react'
import { Badge } from '../src/components/ui/badge'
import { Button } from '../src/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../src/components/ui/card'
import { Input } from '../src/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../src/components/ui/tabs'

describe('UI components render', () => {
  it('Badge', () => {
    const { getByText } = render(<Badge>Hi</Badge>)
    expect(getByText('Hi')).toBeTruthy()
  })
  it('Button', () => {
    const { getByRole } = render(<Button>Ok</Button>)
    expect(getByRole('button')).toBeTruthy()
  })
  it('Card', () => {
    const { getByText } = render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
        </CardHeader>
        <CardContent>Body</CardContent>
      </Card>
    )
    expect(getByText('Title')).toBeTruthy()
  })
  it('Input', () => {
    const { getByRole } = render(<Input />)
    expect(getByRole('textbox')).toBeTruthy()
  })
  it('Tabs', () => {
    const { getByText } = render(
      <Tabs value="a" onValueChange={() => {}}>
        <TabsList>
          <TabsTrigger value="a">A</TabsTrigger>
        </TabsList>
        <TabsContent value="a">Content</TabsContent>
      </Tabs>
    )
    expect(getByText('A')).toBeTruthy()
  })
})
