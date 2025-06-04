import { render } from '@testing-library/react'
import { SettingsTab } from './SettingsTab'

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
