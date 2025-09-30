import Svg, { Path } from 'react-native-svg';

type Props = {
  size?: number;
  color?: string;
  strokeWidth?: number;
};

export default function Logo({ size = 96, color = '#FFFFFF', strokeWidth = 3.5 }: Props) {
   return (
    <Svg width={size} height={size} viewBox="0 0 96 96" fill="none">
      <Path
        d="M16 48L48 22l32 26v26a4 4 0 0 1-4 4H20a4 4 0 0 1-4-4V48Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <Path
        d="M38 60c2.2 4 7.8 6 10 6s7.8-2 10-6"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </Svg>
    
  );
}
