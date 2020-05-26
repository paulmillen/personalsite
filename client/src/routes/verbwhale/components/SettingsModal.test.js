import { render, fireEvent } from '@testing-library/svelte';
import SettingsModal from './SettingsModal.svelte';

describe('Popup', () => {
  it('renders correctly', () => {
    const { getByText } = render(SettingsModal, {
      showModal: false,
      onConfirm: () => null,
    });

    expect(getByText('Verb Selector')).toBeInTheDocument();
  });

  it('has a confirm button that calls the onConfirm prop on click', async () => {
    const mockOnConfirm = jest.fn(() => null);
    const { getByText } = render(SettingsModal, {
      showModal: false,
      onConfirm: mockOnConfirm,
    });

    const confirmButton = getByText('Confirm!');
    await fireEvent.click(confirmButton);

    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });
});
