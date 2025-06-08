"use client";

import { useEffect, useRef } from "react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useSession } from "next-auth/react";
import {
  selectIsAuthenticated,
  selectIsInitialized,
  selectToken,
} from "@/store/slices/auth/authSelectors";
import { initializeAuth, setUser } from "@/store/slices/auth/authSlice";
import { fetchCurrentUser } from "@/store/slices/auth/authThunks";

// Extend NextAuth Session to include id, accessToken, refreshToken
interface ExtendedSession {
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  accessToken?: string | null;
  refreshToken?: string | null;
}

export default function InitAuthClient() {
  const dispatch = useAppDispatch();
  const isInitialized = useAppSelector(selectIsInitialized);
  const token = useAppSelector(selectToken);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const hasFetchedUser = useAppSelector((state) => state.auth.hasFetchedUser);

  const { data: session, status } = useSession() as { data: ExtendedSession | null; status: string };
  const hasFetched = useRef(false);

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  useEffect(() => {
    if (
      isInitialized &&
      token &&
      !isAuthenticated &&
      !hasFetched.current &&
      !hasFetchedUser
    ) {
      hasFetched.current = true;
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, isInitialized, token, isAuthenticated, hasFetchedUser]);

  useEffect(() => {
    if (status === "authenticated" && session?.user && !isAuthenticated) {
      dispatch(
        setUser({
          id: session.user.id ?? "",
          name: session.user.name ?? "",
          email: session.user.email ?? "",
          image: session.user.image ?? "",
          token: session.accessToken ?? "",
          refreshToken: session.refreshToken ?? "",
        })
      );
    }
  }, [status, session, dispatch, isAuthenticated]);

  return null;
}
