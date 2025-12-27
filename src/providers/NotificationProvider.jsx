import { useEffect, useRef, useState } from 'react';
import { registerForPushNotificationsAsync } from '../lib/notifications.js';
import * as Notifications from 'expo-notifications';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthProvider';
import { useRouter } from 'expo-router';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
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
      console.log('Error checking existing token:', error);
      return;
    }

    const existingToken = data?.expo_push_token;

    // 2. Only update if different
    if (existingToken !== newToken) {
      console.log('Updating token in database...');
      await supabase
        .from('profile')
        .update({ expo_push_token: newToken })
        .eq('id', session.id);
    } else {
      console.log('Token already up to date — no DB write');
    }
  };

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => savePushToken(token));

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("Notification received:", notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;
        console.log('Notification tapped with data:', data);

        if (data?.screen) {
          router.push(data.screen);
        } else {
          router.push('/');
        }
      });

    return () => {
      if (notificationListener.current) {
        Notifications.subscription.remove()(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.subscription.remove()(responseListener.current);
      }
    };
  }, []);

  return <>{children}</>;
};

export default NotificationProvider;
