import { render, screen, waitForElementToBeRemoved, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import Index from '../pages/Index';
import axios from '../../../shared/utils/axios';
import { AxiosError } from 'axios';

vi.mock('../../../shared/utils/axios', async () => {
    return {
        default: {
            post: vi.fn(),
        }
    }
})

describe('Index', () => {
    it('returns error messages on empty login fields', async () => {
        render(<Index />)

        const loginSection = screen.getByRole('heading', { name: /login/i, level: 1 }).closest('article');
        if (!loginSection) throw new Error('Login section not found');

        const emailInput = within(loginSection).getByLabelText(/email/i);
        const passwordInput = within(loginSection).getByLabelText(/password/i);
        const submitButton = within(loginSection).getByRole('button', { name: /login/i });

        await userEvent.click(submitButton);
        expect(await screen.findByText('Email is required')).toBeInTheDocument();
        expect(await screen.findByText('Password is required')).toBeInTheDocument();

        await userEvent.type(emailInput, 'test@example.com');
        await userEvent.clear(passwordInput);
        await userEvent.click(submitButton);
        expect(await screen.findByText('Password is required')).toBeInTheDocument();

        await userEvent.clear(emailInput)
        await userEvent.type(passwordInput, 'password123');
        await userEvent.click(submitButton);
        expect(await screen.findByText('Email is required')).toBeInTheDocument();
    });

    it("returns error on invalid credentials", async () => {
        const mockError = new AxiosError(
            'Unauthorized',
            '401',
            undefined,
            undefined,
            {
                status: 401,
                data: { message: "Email or password incorrect" }
            } as any
        );
        vi.mocked(axios.post).mockRejectedValueOnce(mockError);

        render(<Index />)

        const loginForm = screen.getByRole('heading', { name: /login/i, level: 1 }).closest('article');
        if (!loginForm) throw new Error('Login section not found');

        const emailInput = within(loginForm).getByLabelText(/email/i);
        const passwordInput = within(loginForm).getByLabelText(/password/i);
        const submitButton = within(loginForm).getByRole('button', { name: /login/i });

        await userEvent.type(emailInput, 'wrong@gmail.com');
        await userEvent.type(passwordInput, 'wrongaPass');
        await userEvent.click(submitButton);

        expect(await screen.findByText(/Email or password incorrect/i)).toBeInTheDocument();

        expect(passwordInput).toHaveValue('');
    });
})