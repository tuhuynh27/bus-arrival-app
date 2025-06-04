import { render } from '@testing-library/react'
import { SettingsTab } from '../src/components/SettingsTab'

const props = {
  theme: 'light' as const,
  toggleTheme: () => {},
  stationConfigs: [],
  setStationConfigs: () => {},
  stopsData: {},
  servicesData: {},
}

describe('SettingsTab', () => {
  it('renders heading', () => {
    const { getByText } = render(<SettingsTab {...props} />)
    expect(getByText('Settings')).toBeTruthy()
  })
})
