// Subscription system removed — all users are treated as having full access.
export function useSubscription(_userId: string | undefined) {
  return { subscription: null, isPremium: true, loading: false };
}
