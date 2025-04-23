// src/supabaseAPI.test.js
import { supabase } from './supabaseFetch';

// Mock Supabase Auth methods
jest.mock('@supabase/supabase-js', () => {
    return {
        createClient: () => ({
            auth: {
                signInWithPassword: jest.fn(),
                signInWithOAuth: jest.fn(), // Ensure this method is properly mocked
            },
        }),
    };
});

describe('Supabase API Client', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('signInWithPassword should call Supabase auth method with correct parameters', async () => {
        const email = 'test@example.com';
        const password = 'password123';

        const mockResponse = { data: { user: { id: '123' } }, error: null };
        supabase.auth.signInWithPassword.mockResolvedValueOnce(mockResponse);

        const result = await supabase.auth.signInWithPassword({ email, password });

        expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({ email, password });
        expect(result).toEqual(mockResponse);
    });

    test('signInWithPassword should handle errors', async () => {
        const email = 'test@example.com';
        const password = 'wrongpassword';

        const mockError = { data: null, error: { message: 'Invalid login credentials' } };
        supabase.auth.signInWithPassword.mockResolvedValueOnce(mockError);

        const result = await supabase.auth.signInWithPassword({ email, password });

        expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({ email, password });
        expect(result.error.message).toBe('Invalid login credentials');
    });

    test('signInWithOAuth should call Supabase auth method for Google login', async () => {
        const provider = 'google';

        const mockResponse = { data: { provider: 'google' }, error: null };
        supabase.auth.signInWithOAuth.mockResolvedValueOnce(mockResponse);

        const result = await supabase.auth.signInWithOAuth({ provider });

        expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({ provider });
        expect(result.data.provider).toBe('google');
    });

    test('signInWithOAuth should handle errors', async () => {
        const provider = 'google';

        const mockError = { data: null, error: { message: 'Google authentication failed' } };
        supabase.auth.signInWithOAuth.mockResolvedValueOnce(mockError);

        const result = await supabase.auth.signInWithOAuth({ provider });

        expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({ provider });
        expect(result.error.message).toBe('Google authentication failed');
    });
});

