import { describe, it, expect, vi, beforeEach } from 'vitest';

const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value; },
    clear: () => { store = {}; },
    removeItem: (key) => { delete store[key]; }
  };
})();

Object.defineProperty(global, 'localStorage', { value: localStorageMock });

describe('api service', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetModules();
    global.fetch = vi.fn();
  });

  it('should add Authorization header when token exists', async () => {
    localStorage.setItem('token', 'my-token');
    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ data: 'test' })
    });

    const { api } = await import('./api');
    await api.get('/test');

    expect(global.fetch).toHaveBeenCalledWith('/api/test', expect.objectContaining({
      headers: expect.objectContaining({
        'Authorization': 'Bearer my-token'
      })
    }));
  });

  it('should not add Authorization header when no token', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({})
    });

    const { api } = await import('./api');
    await api.get('/test');

    const headers = global.fetch.mock.calls[0][1].headers;
    expect(headers['Authorization']).toBeUndefined();
  });

  it('should throw on non-ok response', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ errors: ['Bad request'] })
    });

    const { api } = await import('./api');
    await expect(api.get('/test')).rejects.toEqual({
      status: 400,
      data: { errors: ['Bad request'] }
    });
  });

  it('should send POST with JSON body', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: 201,
      json: () => Promise.resolve({ id: 1 })
    });

    const { api } = await import('./api');
    await api.post('/test', { name: 'test' });

    expect(global.fetch).toHaveBeenCalledWith('/api/test', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ name: 'test' })
    }));
  });

  it('should send PATCH with JSON body', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ id: 1 })
    });

    const { api } = await import('./api');
    await api.patch('/test/1', { titulo: 'updated' });

    expect(global.fetch).toHaveBeenCalledWith('/api/test/1', expect.objectContaining({
      method: 'PATCH',
      body: JSON.stringify({ titulo: 'updated' })
    }));
  });
});
