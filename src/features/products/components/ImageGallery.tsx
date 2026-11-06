import { memo, useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  useWindowDimensions,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { colors, radius, spacing } from '@/shared/theme';

type ImageGalleryProps = {
  images: string[];
  title: string;
};

export const ImageGallery = memo(function ImageGalleryView({
  images,
  title,
}: ImageGalleryProps) {
  const { width } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScrollEnd = ({
    nativeEvent,
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    setActiveIndex(Math.round(nativeEvent.contentOffset.x / width));
  };

  return (
    <View>
      <FlatList
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item}
        onMomentumScrollEnd={handleScrollEnd}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        renderItem={({ item, index }) => (
          <Image
            accessibilityLabel={`${title}, image ${index + 1} of ${
              images.length
            }`}
            source={{ uri: item }}
            style={[styles.image, { width, height: width }]}
            resizeMode="contain"
          />
        )}
      />
      {images.length > 1 ? (
        <View style={styles.dots}>
          {images.map((image, index) => (
            <View
              key={image}
              style={[styles.dot, index === activeIndex && styles.activeDot]}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  image: {
    backgroundColor: colors.surfaceMuted,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingTop: spacing.md,
  },
  dot: {
    width: spacing.sm,
    height: spacing.sm,
    backgroundColor: colors.border,
    borderRadius: radius.pill,
  },
  activeDot: {
    backgroundColor: colors.primary,
  },
});
