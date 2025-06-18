import { render } from '@testing-library/react'
import { SettingsTab } from './SettingsTab'

const props = {
  stationConfigs: [],
  setStationConfigs: () => {},
  stopsData: {},
  servicesData: {},
  fontSize: 16,
  setFontSize: () => {},
  uiMode: 'advance' as const,
  setUiMode: () => {},
  theme: 'light' as const,
  toggleTheme: () => {},
}

describe('SettingsTab', () => {
  it('renders heading', () => {
    const { getByText } = render(<SettingsTab {...props} />)
    expect(getByText('Settings')).toBeTruthy()
  })

  it('shows theme toggle', () => {
    const { getByText } = render(<SettingsTab {...props} />)
    expect(getByText('Theme')).toBeTruthy()
  })
})
