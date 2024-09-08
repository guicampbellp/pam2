// app/_layout.tsx
import { Tabs } from 'expo-router';

export default function Layout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: () => (
            <Icon name="home" size={24} color="black" />
          ),
        }}
      />
    </Tabs>
  );
}
