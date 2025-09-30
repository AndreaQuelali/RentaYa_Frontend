import { Link } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ModalScreen() {
  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ThemedText type="title">This is a modal</ThemedText>
      <Link href="/">
        <ThemedText style={{ marginTop: 15, paddingVertical: 15 }} type="link">Go to home screen</ThemedText>
      </Link>
    </ThemedView>
  );
}


