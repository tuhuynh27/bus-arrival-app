import { render } from '@testing-library/react'
import { StationConfigComponent } from '../src/components/StationConfig'

describe('StationConfigComponent', () => {
  it('renders heading', () => {
    const { getByText } = render(
      <StationConfigComponent
        stationConfigs={[]}
        onUpdateConfigs={() => {}}
        stopsData={{}}
        servicesData={{}}
      />
    )
    expect(getByText('Add Bus Station')).toBeTruthy()
  })
})
