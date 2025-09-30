import { Text, type TextProps } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
  className?: string;
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  className = '',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  let typeClass = '';
  switch (type) {
    case 'default':
      typeClass = 'text-base leading-6';
      break;
    case 'defaultSemiBold':
      typeClass = 'text-base leading-6 font-semibold';
      break;
    case 'title':
      typeClass = 'text-4xl font-bold leading-8';
      break;
    case 'subtitle':
      typeClass = 'text-lg leading-7';
      break;
    case 'link':
      typeClass = 'text-base text-blue-500 underline';
      break;
    default:
      typeClass = '';
  }

  const combinedClassName = `${typeClass} ${className}`.trim();

  return (
    <Text
      style={[{ color }, style]}
      className={combinedClassName}
      {...rest}
    />
  );
}