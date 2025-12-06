import { usePostHog } from 'posthog-js/react';

export function useAnalytics() {
    try {
        const posthog = usePostHog();
        return posthog;
    } catch (e) {
        // PostHogProvider is likely missing
        return {
            identify: () => { },
            capture: () => { },
        };
    }
}
