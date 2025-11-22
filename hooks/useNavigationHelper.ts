import { useRouter, useSegments } from "expo-router";
import { useCallback } from "react";

export const useNavigationHelper = () => {
  const router = useRouter();
  const segments = useSegments();

  const goBack = useCallback(() => {
    const currentRoute = segments.join("/");

    if (segments[0] === "property") {
      router.replace("/(tabs)");
      return;
    }

    if (segments[0] === "settings") {
      router.replace("/(tabs)/profile");
      return;
    }

    if (segments[0] === "(tabs)") {
      return;
    }

    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)");
    }
  }, [segments, router]);

  const navigateTo = useCallback(
    (path: string, resetStack: boolean = false) => {
      if (resetStack) {
        router.replace(path as any);
      } else {
        router.push(path as any);
      }
    },
    [router],
  );

  const goToTabs = useCallback(() => {
    router.replace("/(tabs)");
  }, [router]);

  const goToWelcome = useCallback(() => {
    router.replace("/");
  }, [router]);

  const canSafelyGoBack = useCallback(() => {
    if (segments[0] === "(tabs)") {
      return false;
    }

    return router.canGoBack();
  }, [segments, router]);

  const getCurrentRoute = useCallback(() => {
    return segments.join("/");
  }, [segments]);

  const isInAuthFlow = useCallback(() => {
    return segments[0] === "(auth)";
  }, [segments]);

  const isInTabs = useCallback(() => {
    return segments[0] === "(tabs)";
  }, [segments]);

  return {
    goBack,
    navigateTo,
    goToTabs,
    goToWelcome,
    canSafelyGoBack,
    getCurrentRoute,
    isInAuthFlow,
    isInTabs,
  };
};
