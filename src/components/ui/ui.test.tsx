import { render } from '@testing-library/react'
import { Badge } from './badge'
import { Button } from './button'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { Input } from './input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs'
import { Avatar, AvatarFallback } from './avatar'

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
  it('Avatar', () => {
    const { getByLabelText } = render(
      <Avatar>
        <AvatarFallback aria-label="avatar-icon">U</AvatarFallback>
      </Avatar>
    )
    expect(getByLabelText('avatar-icon')).toBeTruthy()
  })
})
