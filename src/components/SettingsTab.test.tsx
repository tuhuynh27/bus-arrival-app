import { render } from '@testing-library/react'
import { SettingsTab } from './SettingsTab'

const props = {
  stationConfigs: [],
  setStationConfigs: () => {},
  stopsData: {},
  servicesData: {},
  fontSize: 16,
  setFontSize: () => {},
}

describe('SettingsTab', () => {
  it('renders heading', () => {
    const { getByText } = render(<SettingsTab {...props} />)
    expect(getByText('Settings')).toBeTruthy()
  })
})
