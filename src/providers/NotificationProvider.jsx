import { useEffect, useRef, useState } from 'react';
import { registerForPushNotificationsAsync } from '../lib/notifications.js';
import * as Notifications from 'expo-notifications';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthProvider';
import { useRouter } from 'expo-router';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const NotificationProvider = ({ children }) => {
  const [expoPushToken, setExpoPushToken] = useState();
  const { session } = useAuth();

  const notificationListener = useRef();
  const responseListener = useRef();
  const router = useRouter();

  const savePushToken = async (newToken) => {
    if (!session?.id || !newToken) return;

    setExpoPushToken(newToken);
    // 1. Get user's existing token
    const { data, error } = await supabase
      .from('profile')
      .select('expo_push_token')
      .eq('id', session.id)
      .single();

    if (error) {
      return;
    }

    const existingToken = data?.expo_push_token;
    console.log(existingToken)

    // 2. Only update if different
    if (existingToken !== newToken) {
      await supabase
        .from('profile')
        .update({ expo_push_token: newToken })
        .eq('id', session.id);
    } else {
    }
  };

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => savePushToken(token));

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;
        if (data?.screen) {
          router.push('/');
        } else {
          router.push('/');
        }
      });

    return () => {
      if (notificationListener.current) {
        Notifications.current?.remove();
      }
      if (responseListener.current) {
        Notifications.current?.remove();
      }
    };
  }, [session, expoPushToken]);

  return <>{children}</>;
};

export default NotificationProvider;
