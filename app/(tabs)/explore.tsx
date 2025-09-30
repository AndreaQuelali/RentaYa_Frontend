import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#57c5c7', dark: '#398282' }}
      headerImage={
        <IconSymbol
          size={200}
          color="#808080"
          name="safari.fill"
        />
      }>
      <ThemedView>
        <ThemedText
          type="link"
          style={{ fontFamily: Fonts.sans, textAlign: 'center', margin: 10 }}>
          Explore
        </ThemedText>
      </ThemedView>
      
    </ParallaxScrollView>
  );
}

