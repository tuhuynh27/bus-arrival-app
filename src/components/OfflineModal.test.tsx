import { render, fireEvent } from '@testing-library/react'
import { OfflineModal } from './OfflineModal'

describe('OfflineModal', () => {
  it('renders when offline and triggers retry', async () => {
    const retry = vi.fn().mockResolvedValue(true)
    const { getByText } = render(
      <OfflineModal isOffline={true} isRetrying={false} retryCount={0} lastRetryTime={null} onRetry={retry} />
    )
    fireEvent.click(getByText('Try Again'))
    expect(retry).toHaveBeenCalled()
  })
})
