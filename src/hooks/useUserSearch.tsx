import { useState, useEffect, useMemo } from 'react';
import debounce from 'lodash/debounce';
import { useKeycloak } from './useKeycloak';

export interface UserOption {
  user_id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  is_admin: boolean;
  roles: string[];
}

export function useUserSearch(
  query: string,
  page: number = 1,
  limit: number = 10
) {
  const { keycloak } = useKeycloak();
  const [options, setOptions] = useState<UserOption[]>([]);
  const [loading, setLoading] = useState(false);

  // Debounced fetch to avoid firing on every keystroke
  const fetchUsers = useMemo(
    () =>
      debounce(async (q: string) => {
        if (!keycloak?.token) {
          setOptions([]);
          return;
        }
        setLoading(true);
        try {
          const url = new URL(`http://localhost:8000/api/v1/users/search`);
          url.searchParams.set('q', q);
          url.searchParams.set('page', String(page));
          url.searchParams.set('limit', String(limit));

          const res = await fetch(url.toString(), {
            headers: {
              Authorization: `Bearer ${keycloak.token}`,
            },
          });
          if (res.ok) {
            const data: UserOption[] = await res.json();
            setOptions(data);
          } else {
            console.error('User search failed', res.status, await res.text());
            setOptions([]);
          }
        } catch (err) {
          console.error('Network error during user search', err);
          setOptions([]);
        } finally {
          setLoading(false);
        }
      }, 300),
    [keycloak?.token, page, limit]
  );

  // Trigger fetch when query changes
  useEffect(() => {
    if (query.length >= 2) {
      fetchUsers(query);
    } else {
      setOptions([]);
    }
  }, [query, fetchUsers]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      fetchUsers.cancel();
    };
  }, [fetchUsers]);

  return { options, loading };
}