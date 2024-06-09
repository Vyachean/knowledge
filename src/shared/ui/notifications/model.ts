import { random } from 'lodash-es';
import { defineStore } from 'pinia';
import { reactive } from 'vue';

export type State =
  | 'danger'
  | 'warning'
  | 'success'
  | 'info'
  | 'primary'
  | 'link';

type Notification = {
  content: string;
  timeout?: number;
  state?: State;
};

export const useNotificationSet = defineStore('notifications', () => {
  const notificationSet: Map<
    ReturnType<typeof setTimeout>,
    Notification
  > = reactive(new Map());

  const removeNotification = (timeoutID: ReturnType<typeof setTimeout>) => {
    notificationSet.delete(timeoutID);
    clearTimeout(timeoutID);
  };

  return {
    set: notificationSet,
    add: (notification: Notification) => {
      const timeout = notification.timeout ?? 5e3;

      const timeoutID =
        timeout === Infinity
          ? random(1e10)
          : setTimeout(() => {
              removeNotification(timeoutID);
            }, timeout);
      notificationSet.set(timeoutID, notification);

      return removeNotification;
    },
    remove: removeNotification,
  };
});

export const useNotification = () => {
  const { add } = useNotificationSet();
  return {
    add,
    addDanger: (n: Notification) => add({ ...n, state: 'danger' }),
    addSuccess: (n: Notification) => add({ ...n, state: 'success' }),
    addInfo: (n: Notification) => add({ ...n, state: 'info' }),
  };
};
