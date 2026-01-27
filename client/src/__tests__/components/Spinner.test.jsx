import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Spinner from '../../components/Spinner';

describe('Spinner Component', () => {
  it('should render spinner element', () => {
    render(<Spinner />);
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
  });

  it('should have loading class', () => {
    const { container } = render(<Spinner />);
    const spinnerDiv = container.querySelector('.loadingSpinnerContainer');
    expect(spinnerDiv).toBeInTheDocument();
  });
});

