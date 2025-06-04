import { render } from '@testing-library/react'
import { SettingsTab } from './SettingsTab'

const props = {
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
